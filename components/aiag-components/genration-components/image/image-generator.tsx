'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ButtonSpinner, LineSpinner } from '@/shared/spinner'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import { ImageFileDropzone } from '../../reusable-components/uploads/ImageFileDropzone'
import { Copy, Download } from 'lucide-react'

export function ImageGenerator({
    imagePrompt,
    imageUrls = [],
    handleImageAction,
    isPending,
    onImageFileChange,
    imageReferenceFileInfo,
}: any) {
    const [prompt, setPrompt] = useState(imagePrompt)
    const [lightboxIndex, setLightboxIndex] = useState(-1)
    const [reversedUrls, setReversedUrls] = useState<any>([])

    useEffect(() => {
        setPrompt(imagePrompt)
    }, [imagePrompt])

    useEffect(() => {
        setReversedUrls([...imageUrls].reverse())
    }, [imageUrls])

    const handleGenerateClick = () => {
        if (!prompt.trim()) {
            toast.warning('Please enter an image prompt.')
            return
        }
        handleImageAction(prompt)
    }

    const hasUploadedImage = !!imageReferenceFileInfo

    return (
        <>
            <section className='space-y-4 flex flex-col'>
                <div>
                    <span className='text-lg tracking-tight font-bold'>
                        Generate Accompanying Image
                    </span>
                    <Label
                        htmlFor='image-prompt'
                        className='text-sm text-muted-foreground mb-3'
                    >
                        Image Prompt:
                    </Label>
                    <Textarea
                        id='image-prompt'
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder={
                            hasUploadedImage
                                ? 'Describe how you want to edit the reference image...'
                                : 'Describe the image you want to generate...'
                        }
                        className='min-h-[80px]'
                        maxLength={32000}
                    />
                </div>
                <Label className='text-sm text-muted-foreground mt-4 mb-2'>
                    Upload Reference Image (Optional):
                </Label>
                <ImageFileDropzone
                    onFileChange={onImageFileChange}
                    initialFileInfo={imageReferenceFileInfo}
                />
                <Button
                    className='w-full'
                    size={'sm'}
                    onClick={handleGenerateClick}
                    disabled={isPending || !prompt.trim()}
                >
                    {isPending ? (
                        <ButtonSpinner>
                            {hasUploadedImage ? 'Editing' : 'Generating'}
                        </ButtonSpinner>
                    ) : hasUploadedImage ? (
                        'Edit Image'
                    ) : (
                        'Generate Image'
                    )}
                </Button>

                {isPending && (
                    <LineSpinner>Image processing may take up to 30-50 seconds...</LineSpinner>
                )}

                {reversedUrls && reversedUrls.length > 0 && (
                    <div className='space-y-4'>
                        <Label className='text-sm text-muted-foreground '>{'Image Results'}</Label>
                        <section className='grid md:grid-cols-2 grid-cols-1 gap-6'>
                            {reversedUrls.map((url: string, index: number) => (
                                <div key={url + index} className="relative">
                                    <img
                                        src={url}
                                        alt={`AI generated image ${index + 1}`}
                                        onClick={() => setLightboxIndex(index)}
                                        className="max-w-full cursor-pointer max-h-[80vh] rounded-2xl shadow-lg border border-border ring-border ring-offset-accent/80 ring-1 ring-offset-4 object-contain"
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
                    maxZoomPixelRatio: 2,
                    scrollToZoom: true,
                }}
            />
        </>
    )
}