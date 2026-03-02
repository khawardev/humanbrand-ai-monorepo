'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getBatchWebsiteScrapeStatus } from '@/server/actions/ccba/website/websiteStatusAction';
import { getBatchSocialScrapeStatus } from '@/server/actions/ccba/social/socialStatusAction';
import { ScrapeStatusBadge } from './ScrapeStatusBadge';
import { isStatusProcessing, isWithinOneDay } from '@/lib/utils';

type PollingStatusBadgeProps = {
    type: 'Website' | 'Social' | 'Processing';
    initialStatus: string | null;
    initialError?: string | null;
    brandId: string;
    batchId: string;
    createdAt?: string | null;
    pollInterval?: number;
    showLabel?: boolean;
    size?: 'sm' | 'md';
};

export function PollingStatusBadge({
    type,
    initialStatus,
    initialError,
    brandId,
    batchId,
    createdAt,
    pollInterval = 15000,
    showLabel = true,
    size = 'sm'
}: PollingStatusBadgeProps) {
    const router = useRouter();
    const [status, setStatus] = useState<string | null>(initialStatus);
    const [error, setError] = useState<string | null>(initialError || null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    
    const shouldPoll = isStatusProcessing(initialStatus) && isWithinOneDay(createdAt);
    const isPollingRef = useRef(shouldPoll);

    const checkStatus = useCallback(async () => {
        if (!isPollingRef.current) return;

        if (!isWithinOneDay(createdAt)) {
            isPollingRef.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        try {
            const fetchStatus = type === 'Website' 
                ? getBatchWebsiteScrapeStatus 
                : getBatchSocialScrapeStatus;
            
            const res = await fetchStatus(brandId, batchId);
            
            if (res?.status) {
                setStatus(res.status);
                if (res.error) setError(res.error);
                
                if (!isStatusProcessing(res.status)) {
                    isPollingRef.current = false;
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    router.refresh();
                }
            }
        } catch (e) {
            console.error(`[PollingStatusBadge] ${type} status check error:`, e);
        }
    }, [type, brandId, batchId, createdAt, router]);

    useEffect(() => {
        if (!isStatusProcessing(initialStatus) || !isWithinOneDay(createdAt)) {
            isPollingRef.current = false;
            return;
        }

        isPollingRef.current = true;
        intervalRef.current = setInterval(checkStatus, pollInterval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [initialStatus, createdAt, checkStatus, pollInterval]);

    return (
        <ScrapeStatusBadge
            label={type}
            status={status}
            error={error}
            showLabel={showLabel}
            size={size}
        />
    );
}
