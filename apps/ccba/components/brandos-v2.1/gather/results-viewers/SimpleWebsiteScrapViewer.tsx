'use client';

import { useState, useEffect, useMemo } from 'react';
import { Globe } from 'lucide-react';
import { EmptyStateCard } from '@/components/shared/CardsUI';
import { ViewerProps, WebsitePage } from './types';
import { getPathname } from './utils';
import { SourceSelector } from './shared/SourceSelector';
import { BatchInfo } from './shared/BatchInfo';
import { WebsitePageList } from './website/WebsitePageList';
import { WebsitePageContent } from './website/WebsitePageContent';

export function SimpleWebsiteScrapViewer({ scrapsData, brandName, status }: ViewerProps) {
    const [selectedSource, setSelectedSource] = useState(brandName);
    const [selectedPage, setSelectedPage] = useState<WebsitePage | null>(null);

    useEffect(() => {
        console.log("[SimpleWebsiteScrapViewer] Props:", {
            hasScrapsData: !!scrapsData,
            brandName,
            status,
            dataKeys: scrapsData ? Object.keys(scrapsData) : []
        });
        if (scrapsData) {
            console.log("[SimpleWebsiteScrapViewer] Data structure:", {
                batch_id: scrapsData.batch_id,
                status: scrapsData.status,
                pages_scraped: scrapsData.pages_scraped,
                hasBrand: !!scrapsData.brand,
                brandPagesCount: scrapsData.brand?.pages?.length,
                competitorsCount: scrapsData.competitors?.length
            });
        }
    }, [scrapsData, brandName, status]);

    // Handle potential structure variations
    const brandDataObj = scrapsData?.brand || (scrapsData?.pages ? scrapsData : null);
    const competitors = scrapsData?.competitors || brandDataObj?.competitors || [];

    const sources = useMemo(() => {
        if (!scrapsData) return [];
        return [
            { 
                name: brandDataObj?.brand_name || brandName, 
                data: brandDataObj, 
                type: 'brand' 
            },
            ...competitors.map((c: any) => ({ 
                name: c.competitor_name || c.name || "Unknown Competitor", 
                data: c, 
                type: 'competitor' 
            }))
        ];
    }, [scrapsData, brandDataObj, brandName, competitors]);

    const currentSource = sources.find(s => s.name === selectedSource) || sources[0];
    
    // Ensure selectedSource is valid
    useEffect(() => {
        if (sources.length > 0 && !sources.some(s => s.name === selectedSource)) {
            setSelectedSource(sources[0]?.name || brandName);
        }
    }, [sources, selectedSource, brandName]);

    const pages = currentSource?.data?.pages || [];

    const uniquePages: any = useMemo(() => {
        const map = new Map<string, WebsitePage>();
        pages.forEach((page: WebsitePage) => {
            if (page?.url && !map.has(page.url)) {
                map.set(page.url, page);
            }
        });
        return Array.from(map.values());
    }, [pages]);

    useEffect(() => {
        if (uniquePages.length > 0 && !selectedPage) {
            setSelectedPage(uniquePages[0]);
        } else if (uniquePages.length > 0 && selectedPage) {
            const exists = uniquePages.some((p: any) => p.url === selectedPage.url);
            if (!exists) {
                setSelectedPage(uniquePages[0]);
            }
        }
    }, [uniquePages, selectedPage]);

    if (!scrapsData) {
        if (status && status !== 'Completed' && status !== 'CompletedWithErrors') {
            return <EmptyStateCard message={`Website capture status: ${status}`} />;
        }
        return <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">No website data collected yet.</div>;
    }

    return (
        <div className="space-y-6">
            <SourceSelector 
                sources={sources.map(s => s.name)}
                selectedSource={selectedSource}
                onSelect={setSelectedSource}
                icon={Globe}
            />

            <BatchInfo 
                batchId={scrapsData.batch_id}
                status={scrapsData.status}
                scrapedAt={scrapsData.scraped_at}
                pagesCount={scrapsData.pages_scraped || uniquePages.length}
            />
            
            {uniquePages.length === 0 ? (
                <EmptyStateCard message="No pages found for this source." />
            ) : (
                <div className="grid grid-cols-4 gap-6 min-h-0">
                    <WebsitePageList 
                        pages={uniquePages}
                        selectedPage={selectedPage}
                        onSelect={setSelectedPage}
                    />

                    <div className="col-span-3 space-y-4 min-w-0">
                        {selectedPage && (
                            <WebsitePageContent page={selectedPage} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
