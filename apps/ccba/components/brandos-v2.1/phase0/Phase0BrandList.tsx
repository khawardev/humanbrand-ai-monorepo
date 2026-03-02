import { Phase0BrandCardSkeleton, Phase0BrandCardWrapper } from '@/app/(routes)/dashboard/brandos-v2.1/phase-0/Phase0BrandCardWrapper';
import { EmptyStateCard } from '@/components/shared/CardsUI';
import { DashboardInnerLayout } from '@/components/stages/ccba/dashboard/shared/DashboardComponents';
import { Badge } from '@/components/ui/badge';
import { Suspense } from 'react';

type Phase0BrandListProps = {
    brandCount: number;
    brands: any;
};

export function Phase0BrandList({ brandCount, brands }: Phase0BrandListProps) {
    if (brandCount === 0) {
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
                <h3 className="text-2xl ">Select a Brand to Audit</h3>
            </DashboardInnerLayout>
            {brands && brands.map((brand: any, index: number) => (
                <Suspense key={brand.brand_id} fallback={<Phase0BrandCardSkeleton />}>
                    <Phase0BrandCardWrapper brand={brand} index={index} />
                </Suspense>
            ))}
        </div>
    );
}
