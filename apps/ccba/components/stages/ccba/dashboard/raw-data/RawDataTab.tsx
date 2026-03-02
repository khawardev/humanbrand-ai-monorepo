import RawDataDashboard from "./RawDataDashboard";
import { getWebsiteBatchId, getscrapeBatchWebsite } from '@/server/actions/ccba/website/websiteScrapeActions'
import { getScrapeBatchSocial, getSocialBatchId } from '@/server/actions/ccba/social/socialScrapeActions'

export default async function RawDataTab({ brandId, competitorId }: { brandId: string, competitorId?: string }) {

  const website_batch_id = await getWebsiteBatchId(brandId);
  const websiteScrapsData = await getscrapeBatchWebsite(brandId, website_batch_id);

  const social_batch_id = await getSocialBatchId(brandId);
  const socialScrapsData = await getScrapeBatchSocial(brandId, social_batch_id);

  if (competitorId) {
    const competitorWebsiteScraps = websiteScrapsData.competitors.find((c: any) => c.competitor_id === competitorId);
    const competitorSocialScraps = socialScrapsData.competitors.find((c: any) => c.competitor_id === competitorId);
    return <RawDataDashboard websiteScrapsData={competitorWebsiteScraps} socialScrapsData={competitorSocialScraps} />
  }

  return <RawDataDashboard websiteScrapsData={websiteScrapsData.brand} socialScrapsData={socialScrapsData.brand} />
}
