"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Paperclip } from "lucide-react";

interface FileWithPreview extends File {
    preview: string;
}

type MultiImageDropzoneProps = {
    onFilesChange: (files: File[]) => void;
    initialFiles?: File[];
};

function formatBytes(bytes: number, decimals = 2): string {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function MultiImageDropzone({ onFilesChange, initialFiles = [] }: MultiImageDropzoneProps) {
    const [files, setFiles] = useState<FileWithPreview[]>([]);

    useEffect(() => {
         // Cleanup old previews to avoid memory leaks
         return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
             fileRejections.forEach(rejection => {
                 toast.error(`${rejection.file.name}: ${rejection.errors[0]?.message}`);
             });
        }
        
        if (acceptedFiles.length > 0) {
            const newFiles = acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }));
            
            setFiles(prev => {
                const updated = [...prev, ...newFiles];
                onFilesChange(updated);
                return updated;
            });
        }
    }, [onFilesChange]);

    const handleRemoveFile = (indexToRemove: number) => {
        setFiles(prev => {
            const updated = prev.filter((_, index) => index !== indexToRemove);
             const fileToRevoke = prev[indexToRemove];
             if (fileToRevoke?.preview) {
                 URL.revokeObjectURL(fileToRevoke.preview);
             }
             onFilesChange(updated);
            return updated;
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 
            "image/png": [".png"], 
            "image/jpeg": [".jpeg", ".jpg"], 
            "image/webp": [".webp"],
            "image/gif": [".gif"],
            "image/svg+xml": [".svg"] 
        },
    });

    return (
        <div className="w-full space-y-4">
             <div 
                {...getRootProps()} 
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/20 hover:bg-primary/5"}`}
            >
                <input {...getInputProps()} />
                <MdOutlineFileUpload className="w-10 h-10 text-muted-foreground/50" />
                <p className="mt-2 px-10 text-sm text-center text-muted-foreground">
                    {isDragActive ? "Drop images here..." : "Drag & drop images, or click to select"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    (JPEG, PNG, WEBP, GIF, SVG)
                </p>
            </div>

            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file, index) => (
                         <div key={`${file.name}-${index}`} className="relative w-full flex items-center justify-between p-2 pl-2 border rounded-md bg-accent">
                            <div className="flex items-center gap-4 grow min-w-0">
                                <img
                                    src={file.preview}
                                    alt={file.name}
                                    className="h-10 w-10 object-cover bg-background border rounded-md shrink-0"
                                     onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {formatBytes(file.size)}
                                    </span>
                                </div>
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="ml-2 h-7 w-7 shrink-0" onClick={() => handleRemoveFile(index)}>
                                <IoClose className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
