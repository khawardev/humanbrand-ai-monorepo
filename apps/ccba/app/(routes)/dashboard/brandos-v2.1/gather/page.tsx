import { getEnrichedBrands } from "@/server/actions/brandActions";
import { DashboardLayoutHeading } from '@/components/brandos-v2.1/shared/DashboardComponents';
import { GatherBrandList } from '@/components/brandos-v2.1/gather/GatherBrandList';
import { ActiveTasksBannerWrapper } from './ActiveTasksBannerWrapper';
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardInnerLayout } from '@/components/stages/ccba/dashboard/shared/DashboardComponents';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function GatherPage() {
    console.log(`[GatherPage] Starting page render...`);
    
    const brands = await getEnrichedBrands();
    
    console.log(`[GatherPage] Received ${brands?.length || 0} brands`);
    
    if (brands && brands.length > 0) {
        brands.forEach((brand, i) => {
            console.log(`[GatherPage] Brand[${i}]: name=${brand.name}, brand_id=${brand.brand_id}, competitors=${brand.competitors?.length || 0}, webBatchId=${brand.websiteBatchId}, socialBatchId=${brand.socialBatchId}, webStatus=${brand.webStatus}, socialStatus=${brand.socialStatus}`);
        });
    }

    if (!brands || brands.length === 0) {
        return (
            <div>
                <DashboardLayoutHeading
                    title="Data Gathering"
                    subtitle="Manage data collection and view captured content for your brands."
                />
                <div className="w-full p-6 text-center text-muted-foreground">
                    No brands found. Create a new engagement in Setup to get started.
                </div>
            </div>
        );
    }

    return (
        <div>
            <DashboardLayoutHeading
                title="Data Gathering"
                subtitle="Manage data collection and view captured content for your brands."
            />
            <div className="w-full">
                    <ActiveTasksBannerWrapper brands={brands} />
                    <GatherBrandList brands={brands} />
            </div>
        </div>
    );
}
