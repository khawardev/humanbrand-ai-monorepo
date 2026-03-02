import { getEnrichedBrands } from "@/server/actions/brandActions";
import { DashboardLayoutHeading } from '@/components/brandos-v2.1/shared/DashboardComponents';
import { Phase0BrandList } from '@/components/brandos-v2.1/phase0/Phase0BrandList';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Phase0Page() {
    const brands = await getEnrichedBrands();
    const brandCount = brands ? brands.length : 0;

    return (
        <div>
            <DashboardLayoutHeading
                title="Phase 0: Outside-In Audit"
                subtitle="Establish the evidence ledger and evaluate corpus adequacy."
            />
            <Phase0BrandList brandCount={brandCount} brands={brands} />
        </div>
    );
}
