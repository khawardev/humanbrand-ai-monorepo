'use client'

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ButtonSpinner, LineSpinner } from "@/shared/spinner";
import { Copy, Download } from "lucide-react";
import { ImageFileDropzone } from "../reusable-components/uploads/ImageFileDropzone";

export function ImageGenerator({ imagePrompt, imageUrls = [], handleImageAction, isPending, onImageFileChange, imageReferenceFileInfo }: any) {
    const [prompt, setPrompt] = useState(imagePrompt);

    useEffect(() => {
        setPrompt(imagePrompt);
    }, [imagePrompt]);

    const handleGenerateClick = () => {
        if (!prompt.trim()) {
            toast.warning("Please enter an image prompt.");
            return;
        }
        handleImageAction(prompt);
    };

    const hasUploadedImage = !!imageReferenceFileInfo;
    console.log(imageReferenceFileInfo, `<-> imageReferenceFileInfo <->`);

    return (
        <section className="space-y-4 flex flex-col">
            <div>
                <span className="text-lg tracking-tight font-bold">Generate Accompanying Image</span>
                <Label htmlFor="image-prompt" className="text-sm text-muted-foreground mb-3">Image Prompt:</Label>
                <Textarea
                    id="image-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={hasUploadedImage ? "Describe how you want to edit the reference image..." : "Describe the image you want to generate..."}
                    className="min-h-[80px]"
                    maxLength={32000}
                />
            </div>
            <Label className="text-sm text-muted-foreground mt-4 mb-2">Upload Reference Image (Optional):</Label>
            <ImageFileDropzone
                onFileChange={onImageFileChange}
                initialFileInfo={imageReferenceFileInfo}
            />
            <Button className="w-full" size={'sm'} onClick={handleGenerateClick} disabled={isPending || !prompt.trim()}>
                {isPending ? <ButtonSpinner>{hasUploadedImage ? 'Editing' : 'Generating'}</ButtonSpinner> : (hasUploadedImage ? 'Edit Image' : 'Generate Image')}
            </Button>

            {isPending && <LineSpinner>Image processing may take up to 30-50 seconds...</LineSpinner>}

            {imageUrls && imageUrls.length > 0 && (
                <div className="space-y-4">
                    <Label className="text-sm text-muted-foreground ">{'Image Results'}</Label>
                    <section className="grid md:grid-cols-2 grid-cols-1 gap-6">
                        {[...imageUrls].reverse().map((url: string, index: number) => (
                            <div key={url + index} className="relative">
                                <img
                                    src={url}
                                    alt={`AI generated image ${index + 1}`}
                                    className="max-w-full max-h-[80vh] rounded-2xl shadow-lg border border-border ring-border ring-offset-background/80 ring-1 ring-offset-4 object-contain"
                                />
                                <div className="space-x-1 flex absolute top-4 right-4">
                                    <Button onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = `generated-image-${index}.png`;
                                        link.click();
                                    }} variant={'outline'} size={'icon'}><Download /></Button>
                                    <Button onClick={async () => {
                                        try {
                                            const response = await fetch(url);
                                            const blob = await response.blob();
                                            await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
                                            toast.success("Image copied to clipboard!");
                                        } catch (error) {
                                            toast.error("Failed to copy image to clipboard");
                                        }
                                    }} variant={'outline'} size={'icon'}><Copy /></Button>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            )}
        </section>
    );
}