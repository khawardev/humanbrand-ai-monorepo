import { getBatchWebsiteReports } from '@/server/actions/ccba/website/websiteReportActions'
import { parseJsonFromMarkdown } from '@/lib/static/jsonParser'
import WebsiteAuditTabs from './WebsiteAuditTabs'

export default async function WebsiteAuditData({ brandId, competitorId, title }: { brandId: string, competitorId?: string, title: string }) {
  const websiteReportsData = await getBatchWebsiteReports(brandId);
  
  let extractorReport = null;
  let synthesizerReport = null;

  if (competitorId) {
    const latestWebsiteReports = websiteReportsData? [...websiteReportsData].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()): []
    const latestCompetitorWebsiteReport = latestWebsiteReports?.[0]?.competitor_reports?.find((report: any) => report.competitor_id === competitorId)
    extractorReport = latestCompetitorWebsiteReport?.extraction_report?.response? parseJsonFromMarkdown(latestCompetitorWebsiteReport.extraction_report.response): null;
    synthesizerReport = latestCompetitorWebsiteReport?.synthesizer_report?.response ?? null;
  } else {
    const latestWebsiteReports = websiteReportsData ? [...websiteReportsData].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()): []
    extractorReport = latestWebsiteReports?.[0]?.brand_extraction?.response ? parseJsonFromMarkdown(latestWebsiteReports?.[0]?.brand_extraction?.response): null;
    synthesizerReport = latestWebsiteReports?.[0]?.brand_synthesizer?.response ?? null;
  }

  return <WebsiteAuditTabs extractorReport={extractorReport} synthesizerReport={synthesizerReport} title={title} />
}
