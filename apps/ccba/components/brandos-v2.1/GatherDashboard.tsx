import { redirect } from 'next/navigation';
import { getCcbaTaskStatus } from '@/server/actions/ccba/statusActions';
import { getBrandbyIdWithCompetitors } from '@/server/actions/brandActions';
import { getpreviousWebsiteScraps } from '@/server/actions/ccba/website/websiteScrapeActions';
import { getPreviousSocialScrapes } from '@/server/actions/ccba/social/socialScrapeActions';

interface GatherDashboardProps {
    brandId: string;
    startDate?: string;
    endDate?: string;
    webLimit?: string;
    triggerScrape?: boolean;
}

export default async function GatherDashboard({ brandId, startDate, endDate, webLimit, triggerScrape }: GatherDashboardProps) {
    if (!brandId) {
        redirect('/dashboard/brandos-v2.1/gather');
    }

    let websiteBatchStatus = null;
    let socialBatchStatus = null;

    try {
        const prevWeb = await getpreviousWebsiteScraps(brandId);
        if (Array.isArray(prevWeb) && prevWeb.length > 0) {
            const sorted = prevWeb.sort((a: any, b: any) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            websiteBatchStatus = sorted[0]?.status;
        }
    } catch (e) {
        console.error("[GatherDashboard] Error fetching website scraps:", e);
    }

    try {
        const prevSocial = await getPreviousSocialScrapes(brandId);
        if (Array.isArray(prevSocial) && prevSocial.length > 0) {
            const sorted = prevSocial.sort((a: any, b: any) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            socialBatchStatus = sorted[0]?.status;
        }
    } catch (e) {
        console.error("[GatherDashboard] Error fetching social scraps:", e);
    }

    const isWebComplete = websiteBatchStatus === 'Completed' || websiteBatchStatus === 'CompletedWithErrors';
    const isSocialComplete = socialBatchStatus === 'Completed' || socialBatchStatus === 'CompletedWithErrors';
    const isAllComplete = isWebComplete && isSocialComplete;

    if (isAllComplete && !triggerScrape) {
        redirect(`/dashboard/brandos-v2.1/gather/data/${brandId}`);
    }

    const queryParams = new URLSearchParams();
    if (triggerScrape) queryParams.set('triggerScrape', 'true');
    if (webLimit) queryParams.set('webLimit', webLimit);
    if (startDate) queryParams.set('startDate', startDate);
    if (endDate) queryParams.set('endDate', endDate);

    const queryString = queryParams.toString();
    redirect(`/dashboard/brandos-v2.1/gather/collecting/${brandId}${queryString ? `?${queryString}` : ''}`);
}
