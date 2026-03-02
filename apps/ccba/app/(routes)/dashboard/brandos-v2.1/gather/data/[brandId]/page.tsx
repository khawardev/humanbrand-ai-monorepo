import { redirect } from 'next/navigation';
import { cache } from 'react';
import { getBrandbyIdWithCompetitors } from '@/server/actions/brandActions';
import { getpreviousWebsiteScraps } from '@/server/actions/ccba/website/websiteScrapeActions';
import { getPreviousSocialScrapes } from '@/server/actions/ccba/social/socialScrapeActions';
import { DashboardLayoutHeading, DashboardInnerLayout } from '@/components/brandos-v2.1/shared/DashboardComponents';
import { DataViewManager } from '@/components/brandos-v2.1/gather/data/DataViewManager';

type PageProps = {
    params: Promise<{ brandId: string }>;
};

type WebsiteBatch = {
    batch_id: string;
    created_at: string;
    status: string;
    brand_id: string;
    client_id: string;
    scraped_pages: any;
    errors: any;
    result_keys: any;
};

type SocialBatch = {
    batch_id: string;
    created_at: string;
    status: string;
    brand_id: string;
    client_id: string;
    start_date: string;
    end_date: string;
    error: any;
};

type BatchData = {
    websiteBatches: WebsiteBatch[];
    socialBatches: SocialBatch[];
    defaultWebsiteBatchId: string | null;
    defaultSocialBatchId: string | null;
    defaultWebsiteStatus: string | null;
    defaultSocialStatus: string | null;
};

const getBrandData = cache(async (brandId: string) => {
    return getBrandbyIdWithCompetitors(brandId);
});

async function fetchAllBatchData(brandId: string): Promise<BatchData> {
    const [prevWeb, prevSocial] = await Promise.all([
        getpreviousWebsiteScraps(brandId).catch(() => null),
        getPreviousSocialScrapes(brandId).catch(() => null)
    ]);

    let websiteBatches: WebsiteBatch[] = [];
    let socialBatches: SocialBatch[] = [];
    let defaultWebsiteBatchId: string | null = null;
    let defaultSocialBatchId: string | null = null;
    let defaultWebsiteStatus: string | null = null;
    let defaultSocialStatus: string | null = null;

    if (Array.isArray(prevWeb) && prevWeb.length > 0) {
        websiteBatches = prevWeb.toSorted((a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        const completedBatch = websiteBatches.find(
            (b) => b.status === 'Completed' || b.status === 'CompletedWithErrors'
        );
        const targetBatch = completedBatch ?? websiteBatches[0];
        defaultWebsiteBatchId = targetBatch?.batch_id ?? null;
        defaultWebsiteStatus = targetBatch?.status ?? null;
    }

    if (Array.isArray(prevSocial) && prevSocial.length > 0) {
        socialBatches = prevSocial.toSorted((a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        const completedBatch = socialBatches.find(
            (b) => b.status === 'Completed' || b.status === 'CompletedWithErrors'
        );
        const targetBatch = completedBatch ?? socialBatches[0];
        defaultSocialBatchId = targetBatch?.batch_id ?? null;
        defaultSocialStatus = targetBatch?.status ?? null;
    }

    return {
        websiteBatches,
        socialBatches,
        defaultWebsiteBatchId,
        defaultSocialBatchId,
        defaultWebsiteStatus,
        defaultSocialStatus
    };
}

function getDerivedChannels(brandData: any): string[] {
    if (!brandData) return [];
    
    const channelMap: Record<string, string> = {
        linkedin_url: 'linkedin',
        facebook_url: 'facebook',
        instagram_url: 'instagram',
        x_url: 'x',
        youtube_url: 'youtube',
        tiktok_url: 'tiktok'
    };
    
    return Object.entries(channelMap)
        .filter(([key]) => brandData[key])
        .map(([, channel]) => channel);
}

function isCompleteStatus(status: string | null): boolean {
    return status === 'Completed' || status === 'CompletedWithErrors';
}

export default async function DataPage({ params }: PageProps) {
    const { brandId } = await params;

    if (!brandId) {
        redirect('/dashboard/brandos-v2.1/gather');
    }

    const [brandData, batchData] = await Promise.all([
        getBrandData(brandId),
        fetchAllBatchData(brandId)
    ]);

    if (!brandData) {
        redirect('/dashboard/brandos-v2.1/gather');
    }

    const {
        websiteBatches,
        socialBatches,
        defaultWebsiteBatchId,
        defaultSocialBatchId,
        defaultWebsiteStatus,
        defaultSocialStatus
    } = batchData;

    const hasWebsiteData = websiteBatches.length > 0;
    const hasSocialData = socialBatches.length > 0;
    const hasResults = hasWebsiteData || hasSocialData;
    const availableChannels = getDerivedChannels(brandData);
    const isWebComplete = isCompleteStatus(defaultWebsiteStatus);
    const isSocialComplete = isCompleteStatus(defaultSocialStatus);

    return (
        <div className="space-y-6">
            <DashboardLayoutHeading
                title={brandData.name}
                subtitle="View and analyze captured data from web and social sources."
            />
            <DashboardInnerLayout>
                <DataViewManager
                    brandId={brandId}
                    brandData={brandData}
                    websiteBatches={websiteBatches}
                    socialBatches={socialBatches}
                    defaultWebsiteBatchId={defaultWebsiteBatchId}
                    defaultSocialBatchId={defaultSocialBatchId}
                    defaultWebsiteStatus={defaultWebsiteStatus}
                    defaultSocialStatus={defaultSocialStatus}
                    availableChannels={availableChannels}
                    hasResults={hasResults}
                    hasWebsiteData={hasWebsiteData}
                    hasSocialData={hasSocialData}
                    isWebComplete={isWebComplete}
                    isSocialComplete={isSocialComplete}
                />
            </DashboardInnerLayout>
        </div>
    );
}
