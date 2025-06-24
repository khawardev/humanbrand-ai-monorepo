"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FileWithPreview extends File {
    preview: any;
}

type ImageFileDropzoneProps = {
    onFileChange: (file: FileWithPreview | null) => void;
    initialFileInfo?: { name: string; size: number; reference_image_url?: string; } | null;
};

function formatBytes(bytes: number, decimals = 2): string {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function ImageFileDropzone({ onFileChange, initialFileInfo }: ImageFileDropzoneProps) {
    const [file, setFile] = useState<FileWithPreview | null>(null);

    useEffect(() => {
        if (initialFileInfo && !file) {
            const mockFile = {
                name: initialFileInfo?.name,
                size: initialFileInfo?.size,
                type: initialFileInfo?.name?.endsWith('.webp') ? 'image/webp' :
                    initialFileInfo?.name?.endsWith('.jpg') || initialFileInfo?.name?.endsWith('.jpeg') ? 'image/jpeg' :
                        initialFileInfo?.name?.endsWith('.png') ? 'image/png' : 'image/webp',
                lastModified: Date.now(),
                preview: initialFileInfo?.reference_image_url || '',
                arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
                slice: () => new Blob(),
                stream: () => new ReadableStream(),
                text: () => Promise.resolve(''),
            } as FileWithPreview;

            setFile(mockFile);
        }
    }, [initialFileInfo, file]);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
            toast.error(fileRejections[0].errors[0].message);
            return;
        }
        if (acceptedFiles.length > 0) {
            const newFile = Object.assign(acceptedFiles[0], {
                preview: URL.createObjectURL(acceptedFiles[0]),
            });
            setFile(newFile);
            onFileChange(newFile);
        }
    }, [onFileChange]);

    const handleRemoveFile = () => {
        if (file && file.preview && file.preview.startsWith('blob:')) {
            URL.revokeObjectURL(file.preview);
        }
        setFile(null);
        onFileChange(null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: { "image/png": [".png"], "image/jpeg": [".jpeg", ".jpg"], "image/webp": [".webp"] },
        disabled: !!file,
    });

    if (file) {
        return (
            <div className="relative w-full flex items-center justify-between p-2 pl-2 border rounded-md bg-accent">
                <div className="flex items-center gap-4 flex-grow min-w-0">
                    {file.preview && (
                        <img
                            src={file.preview}
                            alt={file.name}
                            className="h-12 w-12 object-cover bg-accent border rounded-md flex-shrink-0"
                            onError={(e) => {
                                // Handle image load errors gracefully
                                console.error('Failed to load image:', file.preview);
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    )}
                    
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-foreground truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground">
                            {formatBytes(file.size)}
                        </span>
                    </div>
                </div>
                <Button type="button" variant="ghost" size="icon" className="ml-2 h-7 w-7 flex-shrink-0" onClick={handleRemoveFile}>
                    <IoClose className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <div {...getRootProps()} className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/20 hover:bg-primary/5"}`}>
            <input {...getInputProps()} />
            <MdOutlineFileUpload className="w-10 h-10 text-muted-foreground/50" />
            <p className="mt-2 px-10 text-sm text-center text-muted-foreground">
                {isDragActive ? "Drop the image here..." : "Drag & drop an image, or click to select"}
            </p>
        </div>
    );
}