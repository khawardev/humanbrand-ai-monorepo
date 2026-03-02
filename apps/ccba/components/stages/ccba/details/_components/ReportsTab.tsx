import ReportDataViewer from "@/components/stages/ccba/details/reports-tab/ReportDataViewer";
import { getBrandbyIdWithCompetitors } from "@/server/actions/brandActions";
import { getBatchSocialReports } from "@/server/actions/ccba/social/socialReportActions";
import { getBatchWebsiteReports } from "@/server/actions/ccba/website/websiteReportActions";

export default async function ReportsTab({ brandId }: { brandId: string }) {
  const brandData = await getBrandbyIdWithCompetitors(brandId);
  
  const websiteReportData = await getBatchWebsiteReports(brandId);
  const allSocialReportsData = await getBatchSocialReports(brandId);

  return (
    <ReportDataViewer
      competitors={brandData.competitors}
      allSocialReportsData={allSocialReportsData}
      allwebsiteReportsData={websiteReportData}
      brandName={brandData.name}
    />
  );
}
