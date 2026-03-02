
import Link from "next/link";
import { MdOutlineArrowRight } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { 
    CompetitorsTable, 
    StatusBadge 
} from "@/components/brandos-v2.1/gather/BrandItemParts";
import BrandItem, { BrandItemSkeleton } from "@/components/brandos-v2.1/gather/BrandItem";

export async function Phase0BrandCardWrapper({ brand, index }: { brand: any, index: number }) {
    // Data is pre-fetched by getEnrichedBrands
    const { websiteBatchId, socialBatchId, webStatus, socialStatus, competitors } = brand;

    const canAudit = websiteBatchId && socialBatchId;

    const actionsSlot = canAudit ? (
        <Link href={`/dashboard/brandos-v2.1/phase-0/processing/${brand.brand_id}`}>
            <Button size="sm" className="gap-2">
                Start Phase 0
                <MdOutlineArrowRight />
            </Button>
        </Link>
    ) : (
        <Link href={`/dashboard/brandos-v2.1/gather/collecting/${brand.brand_id}`}>
            <Button variant="outline" size="sm" className="gap-2">
                Go to Gather
                <MdOutlineArrowRight />
            </Button>
        </Link>
    );

    const itemProps = {
        brand,
        websiteBatchId,
        socialBatchId,
        hasData: false, 
        isProcessing: false,
        actionsSlot, 
    };

    return (
        <BrandItem 
            item={itemProps} 
            index={index}
            competitorsSlot={
                <CompetitorsTable competitors={competitors || []} />
            }
            webStatusSlot={
                websiteBatchId ? (
                    <StatusBadge label="Website" status={webStatus} />
                ) : null
            }
            socialStatusSlot={
                 socialBatchId ? (
                    <StatusBadge label="Social" status={socialStatus} />
                ) : null
            }
        />
    );
}

export function Phase0BrandCardSkeleton() {
    return <BrandItemSkeleton />;
}
