"use client";

import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ButtonSpinner, LineSpinner } from "@/shared/spinner";

type PdfFileDropzoneProps = {
    files: File[];
    setFiles: (files: File[]) => void;
    maxFiles?: number;
    setReferenceMaterial: (data: string) => void;
};

function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function PdfFileDropzone({
    files,
    setFiles,
    maxFiles = 4,
    setReferenceMaterial,
}: PdfFileDropzoneProps) {

    const [pdfLoading, setPdfLoading] = useState(false)

    const parsePdf = async (file: File) => {
        try {
            setPdfLoading(true);
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch("/api/upload-pdf", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const { parsedText } = await response.json();
                setReferenceMaterial(parsedText);
            } else {
                toast.error(`Failed to parse ${file.name}`);
            }
        } catch (error) {
            toast.error("An error occurred while parsing the PDF.");
        } finally {
            setPdfLoading(false);
        }
    };

    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            if (files.length + acceptedFiles.length > maxFiles) {
                toast.error(`You can only upload up to ${maxFiles} files.`);
                return;
            }

            if (fileRejections.length > 0) {
                toast.error("Only PDF files are accepted.");
            }

            if (acceptedFiles.length > 0) {
                const newFiles = [...files, ...acceptedFiles];
                setFiles(newFiles);
                parsePdf(acceptedFiles[0]);
            }
        },
        [files, setFiles, maxFiles]
    );

    const removeFile = (indexToRemove: number) => {
        const updatedFiles = files.filter((_, index) => index !== indexToRemove);
        setFiles(updatedFiles);
        setReferenceMaterial('')
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        accept: { "application/pdf": [".pdf"] },
    });

    return (
        <div className="flex flex-col items-center w-full">
            <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed hover:border-primary hover:bg-primary/5 rounded-lg cursor-pointer 
                ${isDragActive
                        ? "border-primary bg-primary/10"
                        : "border hover:border-muted-foreground/50 transition-all ease-in"
                    }`}
            >
                <input {...getInputProps()} />
                <MdOutlineFileUpload className="w-12 h-12 text-muted-foreground" />
                <p className="mt-2 px-10 text-sm text-center text-muted-foreground">
                    {isDragActive
                        ? "Drop the PDF files here..."
                        : `Drag & drop PDFs here, or click to select (Max: ${maxFiles})`}
                </p>
            </div>

            <div className="flex flex-col gap-4 mt-4 w-full">
                {pdfLoading ? (
                    <div className="flex items-center justify-center w-full mt-4 text-sm text-muted-foreground">
                        <LineSpinner>Parsing ... Please wait..</LineSpinner>
                    </div>
                ) :
                    files.map((file, index) => (
                        <div
                            key={file.name + index}
                            className="relative flex items-center justify-between p-2 pl-4 border rounded-md bg-muted/50"
                        >
                            <div className="flex items-center gap-4 flex-grow min-w-0">
                                <FileText className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium text-foreground truncate">
                                        {file.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatBytes(file.size)}
                                    </span>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="ml-2 h-7 w-7 flex-shrink-0"
                                onClick={() => removeFile(index)}
                            >
                                <IoClose className="h-4 w-4" />
                            </Button>
                        </div>
                    ))
                
                }
                
            </div>
        </div>
    );
}
