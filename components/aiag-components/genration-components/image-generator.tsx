// 'use client'

// import React, { useState, useTransition } from "react";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { ImageFileDropzone } from "@/components/aiag-components/reusable-components/uploads/ImageFileDropzone";
// import { generateImageAction } from "@/actions/generate-image";
// import { toast } from "sonner";
// import { ButtonSpinner, LineSpinner } from "@/shared/spinner";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { IoIosArrowDown } from "react-icons/io";
// import { Copy, Download } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// interface ImageGeneratorProps {
//     imagePrompt: string;
// }

// export function ImageGenerator({ imagePrompt }: ImageGeneratorProps) {
//     const [prompt, setPrompt] = useState(imagePrompt);
//     const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
//     const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
//     const [isPending, startTransition] = useTransition();

//     const handleGenerateImage = async () => {
//         setGeneratedImageUrl(null);
//         startTransition(async () => {
//             const formData = new FormData();
//             formData.append('prompt', prompt);

//             if (uploadedFiles[0]) {
//                 formData.append('image', uploadedFiles[0]);
//             }

//             const result = await generateImageAction(formData);

//             if (result.success && result.imageUrl) {
//                 setGeneratedImageUrl(result.imageUrl);
//                 toast.success("Image generated successfully!");
//             } else {
//                 toast.error(result.error || "An unknown error occurred.");
//             }
//         });
//     };

//     const hasUploadedImage = uploadedFiles.length > 0;

