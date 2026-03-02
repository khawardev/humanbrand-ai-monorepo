import { redirect } from 'next/navigation';
import { getBrandbyIdWithCompetitors } from '@/server/actions/brandActions';
import { getEvidenceLedgerAction } from '@/server/actions/phase0/evidenceActions';
import { DashboardLayoutHeading, DashboardInnerLayout } from '@/components/brandos-v2.1/shared/DashboardComponents';
import { Phase0ResultsView } from '@/components/brandos-v2.1/phase0/ResultsView';
import { getCurrentUser } from '@/server/actions/authActions';

type PageProps = {
    params: Promise<{ brandId: string }>;
    searchParams: Promise<{ engagementId: string }>;
};

export default async function Phase0ResultsPage({ params, searchParams }: PageProps) {
    const { brandId } = await params;
    const { engagementId } = await searchParams;
    await getCurrentUser();

    if (!brandId) redirect('/dashboard/brandos-v2.1/phase-0');
    if (!engagementId) redirect(`/dashboard/brandos-v2.1/phase-0`);

    const brandData = await getBrandbyIdWithCompetitors(brandId);
    if (!brandData) redirect('/dashboard/brandos-v2.1/phase-0');

    const ledgerResult = await getEvidenceLedgerAction(engagementId);

    if (!ledgerResult.success || !ledgerResult.data) {
        // Handle error gracefully - maybe the ID is invalid or API is down
        return (
            <div className="space-y-6">
                <DashboardLayoutHeading
                    title={`Phase 0 Results: ${brandData.name}`}
                    subtitle="Evidence Ledger"
                />
                 <DashboardInnerLayout>
                    <div className="p-6 text-center text-destructive border border-destructive rounded-md bg-destructive/10">
                        <p className="font-bold">Failed to load Evidence Ledger</p>
                        <p>{ledgerResult.message || "Unknown error"}</p>
                    </div>
                 </DashboardInnerLayout>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <DashboardLayoutHeading
                title={`Phase 0 Results: ${brandData.name}`}
                subtitle={`Evidence Ledger & Quality Assessment (ID: ${engagementId.slice(0, 8)}...)`}
            />
            <DashboardInnerLayout>
                <Phase0ResultsView ledgerData={ledgerResult.data} />
            </DashboardInnerLayout>
        </div>
    );
}
