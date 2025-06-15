// components/home/image-generator.tsx

'use client'

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageFileDropzone } from "@/components/home/ImageFileDropzone";
import { generateImageAction } from "@/actions/generate-image";
import { toast } from "sonner";
import { ButtonSpinner, LineSpinner } from "@/shared/spinner";
import { Card, CardContent } from "@/components/ui/card";

interface ImageGeneratorProps {
    imagePrompt: string;
}

export function ImageGenerator({ imagePrompt }: ImageGeneratorProps) {
    const [prompt, setPrompt] = useState(imagePrompt);
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleGenerateImage = async () => {
        setGeneratedImageUrl(null);
        startTransition(async () => {
            const formData = new FormData();
            formData.append('prompt', prompt);
            if (uploadedFiles[0]) {
                formData.append('image', uploadedFiles[0]);
            }

            const result = await generateImageAction(formData);

            if (result.success && result.imageUrl) {
                setGeneratedImageUrl(result.imageUrl);
                toast.success("Image generated successfully!");
            } else {
                toast.error(result.error || "An unknown error occurred.");
            }
        });
    };

    return (
        <section className="space-y-4 flex flex-col">
            <div>
                <h4> Generate Accompanying Image</h4>
                <Label htmlFor="image-prompt" className="text-sm text-muted-foreground mt-4 mb-2">Image Prompt:</Label>
                <Textarea
                    id="image-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A photorealistic image of a futuristic car assembly line..."
                    rows={6}
                />
            </div>
            <Label className="text-sm text-muted-foreground mt-4 mb-2">Upload Reference Image (Optional):</Label>
            <ImageFileDropzone files={uploadedFiles} setFiles={setUploadedFiles} maxFiles={1} />
            <Button className="w-full" size={'sm'} onClick={handleGenerateImage} disabled={isPending || !prompt.trim()}>
                {isPending ? <ButtonSpinner>Generating</ButtonSpinner> : 'Generate Image'}
            </Button>
            {isPending && <LineSpinner>Your image is being created...</LineSpinner>}
            {generatedImageUrl && (
                <div className="mt-4">
                    <Label className="text-sm text-muted-foreground mb-2">Generated Image Result:</Label>
                    <img
                        src={generatedImageUrl}
                        alt="AI generated image"
                        width={1024}
                        height={1024}
                        className=" border w-[50%] h-auto object-contain"
                    />
                </div>
            )}
        </section>
    );
}