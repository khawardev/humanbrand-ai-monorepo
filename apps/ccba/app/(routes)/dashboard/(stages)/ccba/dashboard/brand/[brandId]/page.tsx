import BrandDashboard from '@/components/stages/ccba/dashboard/BrandDashboard'
import { getBrandbyIdWithCompetitors } from '@/server/actions/brandActions'
import RawDataTab from '@/components/stages/ccba/dashboard/raw-data/RawDataTab'
import WebsiteAuditData from '@/components/stages/ccba/dashboard/website-audit/WebsiteAuditData'
import SocialAuditTab from '@/components/stages/ccba/dashboard/social-audit/SocialAuditTab'
import AnalyticsDashboardsData from '@/components/stages/ccba/dashboard/analytics-dashboards/AnalyticsDashboardsData'
import { getCurrentUser } from '@/server/actions/authActions'
import { DashboardInnerLayout, DashboardLayoutHeading } from '@/components/stages/ccba/dashboard/shared/DashboardComponents'

export default async function BrandPage({ params }: { params: Promise<{ brandId: string }> }) {
  await getCurrentUser();

  const { brandId } = await params;
  const brandData = await getBrandbyIdWithCompetitors(brandId);


  return (
    <>
      <DashboardLayoutHeading
        title={brandData?.name}
        subtitle={'Website and Social Captured Data, Extracted & Outside-In reports, Brand Perception and Analytics Dashboards.'}
      />

      <DashboardInnerLayout>
        <BrandDashboard
          title={brandData?.name}
          rawDataTab={<RawDataTab brandId={brandId} />}
          websiteAuditTab={<WebsiteAuditData brandId={brandId} title={brandData?.name} />}
          socialAuditTab={<SocialAuditTab brandId={brandId} />}
          analyticsDashboardsTab={<AnalyticsDashboardsData brandId={brandId} brandName={brandData?.name} />}
        />
      </DashboardInnerLayout>
    </>
  )
}