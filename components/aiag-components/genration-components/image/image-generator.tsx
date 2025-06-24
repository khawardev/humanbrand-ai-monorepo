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

function ImageSkeleton() {
    return (
        <div className="relative">
            <div className="animate-pulse bg-accent rounded-2xl max-h-[80vh] aspect-square flex items-center justify-center">
                <div className="text-muted-foreground">
                    <svg
                        className="w-14 h-14"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

function ImageWithSkeleton({
    src,
    alt,
    onClick,
    onDownload,
    onCopy,
    index
}: {
    src: string
    alt: string
    onClick: () => void
    onDownload: () => void
    onCopy: () => void
    index: number
}) {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    return (
        <div className="relative">
            {isLoading && <ImageSkeleton />}
            <img
                src={src}
                alt={alt}
                onClick={onClick}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false)
                    setHasError(true)
                }}
                className={`w-full cursor-pointer  aspect-square  rounded-2xl shadow-lg border border-border ring-border ring-offset-accent/80 ring-1 ring-offset-4 object-contain ${isLoading ? 'opacity-0 absolute' : 'opacity-100'
                    } ${hasError ? 'hidden' : ''}`}
            />
            {hasError && (
                <div className="max-w-full aspect-square rounded-2xl shadow-lg border border-border bg-accent flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm">Failed to load image</p>
                    </div>
                </div>
            )}
            {!isLoading && !hasError && (
                <div className="space-x-1 flex absolute top-4 right-4">
                    <Button onClick={onDownload} variant={'outline'} size={'icon'}>
                        <Download />
                    </Button>
                    <Button onClick={onCopy} variant={'outline'} size={'icon'}>
                        <Copy />
                    </Button>
                </div>
            )}
        </div>
    )
}

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

                {isPending && <LineSpinner>Image processing may take up to 50-60 seconds...</LineSpinner>}

                {reversedUrls && reversedUrls.length > 0 && (
                    <div className='space-y-4'>
                        <Label className='text-sm text-muted-foreground'>Image Results</Label>
                        <section className='grid  md:grid-cols-2 grid-cols-1 gap-6'>
                            {reversedUrls.map((url: string, index: number) => (
                                <ImageWithSkeleton
                                    key={url + index}
                                    src={url}
                                    alt={`AI generated image ${index + 1}`}
                                    onClick={() => setLightboxIndex(index)}
                                    onDownload={() => {
                                        const link = document.createElement('a')
                                        link.href = url
                                        link.download = `generated-image-${index}.png`
                                        link.click()
                                    }}
                                    onCopy={async () => {
                                        try {
                                            const response = await fetch(url)
                                            const blob = await response.blob()
                                            await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
                                            toast.success("Image copied to clipboard!")
                                        } catch (error) {
                                            toast.error("Failed to copy image to clipboard")
                                        }
                                    }}
                                    index={index}
                                />
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