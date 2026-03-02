import { redirect } from 'next/navigation';
import { getBrandbyIdWithCompetitors } from '@/server/actions/brandActions';
import { getCcbaTaskStatus } from '@/server/actions/ccba/statusActions';
import { getpreviousWebsiteScraps } from '@/server/actions/ccba/website/websiteScrapeActions';
import { getPreviousSocialScrapes } from '@/server/actions/ccba/social/socialScrapeActions';
import { getBatchWebsiteScrapeStatus } from '@/server/actions/ccba/website/websiteStatusAction';
import { getBatchSocialScrapeStatus } from '@/server/actions/ccba/social/socialStatusAction';
import { DashboardLayoutHeading } from '@/components/brandos-v2.1/shared/DashboardComponents';
import { DashboardInnerLayout } from '@/components/brandos-v2.1/shared/DashboardComponents';
import { CollectionStatusManager } from '@/components/brandos-v2.1/gather/collection/CollectionStatusManager';

type PageProps = {
    params: Promise<{ brandId: string }>;
    searchParams: Promise<{
        triggerScrape?: string;
        scrapeType?: string;
        webLimit?: string;
        startDate?: string;
        endDate?: string;
    }>;
};

async function getLatestBatchData(brandId: string) {
    let websiteBatchId = null;
    let socialBatchId = null;
    let websiteBatchStatus = null;
    let socialBatchStatus = null;
    let websiteBatchError = null;
    let socialBatchError = null;

    try {
        const prevWeb = await getpreviousWebsiteScraps(brandId);
        if (Array.isArray(prevWeb) && prevWeb.length > 0) {
            const latestWeb:any = prevWeb[0];
            websiteBatchId = latestWeb.batch_id;
            websiteBatchStatus = latestWeb.status;
            websiteBatchError = latestWeb.errors;
        }
    } catch (e) {
        console.error("[CollectingPage] Error fetching website scraps:", e);
    }

    try {
        const prevSocial = await getPreviousSocialScrapes(brandId);
        if (Array.isArray(prevSocial) && prevSocial.length > 0) {
            const latestSocial: any = prevSocial[0];
            socialBatchId = latestSocial.batch_id;
            socialBatchStatus = latestSocial.status;
            socialBatchError = latestSocial.error;
        }
    } catch (e) {
        console.error("[CollectingPage] Error fetching social scraps:", e);
    }

    return { websiteBatchId, socialBatchId, websiteBatchStatus, socialBatchStatus, websiteBatchError, socialBatchError };
}

export default async function CollectingPage({ params, searchParams }: PageProps) {
    const { brandId } = await params;
    const queryParams = await searchParams;

    if (!brandId) {
        redirect('/dashboard/brandos-v2.1/gather');
    }

    const brandData = await getBrandbyIdWithCompetitors(brandId);

    if (!brandData) {
        redirect('/dashboard/brandos-v2.1/gather');
    }

    const status = await getCcbaTaskStatus(brandId);
    const { websiteBatchId, socialBatchId, websiteBatchStatus, socialBatchStatus, websiteBatchError, socialBatchError } = await getLatestBatchData(brandId);

    const isWebComplete = websiteBatchStatus === 'Completed' || websiteBatchStatus === 'CompletedWithErrors';
    const isSocialComplete = socialBatchStatus === 'Completed' || socialBatchStatus === 'CompletedWithErrors';
    const isAllComplete = isWebComplete && isSocialComplete;

    if (isAllComplete && !queryParams.triggerScrape) {
        redirect(`/dashboard/brandos-v2.1/gather/data/${brandId}`);
    }

    return (
        <div className="space-y-6">
            <DashboardLayoutHeading
                title={`Collecting: ${brandData.name}`}
                subtitle="Real-time status of the multi-source data collection swarm."
            />
            <DashboardInnerLayout>
                <CollectionStatusManager
                    brandId={brandId}
                    brandData={brandData}
                    initialStatus={status}
                    websiteBatchId={websiteBatchId}
                    socialBatchId={socialBatchId}
                    websiteBatchStatus={websiteBatchStatus}
                    socialBatchStatus={socialBatchStatus}
                    websiteBatchError={websiteBatchError}
                    socialBatchError={socialBatchError}
                    triggerScrape={queryParams.triggerScrape === 'true'}
                    scrapeType={queryParams.scrapeType as 'web' | 'social' | 'both' | undefined}
                    webLimit={queryParams.webLimit ? parseInt(queryParams.webLimit) : 0}
                    startDate={queryParams.startDate || ''}
                    endDate={queryParams.endDate || ''}
                />
            </DashboardInnerLayout>
        </div>
    );
}
