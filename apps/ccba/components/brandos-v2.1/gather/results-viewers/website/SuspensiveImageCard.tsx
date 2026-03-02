import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageCardProps {
    url: string;
    index: number;
    onCopy: (url: string) => void;
}

export function SuspensiveImageCard({ url, index, onCopy }: ImageCardProps) {
    return (
        <Suspense fallback={<ImageCardSkeleton />}>
            <ImageCard url={url} index={index} onCopy={onCopy} />
        </Suspense>
    );
}

function ImageCardSkeleton() {
    return (
        <div className="rounded-lg overflow-hidden border bg-muted/30 aspect-square">
            <Skeleton className="w-full h-full" />
        </div>
    );
}

function ImageCard({ url, index, onCopy }: ImageCardProps) {
    const isHttpUrl = url.startsWith('http://') || url.startsWith('https://');
    const isDataUrl = url.startsWith('data:');
    const isS3Url = url.startsWith('s3://');
    const isSvg = url.toLowerCase().endsWith('.svg') || url.includes('image/svg+xml');
    
    // We can preview standard web images AND data URIs (including base64 SVGs which render fine in img tags).
    // We still exclude standalone .svg files from HTTP previews if preferred, but Data URI SVGs are safe.
    const canPreview = (isHttpUrl && !url.toLowerCase().endsWith('.svg')) || isDataUrl;

    const [isLoading, setIsLoading] = useState(canPreview);
    const [hasError, setHasError] = useState(false);

    // Helper to get a displayable name/label
    const getDisplayName = () => {
        if (isDataUrl) return 'Base64 Image Data';
        return url.split('/').pop() || 'Unknown File';
    };

    return (
        <div className="group relative rounded-lg overflow-hidden border bg-muted/30 hover:border-primary/50 transition-colors">
            {canPreview ? (
                <>
                    {/* Placeholder while loading */}
                    {isLoading && !hasError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted min-h-[150px]">
                            <Skeleton className="w-full h-full" />
                        </div>
                    )}
                    
                    {/* Actual Image */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={url}
                        alt={`Image ${index + 1}`}
                        className={`w-full h-auto object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                        loading="lazy"
                        onLoad={() => setIsLoading(false)}
                        onError={() => {
                            setIsLoading(false);
                            setHasError(true);
                        }}
                    />

                    {/* Error State */}
                    {hasError && (
                        <div className="flex flex-col items-center justify-center p-4 min-h-[150px] text-center bg-muted">
                            <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                            <p className="text-xs text-muted-foreground">Preview unavailable</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center p-4 min-h-[150px] text-center bg-muted/10">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                        {isSvg ? (
                             // Simple SVG Icon representation
                             <div className="text-xs font-bold text-muted-foreground">SVG</div>
                        ) : (
                             <ImageIcon className="w-6 h-6 text-muted-foreground" />
                        )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-1 font-medium">
                        {isS3Url ? 'S3 Asset' : isSvg ? 'Vector Graphic' : 'External Asset'}
                    </p>
                    <code className="text-[9px] text-muted-foreground break-all line-clamp-2 px-2 bg-muted rounded py-0.5">
                        {getDisplayName()}
                    </code>
                </div>
            )}

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => onCopy(url)} className="h-8">
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                </Button>
                {/* Only show "Open" for standard HTTP URLs, not data URIs (browser handling varies) or S3 */}
                {isHttpUrl && (
                    <Button variant="secondary" size="sm" asChild className="h-8">
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Open
                        </a>
                    </Button>
                )}
            </div>

            {/* Index badge */}
            <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none">
                {index + 1}
            </div>
        </div>
    );
}

