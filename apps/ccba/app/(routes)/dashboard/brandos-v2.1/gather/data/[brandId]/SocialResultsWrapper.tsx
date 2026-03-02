import { getScrapeBatchSocial } from '@/server/actions/ccba/social/socialScrapeActions';
import { SimpleSocialScrapViewer } from '@/components/brandos-v2.1/gather/results-viewers/SimpleSocialScrapViewer';

export async function SocialResultsWrapper({ 
    brandId, 
    batchId, 
    brandName, 
    brandData,
    status 
}: { 
    brandId: string;
    batchId: string | null;
    brandName: string;
    brandData: any;
    status: string | null;
}) {
    if (!batchId) {
        return <SimpleSocialScrapViewer scrapsData={null} brandName={brandName} brandData={brandData} status={status} />;
    }

    const socialData = await getScrapeBatchSocial(brandId, batchId);

    return (
        <SimpleSocialScrapViewer
            scrapsData={socialData}
            brandName={brandName}
            brandData={brandData}
            status={status}
        />
    );
}
