"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LineSpinner } from "@/shared/spinner";
import { PiFilePdfFill } from "react-icons/pi";

type FileInfo = {
    name: string;
    size: number;
};

type PdfFileDropzoneProps = {
    onFileChange: (data: { file: File | null; parsedText: string | null }) => void;
    initialFileInfo?: FileInfo | null;
};

function formatBytes(bytes: number, decimals = 2): string {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function PdfFileDropzone({ onFileChange, initialFileInfo }: PdfFileDropzoneProps) {
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(initialFileInfo || null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setFileInfo(initialFileInfo || null);
    }, [initialFileInfo]);

    const parsePdf = async (file: File) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await fetch("/api/parse-pdf", { method: "POST", body: formData });

            if (response.ok) {
                const { parsedText } = await response.json();
                onFileChange({ file, parsedText });
                setFileInfo({ name: file.name, size: file.size });
            } else {
                toast.error(`Failed to parse ${file.name}`);
                onFileChange({ file: null, parsedText: null });
            }
        } catch (error) {
            console.error("An error occurred while parsing the PDF.", error);
            toast.error("An error occurred while parsing the PDF.");
            onFileChange({ file: null, parsedText: null });
        } finally {
            setIsLoading(false);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
            toast.error("Only PDF files are accepted.");
            return;
        }

        if (acceptedFiles.length > 0) {
            parsePdf(acceptedFiles[0]);
        }
    }, [onFileChange]);

    const handleRemoveFile = () => {
        setFileInfo(null);
        onFileChange({ file: null, parsedText: null });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { "application/pdf": [".pdf"] },
        disabled: !!fileInfo || isLoading,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center w-full h-32 text-sm text-muted-foreground">
                <LineSpinner>Parsing... Please wait..</LineSpinner>
            </div>
        );
    }

    if (fileInfo) {
        return (
            <div className="flex flex-col gap-4 mt-4 w-full">
                <div className="relative flex items-center justify-between p-2 pl-4 border rounded-md bg-accent">
                    <div className="flex items-center gap-4 flex-grow min-w-0">
                        <PiFilePdfFill className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-foreground truncate">{fileInfo.name}</span>
                            <span className="text-xs text-muted-foreground">{formatBytes(fileInfo.size)}</span>
                        </div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" className="ml-2 h-7 w-7 flex-shrink-0" onClick={handleRemoveFile}>
                        <IoClose className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div {...getRootProps()} className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/20 hover:bg-primary/5"}`}>
            <input {...getInputProps()} />
            <MdOutlineFileUpload className="w-12 h-12 text-muted-foreground/50" />
            <p className="mt-2 px-10 text-sm text-center text-muted-foreground">
                {isDragActive ? "Drop the PDF here..." : `Drag & drop a PDF, or click to select`}
            </p>
        </div>
    );
}