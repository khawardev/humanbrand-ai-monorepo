'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SimpleWebsiteScrapViewer } from '../results-viewers/SimpleWebsiteScrapViewer';
import { getscrapeBatchWebsite } from '@/server/actions/ccba/website/websiteScrapeActions';

type WebsiteDataViewerProps = {
    brandId: string;
    batchId: string;
    brandName: string;
    status: string | null;
};

export function WebsiteDataViewer({
    brandId,
    batchId,
    brandName,
    status
}: WebsiteDataViewerProps) {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!batchId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        getscrapeBatchWebsite(brandId, batchId)
            .then((result) => {
                setData(result);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch website data:', err);
                setError('Failed to load website data');
                setIsLoading(false);
            });
    }, [brandId, batchId]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full max-w-sm" />
                <div className="grid grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                    <div className="col-span-3">
                        <Skeleton className="h-96 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-destructive">
                {error}. Please try again.
            </div>
        );
    }

    return (
        <SimpleWebsiteScrapViewer
            scrapsData={data}
            brandName={brandName}
            status={status}
        />
    );
}
