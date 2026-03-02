'use client';

import { useEffect, useRef, useCallback, useReducer } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { getBatchWebsiteScrapeStatus } from '@/server/actions/ccba/website/websiteStatusAction';
import { getBatchSocialScrapeStatus } from '@/server/actions/ccba/social/socialStatusAction';
import { ScrapeStatusBadge } from './ScrapeStatusBadge';
import { isStatusProcessing, isWithinOneDay } from '@/lib/utils';
import { MdOutlineArrowRight } from "react-icons/md";

type ProcessingBrand = {
    brand: any;
    hasData: boolean;
    isProcessing: boolean;
    websiteBatchId: string | null;
    socialBatchId: string | null;
    webStatus: string | null;
    socialStatus: string | null;
    webError?: string | null;
    socialError?: string | null;
    webCreatedAt?: string | null;
    socialCreatedAt?: string | null;
};

type ActiveTasksBannerProps = {
    initialProcessingBrands: ProcessingBrand[];
};

type BrandState = {
    brands: ProcessingBrand[];
    isPolling: boolean;
};

type BrandAction =
    | { type: 'UPDATE_BRANDS'; payload: ProcessingBrand[] }
    | { type: 'STOP_POLLING' };

function brandsReducer(state: BrandState, action: BrandAction): BrandState {
    switch (action.type) {
        case 'UPDATE_BRANDS':
            return { ...state, brands: action.payload };
        case 'STOP_POLLING':
            return { ...state, isPolling: false };
        default:
            return state;
    }
}

export function ActiveTasksBanner({ initialProcessingBrands }: ActiveTasksBannerProps) {
    const router = useRouter();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const brandsRef = useRef<ProcessingBrand[]>(initialProcessingBrands);

    const [state, dispatch] = useReducer(brandsReducer, {
        brands: initialProcessingBrands,
        isPolling: initialProcessingBrands.length > 0
    });

    brandsRef.current = state.brands;

    const checkStatuses = useCallback(async (): Promise<ProcessingBrand[]> => {
        const currentBrands = brandsRef.current;
        if (currentBrands.length === 0) return [];

        const updatedBrands = await Promise.all(
            currentBrands.map(async (item) => {
                let webStatus = item.webStatus;
                let socialStatus = item.socialStatus;
                let webError = item.webError;
                let socialError = item.socialError;

                const isWebWithinOneDay = isWithinOneDay(item.webCreatedAt);
                const isSocialWithinOneDay = isWithinOneDay(item.socialCreatedAt);

                try {
                    if (item.websiteBatchId && isStatusProcessing(item.webStatus) && isWebWithinOneDay) {
                        const webRes = await getBatchWebsiteScrapeStatus(item.brand.brand_id, item.websiteBatchId);
                        if (webRes?.status) {
                            webStatus = webRes.status;
                            webError = webRes.error || null;
                        }
                    }
                    if (item.socialBatchId && isStatusProcessing(item.socialStatus) && isSocialWithinOneDay) {
                        const socialRes = await getBatchSocialScrapeStatus(item.brand.brand_id, item.socialBatchId);
                        if (socialRes?.status) {
                            socialStatus = socialRes.status;
                            socialError = socialRes.error || null;
                        }
                    }
                } catch (e) {
                    console.error('[ActiveTasksBanner] Status check error:', e);
                }

                return { ...item, webStatus, socialStatus, webError, socialError };
            })
        );

        return updatedBrands;
    }, []);

    useEffect(() => {
        if (!state.isPolling || state.brands.length === 0) return;

        const poll = async () => {
            try {
                const updatedBrands = await checkStatuses();
                
                const stillProcessing = updatedBrands.filter((b) => {
                    const isWebProcessing = isStatusProcessing(b.webStatus);
                    const isSocialProcessing = isStatusProcessing(b.socialStatus);
                    const isWebWithinOneDay = isWithinOneDay(b.webCreatedAt);
                    const isSocialWithinOneDay = isWithinOneDay(b.socialCreatedAt);
                    
                    const shouldContinueWebPolling = isWebProcessing && isWebWithinOneDay;
                    const shouldContinueSocialPolling = isSocialProcessing && isSocialWithinOneDay;
                    
                    return shouldContinueWebPolling || shouldContinueSocialPolling;
                });

                dispatch({ type: 'UPDATE_BRANDS', payload: stillProcessing });

                if (stillProcessing.length === 0) {
                    dispatch({ type: 'STOP_POLLING' });
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    router.refresh();
                }
            } catch (e) {
                console.error('[ActiveTasksBanner] Polling error:', e);
            }
        };

        intervalRef.current = setInterval(poll, 15000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [state.isPolling, state.brands.length, checkStatuses, router]);

    if (state.brands.length === 0) return null;

    return (
        <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/10 md:m-10 m-6">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    <CardTitle className="text-lg text-blue-700 dark:text-blue-300">
                        Active Data Collection
                    </CardTitle>
                </div>
                <CardDescription className="text-blue-600/70 dark:text-blue-400/70">
                    The following brands are currently being processed
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    {state.brands.map((item) => {
                        const isWebProcessing = isStatusProcessing(item.webStatus);
                        const isSocialProcessing = isStatusProcessing(item.socialStatus);
                        const isWebWithinOneDay = isWithinOneDay(item.webCreatedAt);
                        const isSocialWithinOneDay = isWithinOneDay(item.socialCreatedAt);

                        const showWebStatus = isWebProcessing && isWebWithinOneDay;
                        const showSocialStatus = isSocialProcessing && isSocialWithinOneDay;

                        return (
                            <div
                                key={item.brand.brand_id}
                                className="flex items-center justify-between gap-4 p-3 rounded-lg bg-blue-100/50 dark:bg-blue-900/20"
                            >
                                <Link
                                    href={`/dashboard/brandos-v2.1/gather/collecting/${item.brand.brand_id}`}
                                    className="flex items-center gap-2 font-medium text-blue-700 dark:text-blue-300 hover:underline"
                                >
                                    {item.brand.name} Collection
                                    <MdOutlineArrowRight  />
                                </Link>
                                <div className="flex items-center gap-2">
                                    {(showWebStatus || item.webError) && (
                                        <ScrapeStatusBadge
                                            label="Website"
                                            status={item.webStatus}
                                            error={item.webError}
                                        />
                                    )}
                                    {(showSocialStatus || item.socialError) && (
                                        <ScrapeStatusBadge
                                            label="Social"
                                            status={item.socialStatus}
                                            error={item.socialError}
                                        />
                                    )}
                                    {!showWebStatus && !showSocialStatus && !item.webError && !item.socialError && (
                                        <ScrapeStatusBadge label="Processing" status="processing" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
