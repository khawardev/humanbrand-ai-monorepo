"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PiFile, PiFilePdfFill, PiFileDocFill, PiFileXlsFill, PiFilePptFill, PiFileCsvFill, PiFileFill } from "react-icons/pi";

type FileDropzoneProps = {
    onFilesChange: (files: File[]) => void;
    initialFiles?: File[] | null;
};

const fileIcons: { [key: string]: any } = {
    pdf: <PiFilePdfFill className="h-6 w-6 text-muted-foreground shrink-0" />,
    doc: <PiFileDocFill className="h-6 w-6 text-muted-foreground shrink-0" />,
    docx: <PiFileDocFill className="h-6 w-6 text-muted-foreground shrink-0" />,
    xls: <PiFileXlsFill className="h-6 w-6 text-muted-foreground shrink-0" />,
    xlsx: <PiFileXlsFill className="h-6 w-6 text-muted-foreground shrink-0" />,
    ppt: <PiFilePptFill className="h-6 w-6 text-muted-foreground shrink-0" />,
    pptx: <PiFilePptFill className="h-6 w-6 text-muted-foreground shrink-0" />,
    csv: <PiFileCsvFill className="h-6 w-6 text-muted-foreground shrink-0" />,
    txt: <PiFileFill className="h-6 w-6 text-muted-foreground shrink-0" />,
};

const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    return fileIcons[extension] || <PiFile className="h-6 w-6 text-muted-foreground shrink-0" />;
};

function formatBytes(bytes: number, decimals = 2): string {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function FileDropzone({ onFilesChange, initialFiles }: FileDropzoneProps) {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>(initialFiles || []);

    useEffect(() => {
        setUploadedFiles(initialFiles || []);
    }, [initialFiles]);

    const handleFileChange = (files: File[]) => {
        setUploadedFiles(files);
        onFilesChange(files);
    };

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
            toast.error("One or more files were rejected. Please check the accepted file types.");
        }

        if (acceptedFiles.length > 0) {
            const newFiles = [...uploadedFiles, ...acceptedFiles];
            handleFileChange(newFiles);
        }
    }, [uploadedFiles]);

    const handleRemoveFile = (fileIndex: number) => {
        const remainingFiles = uploadedFiles.filter((_, index) => index !== fileIndex);
        handleFileChange(remainingFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        accept: {
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            "text/plain": [".txt"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            "text/csv": [".csv"],
            "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
        },
    });

    if (uploadedFiles && uploadedFiles.length > 0) {
        return (
            <div className="flex flex-col gap-2 mt-4 w-full">
                <div className="flex flex-col w-full gap-3">
                    {uploadedFiles.map((file, index) => (
                        <div key={index} className="relative flex w-full items-center justify-between p-2 pl-4 border rounded-md bg-border/50">
                            <div className="flex items-center gap-4 flex-grow min-w-0">
                                {getFileIcon(file.name)}
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
                                    <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
                                </div>
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="ml-2 h-7 w-7 shrink-0" onClick={() => handleRemoveFile(index)}>
                                <IoClose className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div {...getRootProps()} className={`flex flex-col items-center justify-center w-full p-4 mt-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/20 hover:bg-primary/5"}`}>
                    <input {...getInputProps()} />
                    <p className="text-sm text-center text-muted-foreground">
                        Add more files...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div {...getRootProps()} className={`flex flex-col items-center justify-center w-full min-h-[200px] bg-border/50 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/20 hover:bg-primary/5"}`}>
            <input {...getInputProps()} />
            <MdOutlineFileUpload className="w-12 h-12 text-muted-foreground/50" />
            <div className="mt-2 px-10 text-sm text-center text-muted-foreground">
                {isDragActive ? "Drop the files here..." : <>
                    <p> (PDF, DOCX, TXT, XLSX, CSV, PPTX)</p> <p>Drag & drop files, or click to select</p>
                </>}
            </div>
        </div>
    );
}