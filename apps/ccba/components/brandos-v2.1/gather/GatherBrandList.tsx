import { EmptyStateCard } from '@/components/shared/CardsUI';
import { Badge } from '@/components/ui/badge';
import { DashboardInnerLayout } from '@/components/stages/ccba/dashboard/shared/DashboardComponents';
import { BrandCardWrapper } from '@/app/(routes)/dashboard/brandos-v2.1/gather/BrandCardWrapper';
import { BrandItemSkeleton } from './BrandItem';

type GatherBrandListProps = {
    brands: any[];
};

export function GatherBrandList({ brands }: GatherBrandListProps) {
    if (!brands || brands.length === 0) {
        return (
            <EmptyStateCard message="No brands found. Create a new engagement in Setup to get started." />
        );
    }

    return (
        <div>
            <DashboardInnerLayout className="space-y-4">
                <Badge className='mb-2'>
                    {brands.length} brand{brands.length !== 1 ? 's' : ''}
                </Badge>
                <h3 className="text-2xl ">Your Brands</h3>
            </DashboardInnerLayout>

            {brands.map((brand, index) => (
                <BrandCardWrapper 
                    key={brand.brand_id || index} 
                    brand={brand} 
                    index={index} 
                />
            ))}
        </div>
    );
}

export function GatherBrandListSkeleton() {
    return (
        <div>
            <DashboardInnerLayout className="space-y-4">
                <Badge className='mb-2'>Loading...</Badge>
                <h3 className="text-2xl ">Your Brands</h3>
            </DashboardInnerLayout>
            {[1, 2, 3].map((i) => (
                <div key={i} className="p-6">
                    <BrandItemSkeleton />
                </div>
            ))}
        </div>
    );
}
