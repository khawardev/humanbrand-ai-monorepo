import { redirect } from 'next/navigation';
import { getBrandbyIdWithCompetitors } from '@/server/actions/brandActions';
import { getWebsiteBatchId } from '@/server/actions/ccba/website/websiteScrapeActions';
import { getSocialBatchId } from '@/server/actions/ccba/social/socialScrapeActions';
import { DashboardLayoutHeading, DashboardInnerLayout } from '@/components/brandos-v2.1/shared/DashboardComponents';
import { Phase0Processor } from '@/components/brandos-v2.1/phase0/Phase0Processor';
import { getCurrentUser } from '@/server/actions/authActions';

type PageProps = {
    params: Promise<{ brandId: string }>;
};

export default async function Phase0ProcessingPage({ params }: PageProps) {
    const { brandId } = await params;
    const user = await getCurrentUser();

    if (!brandId) redirect('/dashboard/brandos-v2.1/phase-0');
    if (!user || !user.client_id) redirect('/login'); // Ensure user is logged in

    const brandData = await getBrandbyIdWithCompetitors(brandId);
    if (!brandData) redirect('/dashboard/brandos-v2.1/phase-0');

    const websiteBatchId = await getWebsiteBatchId(brandId);
    const socialBatchId = await getSocialBatchId(brandId);

    if (!websiteBatchId && !socialBatchId) {
        // No data to process
        redirect('/dashboard/brandos-v2.1/phase-0');
    }

    return (
        <div className="space-y-6">
            <DashboardLayoutHeading
                title={`Phase 0 Audit: ${brandData.name}`}
                subtitle="Initializing Evidence Ledger Builder..."
            />
            <DashboardInnerLayout>
                <Phase0Processor 
                    clientId={user.client_id}
                    brandId={brandId} 
                    websiteBatchId={websiteBatchId} 
                    socialBatchId={socialBatchId} 
                    brandName={brandData.name}
                />
            </DashboardInnerLayout>
        </div>
    );
}
