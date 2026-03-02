'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SimpleSocialScrapViewer } from '../results-viewers/SimpleSocialScrapViewer';
import { getScrapeBatchSocial } from '@/server/actions/ccba/social/socialScrapeActions';

type SocialDataViewerProps = {
    brandId: string;
    batchId: string;
    brandName: string;
    brandData: any;
    status: string | null;
};

export function SocialDataViewer({
    brandId,
    batchId,
    brandName,
    brandData,
    status
}: SocialDataViewerProps) {
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

        getScrapeBatchSocial(brandId, batchId)
            .then((result) => {
                setData(result);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch social data:', err);
                setError('Failed to load social data');
                setIsLoading(false);
            });
    }, [brandId, batchId]);

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full max-w-sm" />
                <div className="grid grid-cols-3 gap-4 mb-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <Skeleton className="h-96 w-full" />
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
        <SimpleSocialScrapViewer
            scrapsData={data}
            brandName={brandName}
            brandData={brandData}
            status={status}
        />
    );
}
