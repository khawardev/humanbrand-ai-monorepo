import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPathname } from '../utils';
import { WebsitePage } from '../types';
import { useInView } from 'react-intersection-observer';

interface WebsitePageListProps {
    pages: WebsitePage[];
    selectedPage: WebsitePage | null;
    onSelect: (page: WebsitePage) => void;
}

export function WebsitePageList({ pages, selectedPage, onSelect }: WebsitePageListProps) {
    const [visibleCount, setVisibleCount] = useState(50);
    const { ref, inView } = useInView({
        threshold: 0.1,
        rootMargin: '100px',
    });

    useEffect(() => {
        if (inView && visibleCount < pages.length) {
            setVisibleCount(prev => Math.min(prev + 50, pages.length));
        }
    }, [inView, visibleCount, pages.length]);

    // Reset visible count if pages array changes completely (e.g. source switch)
    useEffect(() => {
        setVisibleCount(50);
    }, [pages]);

    const visiblePages = pages.slice(0, visibleCount);

    return (
        <ScrollArea className="h-[70vh] col-span-1 min-w-0 ">
            <h5 className="px-2 py-2 mb-4  text-xs text-muted-foreground uppercase tracking-wider">
                Captured Pages ({pages.length})
            </h5>
            <ul className="space-y-1">
                {visiblePages.map((page, index) => (
                    <li key={index}>
                        <Button
                            variant={selectedPage?.url === page.url ? 'secondary' : 'ghost'}
                            size="sm"
                            className="w-full justify-start font-normal h-9 text-left"
                            onClick={() => onSelect(page)}
                        >
                            <span className="truncate">{getPathname(page.url)}</span>
                        </Button>
                    </li>
                ))}
            </ul>
            {visibleCount < pages.length && (
                <div ref={ref} className="py-4 text-center text-xs text-muted-foreground">
                    Loading more...
                </div>
            )}
        </ScrollArea>
    );
}
