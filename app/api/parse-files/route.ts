import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";
import * as mammoth from "mammoth";
import * as XLSX from "xlsx";
import * as Papa from "papaparse";
import JSZip from "jszip";

// Supported file types - exactly matching your frontend dropzone accept types
const SUPPORTED_TYPES = {
    PDF: "application/pdf",
    DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    TXT: "text/plain",
    XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    CSV: "text/csv",
    PPTX: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

// Helper function to determine file type
function getFileType(mimeType: string): string | null {
    const typeMap = Object.entries(SUPPORTED_TYPES).find(
        ([_, type]) => type === mimeType
    );
    return typeMap ? typeMap[0] : null;
}

// PDF Parser
async function parsePDF(buffer: Buffer): Promise<string> {
    const pdfParser = new (PDFParser as any)(null, 1);

    return new Promise((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", (errData: any) => {
            console.error("PDF parsing error:", errData.parserError);
            reject(new Error("Failed to parse PDF"));
        });

        pdfParser.on("pdfParser_dataReady", () => {
            const parsedText = pdfParser.getRawTextContent();
            resolve(parsedText);
        });

        pdfParser.parseBuffer(buffer);
    });
}

// DOCX Parser
async function parseDOCX(buffer: Buffer): Promise<string> {
    try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } catch (error) {
        console.error("Error Parsing Docx", error);
        throw new Error("Failed to parse DOCX file");
    }
}

// TXT Parser
async function parseTXT(buffer: Buffer): Promise<string> {
    try {
        return buffer.toString("utf-8");
    } catch (error) {
        console.error("Error Parsing Txt", error);
        throw new Error("Failed to parse TXT file");
    }
}

// XLSX Parser
async function parseExcel(buffer: Buffer): Promise<string> {
    try {
        const workbook = XLSX.read(buffer, { type: "buffer" });
        let allText = "";

        workbook.SheetNames.forEach((sheetName, index) => {
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            allText += `Sheet ${index + 1}: ${sheetName}\n`;
            jsonData.forEach((row: any) => {
                if (Array.isArray(row) && row.length > 0) {
                    allText += row.join("\t") + "\n";
                }
            });
            allText += "\n";
        });

        return allText;
    } catch (error) {
        console.error("Error Parsing Excel", error);
        throw new Error("Failed to parse Excel file");
    }
}

// CSV Parser
async function parseCSV(buffer: Buffer): Promise<string> {
    try {
        const csvText = buffer.toString("utf-8");
        const results = Papa.parse(csvText, {
            header: false,
            skipEmptyLines: true,
        });

        let allText = "";
        results.data.forEach((row: any) => {
            if (Array.isArray(row)) {
                allText += row.join("\t") + "\n";
            }
        });

        return allText;
    } catch (error) {
        console.error("Error Parsing CSV", error);
        throw new Error("Failed to parse CSV file");
    }
}

// PPTX Parser
async function parsePPTX(buffer: Buffer): Promise<string> {
    try {
        const zip = new JSZip();
        const zipContent = await zip.loadAsync(buffer);
        let allText = "";
        let slideNumber = 1;

        // Extract text from slides
        for (const filename in zipContent.files) {
            if (filename.startsWith("ppt/slides/slide") && filename.endsWith(".xml")) {
                const slideContent = await zipContent.files[filename].async("string");

                // Extract text from XML (basic extraction)
                const textMatches = slideContent.match(/<a:t[^>]*>([^<]*)<\/a:t>/g);
                if (textMatches) {
                    allText += `Slide ${slideNumber}:\n`;
                    textMatches.forEach(match => {
                        const text = match.replace(/<[^>]*>/g, "").trim();
                        if (text) {
                            allText += text + "\n";
                        }
                    });
                    allText += "\n";
                    slideNumber++;
                }
            }
        }

        return allText || "No text content found in presentation";
    } catch (error) {
        console.error("Error Parsing PPTX file", error);
        throw new Error("Failed to parse PPTX file");
    }
}

// Main parser function
async function parseDocument(buffer: Buffer, fileType: string): Promise<string> {
    switch (fileType) {
        case "PDF":
            return await parsePDF(buffer);
        case "DOCX":
            return await parseDOCX(buffer);
        case "TXT":
            return await parseTXT(buffer);
        case "XLSX":
            return await parseExcel(buffer);
        case "CSV":
            return await parseCSV(buffer);
        case "PPTX":
            return await parsePPTX(buffer);
        default:
            throw new Error(`Unsupported file type: ${fileType}`);
    }
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];

        // Validate files exist
        if (!files || files.length === 0) {
            return NextResponse.json(
                { message: "No files provided" },
                { status: 400 }
            );
        }

        let combinedText = "";
        const processedFiles = [];

        // Process each file
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Validate file type
            const fileType = getFileType(file.type);
            if (!fileType) {
                return NextResponse.json(
                    {
                        message: `Unsupported file type: ${file.type} for file "${file.name}". Supported types: PDF, DOCX, TXT, XLSX, CSV, PPTX`
                    },
                    { status: 400 }
                );
            }

            try {
                // Read file data
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                // Parse the document
                const parsedText = await parseDocument(buffer, fileType);

                // Add file separator if multiple files (matching your expected format)
                if (files.length > 1) {
                    combinedText += `\n\n=== FILE: ${file.name} ===\n\n`;
                }
                combinedText += parsedText;

                processedFiles.push({
                    name: file.name,
                    size: file.size,
                    type: fileType,
                    success: true,
                });

            } catch (error) {
                console.error(`Error parsing file ${file.name}:`, error);
                processedFiles.push({
                    name: file.name,
                    size: file.size,
                    type: fileType,
                    success: false,
                    error: error instanceof Error ? error.message : "Failed to parse file",
                });
            }
        }

        // Check if any files were successfully parsed
        const successfulFiles = processedFiles.filter(f => f.success);
        if (successfulFiles.length === 0) {
            return NextResponse.json(
                { message: "Failed to parse any files" },
                { status: 500 }
            );
        }

        // Return response matching your frontend expectations
        return NextResponse.json({
            message: `Successfully parsed ${successfulFiles.length} of ${files.length} files`,
            parsedText: combinedText, // This is what your frontend expects
            files: processedFiles,
            success: true,
        });

    } catch (error) {
        console.error("Document parsing error:", error);
        return NextResponse.json(
            {
                message: error instanceof Error ? error.message : "Failed to parse files"
            },
            { status: 500 }
        );
    }
}