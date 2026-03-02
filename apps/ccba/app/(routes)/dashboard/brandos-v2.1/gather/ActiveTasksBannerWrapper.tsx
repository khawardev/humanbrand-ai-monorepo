import { ActiveTasksBanner } from "@/components/brandos-v2.1/gather/ActiveTasksBanner";
import { isStatusProcessing, isWithinOneDay } from "@/lib/utils";


export async function ActiveTasksBannerWrapper({ brands }: { brands: any[] }) {

    const processingBrands = brands.filter((brand) => {
        const isWebProcessing = isStatusProcessing(brand.webStatus);
        const isSocialProcessing = isStatusProcessing(brand.socialStatus);
        const isWebWithinOneDay = isWithinOneDay(brand.webCreatedAt);
        const isSocialWithinOneDay = isWithinOneDay(brand.socialCreatedAt);
        
        const shouldShowWeb = isWebProcessing && isWebWithinOneDay;
        const shouldShowSocial = isSocialProcessing && isSocialWithinOneDay;
        
        return shouldShowWeb || shouldShowSocial;
    }).map((brand) => ({
        brand,
        hasData: false,
        isProcessing: true,
        websiteBatchId: brand.websiteBatchId,
        socialBatchId: brand.socialBatchId,
        webStatus: brand.webStatus,
        socialStatus: brand.socialStatus,
        webError: brand.webError,
        socialError: brand.socialError,
        webCreatedAt: brand.webCreatedAt,
        socialCreatedAt: brand.socialCreatedAt
    }));

    return <ActiveTasksBanner initialProcessingBrands={processingBrands} />;
}
