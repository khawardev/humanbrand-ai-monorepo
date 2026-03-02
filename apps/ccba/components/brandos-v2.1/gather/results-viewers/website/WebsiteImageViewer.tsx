import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, ExternalLink, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useInView } from 'react-intersection-observer';
import { SuspensiveImageCard } from './SuspensiveImageCard';

interface WebsiteImageViewerProps {
    imageUrls: string[];
}

export function WebsiteImageViewer({ imageUrls }: WebsiteImageViewerProps) {
    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success(`${label} copied to clipboard`);
        });
    };

    const [visibleCount, setVisibleCount] = useState(20);
    const { ref, inView } = useInView({
        threshold: 0.1,
        rootMargin: '200px',
    });

    useEffect(() => {
        if (inView && visibleCount < imageUrls.length) {
            setVisibleCount(prev => Math.min(prev + 20, imageUrls.length));
        }
    }, [inView, visibleCount, imageUrls.length]);

    useEffect(() => {
        setVisibleCount(20);
    }, [imageUrls]);

    if (!imageUrls || imageUrls.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[30vh] text-muted-foreground">
                <ImageIcon className="w-12 h-12 mb-3 text-muted-foreground p-0.5 border-2 rounded-lg" />
                <p>No images extracted from this page.</p>
            </div>
        );
    }

    const visibleImages = imageUrls.slice(0, visibleCount);

    return (
        <ScrollArea className="h-[55vh] w-full ">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {imageUrls.length} image(s) extracted from this page
                    </p>
                    <Button
                        variant='secondary'
                        size="sm"
                        onClick={() => handleCopy(imageUrls.join('\n') || '', 'All Image URLs')}
                    >
                        <Copy className="w-3 h-3 " />
                        Copy All URLs
                    </Button>
                </div>

                {/* Masonry Gallery */}
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                    {visibleImages.map((url, idx) => (
                         <div key={idx} className="break-inside-avoid">
                             <SuspensiveImageCard url={url} index={idx} onCopy={(url) => handleCopy(url, 'Image URL')} />
                         </div>
                    ))}
                </div>
                 {visibleCount < imageUrls.length && (
                    <div ref={ref} className="py-2 text-center text-xs text-muted-foreground">
                        Loading more images...
                    </div>
                )}
            </div>
        </ScrollArea>
    );
}
