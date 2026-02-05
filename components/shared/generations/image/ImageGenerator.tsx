import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ButtonSpinner, LineSpinner, Spinner } from "@/components/shared/Spinner";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { ImageFileDropzone } from "../../reusable/uploads/ImageFileDropzone";
import { Copy, Download, Sparkles, Image as ImageIcon, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

function ImageSkeleton() {
    return (
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-muted animate-pulse">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20">
                <ImageIcon className="w-12 h-12" />
            </div>
        </div>
    );
}

function ImageWithSkeleton({
    src,
    alt,
    onClick,
    onDownload,
    onCopy,
    index,
}: {
    src: string;
    alt: string;
    onClick: () => void;
    onDownload: () => void;
    onCopy: () => void;
    index: number;
}) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    return (
        <div className="relative group w-full aspect-square rounded-xl overflow-hidden border bg-muted/30 shadow-sm transition-all hover:shadow-md">
            {isLoading && <ImageSkeleton />}
            <img
                src={src}
                alt={alt}
                onClick={onClick}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                }}
                className={cn(
                    "w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105",
                    isLoading ? "opacity-0 absolute" : "opacity-100",
                    hasError ? "hidden" : ""
                )}
            />
            {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                    <p className="text-sm font-medium">Failed to load</p>
                </div>
            )}
            {!isLoading && !hasError && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDownload();
                        }}
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onCopy();
                        }}
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm"
                    >
                        <Copy className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}

export function ImageGenerator({
    imagePrompt,
    imageUrls = [],
    handleImageAction,
    isPending,
    onImageFileChange,
    imageReferenceFileInfo,
}: any) {
    const [prompt, setPrompt] = useState(imagePrompt);
    const [lightboxIndex, setLightboxIndex] = useState(-1);
    const [reversedUrls, setReversedUrls] = useState<any>([]);

    useEffect(() => {
        setPrompt(imagePrompt);
    }, [imagePrompt]);

    useEffect(() => {
        setReversedUrls([...imageUrls].reverse());
    }, [imageUrls]);

    const handleGenerateClick = () => {
        if (!prompt.trim()) {
            toast.warning("Please enter an image prompt.");
            return;
        }
        handleImageAction(prompt);
    };

    const hasUploadedImage = !!imageReferenceFileInfo;
    const referenceImageSrc = imageReferenceFileInfo?.preview || imageReferenceFileInfo?.reference_image_url;

    return (
        <>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex flex-col space-y-4">
                        <Label className="text-sm font-medium text-muted-foreground">Image Prompt</Label>

                        <div className="relative">
                            <Textarea
                                id="image-prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={
                                    hasUploadedImage
                                        ? "Describe how you want to edit the reference image..."
                                        : "Describe the image you want to generate in detail..."
                                }
                                className="min-h-[140px] resize-none text-base p-4 rounded-xl shadow-sm focus-visible:ring-primary/20"
                                maxLength={2000}
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md">
                                {prompt.length}/2000
                            </div>
                        </div>
                    </div>



                    {isPending && (
                        <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-dashed animate-in fade-in slide-in-from-top-2 duration-500">
                            <Spinner />
                            <span className="text-sm text-muted-foreground">Creating masterpiece... allow up to 60s.</span>
                        </div>
                    )}

                </div>

                <div className="space-y-4">
                    <Label className="text-sm font-medium text-muted-foreground">Reference (Optional)</Label>
                    <ImageFileDropzone
                        onFileChange={onImageFileChange}
                        initialFileInfo={imageReferenceFileInfo}
                    />
                    <p className="text-xs text-muted-foreground px-1">
                        Upload an image to guide the generation or to apply edits.
                    </p>
                    {hasUploadedImage && referenceImageSrc && (
                        <div className="relative w-full aspect-square rounded-xl overflow-hidden border bg-muted shadow-sm">
                            <img
                                src={referenceImageSrc}
                                alt="Reference"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <Button
                        className="w-full h-12 text-base font-medium rounded-xl shadow-sm transition-all hover:shadow-md"
                        onClick={handleGenerateClick}
                        disabled={isPending || !prompt.trim()}
                        size="lg"
                    >
                        {isPending ? (
                            <ButtonSpinner>
                                {hasUploadedImage ? "Processing..." : "Dreaming..."}
                            </ButtonSpinner>
                        ) : (
                            <>
                                {hasUploadedImage ? "Generate Edit" : "Generate Image"}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Results Section */}
            {reversedUrls && reversedUrls.length > 0 && (
                <div className="space-y-4 pt-6 mt-6 border-t">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            Recent Creations
                        </h3>
                        <span className="text-sm text-muted-foreground">{reversedUrls.length} images</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {reversedUrls.map((url: string, index: number) => (
                            <ImageWithSkeleton
                                key={url + index}
                                src={url}
                                alt={`AI generated image ${index + 1}`}
                                onClick={() => setLightboxIndex(index)}
                                onDownload={() => {
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.download = `generated-image-${index}.png`;
                                    link.click();
                                }}
                                onCopy={async () => {
                                    try {
                                        const response = await fetch(url);
                                        const blob = await response.blob();
                                        await navigator.clipboard.write([
                                            new ClipboardItem({ [blob.type]: blob }),
                                        ]);
                                        toast.success("Copied to clipboard!");
                                    } catch (error) {
                                        console.error("Failed to copy", error);
                                        toast.error("Failed to copy");
                                    }
                                }}
                                index={index}
                            />
                        ))}
                    </div>

                </div>
            )}

            <Lightbox
                plugins={[Zoom]}
                open={lightboxIndex >= 0}
                close={() => setLightboxIndex(-1)}
                index={lightboxIndex}
                slides={reversedUrls.map((url: any) => ({ src: url }))}
                render={{
                    buttonPrev: () => null,
                    buttonNext: () => null,
                }}
                zoom={{
                    maxZoomPixelRatio: 3,
                    scrollToZoom: true,
                }}
            />
        </>
    );
}