//     return (
//         <section className="space-y-4 flex flex-col">
//             <div>
//                 <span className="text-lg tracking-tight font-bold">Generate Accompanying Image</span>
//                 <Label htmlFor="image-prompt" className="text-sm text-muted-foreground mb-3">Image Prompt:</Label>
//                 <Textarea
//                     id="image-prompt"
//                     value={prompt}
//                     onChange={(e) => setPrompt(e.target.value)}
//                     placeholder={
//                         hasUploadedImage
//                             ? "Describe how you want to edit or enhance the uploaded image..."
//                             : "Describe the image you want to generate in detail..."
//                     }
//                     className="min-h-[80px]"
//                     maxLength={32000}
//                 />
//                 <div className="flex justify-end  mt-2 text-xs text-muted-foreground">
//                     <span className=" hidden">
//                         <Badge variant={'secondary'} className=" rounded-full"> {hasUploadedImage ? "Image editing mode" : "Image generation mode"}</Badge>
//                     </span>
//                     <span>{prompt.length}/32,000 characters</span>
//                 </div>
//             </div>
//             <Label className="text-sm text-muted-foreground mt-4 mb-2">Upload Reference Image (Optional):</Label>
//             <ImageFileDropzone files={uploadedFiles} setFiles={setUploadedFiles} maxFiles={1} />
//             <Button className="w-full" size={'sm'} onClick={handleGenerateImage} disabled={isPending || !prompt.trim()}>
//                 {isPending ? (
//                     <ButtonSpinner>
//                         {hasUploadedImage ? 'Editing' : 'Generating'}
//                     </ButtonSpinner>
//                 ) : (
//                     hasUploadedImage ? 'Edit Image' : 'Generate Image'
//                 )}
//             </Button>
//             {isPending && (
//                 <LineSpinner>
//                     {hasUploadedImage
//                         ? "Your image is being Edited... This may take 15-30 seconds for high-quality results"
//                         : "Your image is being created... This may take 15-30 seconds for high-quality results"
//                     }
//                 </LineSpinner>
//             )}
//             {generatedImageUrl && (
//                 <div >
//                     <div className="flex justify-between items-center gap-2 my-2" >
//                         <Label className="text-sm text-muted-foreground ">{hasUploadedImage ? 'Edited Image Result' : 'Generated Image Result'}</Label>
//                         <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                                 <Button variant="ghost" size={'sm'}>
//                                     Actions <IoIosArrowDown />
//                                 </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent className="max-w-64" align="end">
//                                 <DropdownMenuItem onClick={async () => {
//                                     try {
//                                         const response = await fetch(generatedImageUrl);
//                                         const blob = await response.blob();
//                                         await navigator.clipboard.write([
//                                             new ClipboardItem({ [blob.type]: blob })
//                                         ]);
//                                         toast.success("Image copied to clipboard!");
//                                     } catch (error) {
//                                         toast.error("Failed to copy image to clipboard");
//                                     }
//                                 }}>
//                                     <Copy size={16} className="opacity-60 mr-2" aria-hidden="true" />
//                                     <span>Copy</span>
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem onClick={() => {
//                                     const link = document.createElement('a');
//                                     link.href = generatedImageUrl;
//                                     link.download = hasUploadedImage ? 'edited-image.png' : 'generated-image.png';
//                                     link.click();
//                                 }}>
//                                     <Download size={16} className="opacity-60 mr-2" aria-hidden="true" />
//                                     <span>Download Image</span>
//                                 </DropdownMenuItem>
//                             </DropdownMenuContent>
//                         </DropdownMenu>
//                     </div>
//                     <section className="flex flex-col md:flex-row items-center p-1 gap-8 justify-between">
//                         <div className="w-full md:w-1/2  flex justify-center items-center">
//                             <img
//                                 src={generatedImageUrl}
//                                 alt={hasUploadedImage ? "AI edited image" : "AI generated image"}
//                                 className="max-w-full max-h-[80vh] rounded-2xl shadow-lg border border-border ring-border ring-offset-background/80 ring-1 ring-offset-4 object-contain"
//                             />
//                         </div>
//                     </section>

//                 </div>
//             )}
//         </section>
//     );
// }


'use client'

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ButtonSpinner, LineSpinner } from "@/shared/spinner";
import { IoIosArrowDown } from "react-icons/io";
import { Copy, CopyCheckIcon, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ImageFileDropzone } from "../reusable-components/uploads/ImageFileDropzone";

export function ImageGenerator({ imagePrompt, imageUrls = [], handleImageAction, isPending }: any) {
    const [prompt, setPrompt] = useState(imagePrompt);
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

    useEffect(() => {
        setPrompt(imagePrompt);
    }, [imagePrompt]);

    const handleGenerateClick = () => {
        if (!prompt.trim()) {
            toast.warning("Please enter an image prompt.");
            return;
        }
        const imageFile = uploadedFiles.length > 0 ? uploadedFiles[0] : null;
        handleImageAction(prompt, imageFile);
        setUploadedFiles([]);
    };

    const hasUploadedImage = uploadedFiles.length > 0;

    return (
        <section className="space-y-4 flex flex-col">
            <div>
                <span className="text-lg tracking-tight font-bold">Generate Accompanying Image</span>
                <Label htmlFor="image-prompt" className="text-sm text-muted-foreground mb-3">Image Prompt:</Label>
                <Textarea
                    id="image-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={hasUploadedImage ? "Describe how you want to edit..." : "Describe the image you want to generate..."}
                    className="min-h-[80px]"
                    maxLength={32000}
                />
            </div>
            <Label className="text-sm text-muted-foreground mt-4 mb-2">Upload Reference Image (Optional):</Label>
            <ImageFileDropzone files={uploadedFiles} setFiles={setUploadedFiles} maxFiles={1} />
            <Button className="w-full" size={'sm'} onClick={handleGenerateClick} disabled={isPending || !prompt.trim()}>
                {isPending ? <ButtonSpinner>{hasUploadedImage ? 'Editing' : 'Generating'}</ButtonSpinner> : (hasUploadedImage ? 'Edit Image' : 'Generate Image')}
            </Button>

            {isPending && <LineSpinner>Image processing may take up to 30 seconds...</LineSpinner>}

            {imageUrls && imageUrls.length > 0 && (
                <div className="space-y-4">
                    <Label className="text-sm text-muted-foreground ">{'Image Results'}</Label>
                    <section className="grid md:grid-cols-2 grid-cols-1 gap-6">
                        {[...imageUrls].reverse().map((url: string, index: number) => (
                            <div className=" relative">
                                <img
                                    src={url}
                                    alt={`AI generated image ${index + 1}`}
                                    className="max-w-full max-h-[80vh] rounded-2xl shadow-lg border border-border ring-border ring-offset-background/80 ring-1 ring-offset-4 object-contain"
                                />
                                <div className=" space-x-1 flex absolute top-4 right-4">
                                    <Button onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = hasUploadedImage ? 'edited-image.png' : 'generated-image.png';
                                        link.click();
                                    }} variant={'outline'} size={'icon'}><Download /></Button>
                                    <Button onClick={async () => {
                                        try {
                                            const response = await fetch(url);
                                            const blob = await response.blob();
                                            await navigator.clipboard.write([
                                                new ClipboardItem({ [blob.type]: blob })
                                            ]);
                                            toast.success("Image copied to clipboard!");
                                        } catch (error) {
                                            toast.error("Failed to copy image to clipboard");
                                        }
                                    }} variant={'outline'} size={'icon'}><Copy/></Button>
                                </div>

                            </div>

                        ))}
                    </section>

                </div >
            )
            }
        </section >
    );
}