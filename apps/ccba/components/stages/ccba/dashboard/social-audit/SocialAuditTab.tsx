import { getBatchSocialReports } from '@/server/actions/ccba/social/socialReportActions'
import SocialReportDisplay from "@/components/stages/ccba/details/reports-tab/social/SocialReportDisplay";
import { EmptyStateCard } from '@/components/shared/CardsUI';

export default async function SocialAuditTab({ brandId, competitorId }: { brandId: string, competitorId?: string }) {
  const socialReportsData: any = await getBatchSocialReports(brandId);
  
  let reports = null;

  if (competitorId) {
    const latestSocialReports = socialReportsData?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    const latestCompetitorSocialReport = latestSocialReports?.[0]?.competitor_reports?.find((report: any) => report.competitor_id === competitorId)
    reports = latestCompetitorSocialReport?.reports;
  } else {
    const latestSocialReport = socialReportsData?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    reports = latestSocialReport?.brand_reports;
  }

  if (!reports || reports?.length !> 0) {
    return <EmptyStateCard message="No reports are present at the moment." /> 
  }

  return (
     <SocialReportDisplay
        entityReports={reports}
        selectedEntityName={reports[0]?.entity_name}
      />
    
  )
}
