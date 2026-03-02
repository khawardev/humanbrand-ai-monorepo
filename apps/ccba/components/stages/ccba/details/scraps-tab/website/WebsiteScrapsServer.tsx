import { getpreviousWebsiteScraps, getscrapeBatchWebsite } from "@/server/actions/ccba/website/websiteScrapeActions";
import WebsiteScraps from "./WebsiteScraps";
import { getCurrentUser } from "@/server/actions/authActions";

export default async function WebsiteScrapsServer({ brandName, brand_id }: { brandName: string, brand_id: string }) {
    const user = await getCurrentUser();
  
    const previousWebsiteScraps:any = await getpreviousWebsiteScraps(brand_id);
    const safeScraps = Array.isArray(previousWebsiteScraps) ? previousWebsiteScraps : [];
    const websiteScrapeBatchPromises = safeScraps.map(
        async (scrape: any) => await getscrapeBatchWebsite(brand_id, scrape.batch_id)
    );
    const websiteScrapeBatchResults = await Promise.all(websiteScrapeBatchPromises);
    const validWebsiteScrapeData = websiteScrapeBatchResults.filter(data => data);

    return (
        <WebsiteScraps
            allScrapsData={validWebsiteScrapeData}
            brandName={brandName}
            brand_id={brand_id}
        />
    );
}
