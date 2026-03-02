import { getscrapeBatchWebsite } from '@/server/actions/ccba/website/websiteScrapeActions';
import { SimpleWebsiteScrapViewer } from '@/components/brandos-v2.1/gather/results-viewers/SimpleWebsiteScrapViewer';

export async function WebsiteResultsWrapper({ 
    brandId, 
    batchId, 
    brandName, 
    status 
}: { 
    brandId: string;
    batchId: string | null;
    brandName: string;
    status: string | null;
}) {
    if (!batchId) {
       // Return empty viewer with status to show "no data" or "pending" state
       return <SimpleWebsiteScrapViewer scrapsData={null} brandName={brandName} status={status} />;
    }

    // Fetch data inside the Suspense boundary
    const websiteData = await getscrapeBatchWebsite(brandId, batchId);

    return (
        <SimpleWebsiteScrapViewer
            scrapsData={websiteData}
            brandName={brandName}
            status={status}
        />
    );
}
