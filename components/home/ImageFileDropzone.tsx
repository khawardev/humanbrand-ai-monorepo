// components/home/ImageFileDropzone.tsx

"use client";

import { useCallback, useEffect } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FileWithPreview extends File {
    preview: string;
}

type ImageFileDropzoneProps = {
    files: any[];
    setFiles: (files: FileWithPreview[]) => void;
    maxFiles?: number;
};

function formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function ImageFileDropzone({
    files,
    setFiles,
    maxFiles = 4,
}: ImageFileDropzoneProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            if (fileRejections.length > 0) {
                const firstErrorMessage = fileRejections[0].errors[0].message;
                toast.error(firstErrorMessage);
                return;
            }

            if (files.length + acceptedFiles.length > maxFiles) {
                toast.error(`You can only upload a total of ${maxFiles} files.`);
                return;
            }

            const newFilesWithPreview = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );

            setFiles([...files, ...newFilesWithPreview]);
        },
        [files, setFiles, maxFiles]
    );

    const removeFile = (indexToRemove: number) => {
        URL.revokeObjectURL(files[indexToRemove].preview);
        const updatedFiles = files.filter((_, index) => index !== indexToRemove);
        setFiles(updatedFiles);
    };

    useEffect(() => {
        return () => {
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        };
    }, [files]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles,
        accept: {
            "image/png": [".png"],
            "image/jpeg": [".jpeg", ".jpg"],
            "image/gif": [".gif"],
            "image/webp": [".webp"],
        },
    });

    return (
        <div className="flex flex-col items-center w-full gap-4">
            <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                          ${isDragActive
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
            >
                <input {...getInputProps()} />
                <MdOutlineFileUpload className="w-10 h-10 text-muted-foreground" />
                <p className="mt-2 px-10 text-sm text-center text-muted-foreground">
                    {isDragActive
                        ? "Drop the image here..."
                        : `Drag & drop an image, or click to select (Max: ${maxFiles})`}
                </p>
            </div>

            {files.length > 0 && (
                <div className="flex flex-col gap-4 w-full">
                    {files.map((file, index) => (
                        <div
                            key={file.name + index}
                            className="relative w-full flex items-center justify-between p-2 pl-2 border rounded-md bg-muted/50"
                        >
                            <div className="flex items-center gap-4 flex-grow min-w-0">
                                <img
                                    src={file.preview}
                                    alt={file.name}
                                    className="h-12 w-12 object-cover rounded-md flex-shrink-0"
                                    onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                                />
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
                    ))}
                </div>
            )}
        </div>
    );
}