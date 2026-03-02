"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LineSpinner } from "@/components/shared/Spinner";
import { PiFile, PiFilePdfFill, PiFileDocFill, PiFileXlsFill, PiFilePptFill, PiFileCsvFill, PiFileFill } from "react-icons/pi";
import { cn } from "@/lib/utils";
import { Paperclip } from "lucide-react";

type FileInfo = {
    name: string;
    size: number;
};

type FileDropzoneProps = {
    onFilesChange: (data: { files: File[] | null; parsedText: string | null; fileInfos: FileInfo[] | null }) => void;
    initialFileInfos?: FileInfo[] | null;
    compact?: boolean;
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

export function FileDropzone({ onFilesChange, initialFileInfos, compact }: FileDropzoneProps) {
    const [fileInfos, setFileInfos] = useState<FileInfo[] | null>(initialFileInfos || null);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setFileInfos(initialFileInfos || null);
        if (!initialFileInfos || initialFileInfos.length === 0) {
            setUploadedFiles([]);
        }
    }, [initialFileInfos]);

    const MAX_TOKENS = 1_000_000;

    function estimateTokens(text: string): number {
        return Math.ceil(text.length / 4);
    }

    const parseFiles = async (files: any[]) => {
        if (files.length === 0) {
            onFilesChange({ files: null, parsedText: null, fileInfos: null });
            setFileInfos(null);
            setUploadedFiles([]);
            return;
        }

        const MAX_SIZE = 4 * 1024 * 1024; // 4MB
        const totalSize = files.reduce((sum, f) => sum + f.size, 0);

        if (totalSize > MAX_SIZE) {
            toast.error("Total file size exceeds 4MB limit. Please upload smaller files.");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            files.forEach(file => formData.append("files", file));

            const response = await fetch("/api/parse-files", { method: "POST", body: formData });
            if (response.ok) {
                const { parsedText } = await response.json();

                const tokenCount = estimateTokens(parsedText);

                if (tokenCount > MAX_TOKENS) {
                    toast.warning(
                        `Your file content is about ${tokenCount.toLocaleString()} tokens, which exceeds the model's ${MAX_TOKENS.toLocaleString()} token limit. Please upload a smaller file.`
                    );
                    return
                }

                const newFileInfos = files.map(f => ({ name: f.name, size: f.size }));
                onFilesChange({ files, parsedText, fileInfos: newFileInfos });
                setFileInfos(newFileInfos);
                setUploadedFiles(files);
            } else {
                let errorMessage = "Failed to parse files";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    if (response.status === 413) {
                        errorMessage = "File is too large. Please upload files smaller than 4MB.";
                    } else {
                        errorMessage = `Server error: ${response.statusText}`;
                    }
                }
                toast.error(errorMessage);
                onFilesChange({ files: null, parsedText: null, fileInfos: null });
            }
        } catch (error) {
            console.error("An error occurred while parsing the files.", error);
            toast.error("An error occurred while parsing the files.");
            onFilesChange({ files: null, parsedText: null, fileInfos: null });
        } finally {
            setIsLoading(false);
        }
    };


    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
            toast.error("One or more files were rejected. Please check the accepted file types.");
        }

        if (acceptedFiles.length > 0) {
            const newFiles = [...uploadedFiles, ...acceptedFiles];
            parseFiles(newFiles);
        }
    }, [uploadedFiles]);

    const handleRemoveFile = (fileIndex: number) => {
        const remainingFiles = uploadedFiles.filter((_, index) => index !== fileIndex);
        parseFiles(remainingFiles);
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
        disabled: isLoading,
    });

    if (isLoading) {
        return (
            <div className={cn("flex items-center justify-center w-full text-sm text-muted-foreground", compact ? "h-12" : "h-32")}>
                <LineSpinner>Parsing... Please wait..</LineSpinner>
            </div>
        );
    }

    if (fileInfos && fileInfos.length > 0) {
        return (
            <div className="flex flex-col gap-2 mt-4 w-full">
                <div className="flex w-full gap-3 flex-wrap">
                    {fileInfos.map((info, index) => (
                        <div key={index} className="relative flex items-center justify-between p-2 pl-4 border rounded-md bg-accent max-w-sm">
                            <div className="flex items-center gap-4 grow min-w-0">
                                {getFileIcon(info.name)}
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium text-foreground truncate max-w-[150px]">{info.name}</span>
                                    {!compact && <span className="text-xs text-muted-foreground">{formatBytes(info.size)}</span>}
                                </div>
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="ml-2 h-7 w-7 shrink-0" onClick={() => handleRemoveFile(index)}>
                                <IoClose className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div {...getRootProps()} className={cn(`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/20 hover:bg-primary/5"}`, compact ? "p-2 min-h-[40px]" : "p-4 mt-2")}>
                    <input {...getInputProps()} />
                     {compact ? (
                        <p className="text-xs text-center text-muted-foreground">Add more...</p>
                    ) : (
                        <p className="text-sm text-center text-muted-foreground">Add more files...</p>
                    )}
                </div>
            </div>
        );
    }

    if (compact) {
          return (
             <div {...getRootProps()} className={cn(`flex items-center justify-center gap-2 w-full p-2 border border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/20 hover:bg-primary/5"}`)}>
                <input {...getInputProps()} />
                <Paperclip className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Attach files to chat...</span>
             </div>
        )
    }

    return (
        <div {...getRootProps()} className={`flex flex-col items-center justify-center w-full h-34 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/20 hover:bg-primary/5"}`}>
            <input {...getInputProps()} />
            <MdOutlineFileUpload className="w-12 h-12 text-muted-foreground/50" />
            <div className="mt-2 px-10 text-sm text-center text-muted-foreground">
                {isDragActive ? "Drop the files here..." : <>
                    <p> (PDF, DOCX, TXT, XLSX, CSV, PPTX)</p> <p>Drag & drop files, or click to select</p>
                </>}
            </div>
        </div>
    );
}