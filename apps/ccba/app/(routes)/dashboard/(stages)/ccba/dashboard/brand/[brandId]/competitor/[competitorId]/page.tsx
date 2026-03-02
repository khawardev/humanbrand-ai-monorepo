import BrandDashboard from '@/components/stages/ccba/dashboard/BrandDashboard'
import { getBrandbyIdWithCompetitors } from '@/server/actions/brandActions'
import RawDataTab from '@/components/stages/ccba/dashboard/raw-data/RawDataTab'
import WebsiteAuditData from '@/components/stages/ccba/dashboard/website-audit/WebsiteAuditData'
import SocialAuditTab from '@/components/stages/ccba/dashboard/social-audit/SocialAuditTab'
import AnalyticsDashboardsData from '@/components/stages/ccba/dashboard/analytics-dashboards/AnalyticsDashboardsData'
import { getCurrentUser } from '@/server/actions/authActions'
import { DashboardInnerLayout, DashboardLayoutHeading } from '@/components/stages/ccba/dashboard/shared/DashboardComponents'

export default async function CompetitorPage({ params }: { params: Promise<{ brandId: string; competitorId: string }> }) {
    await getCurrentUser()

    const { brandId, competitorId } = await params
    const brandData = await getBrandbyIdWithCompetitors(brandId)

    const competitor = brandData.competitors.find((c: any) => c.competitor_id === competitorId)
    const competitorName = competitor ? competitor.name : 'Competitor';

    return (
        <>
            <DashboardLayoutHeading
                title={competitorName}
                subtitle={'Website and Social Captured Data, Extracted & Outside-In reports, Brand Perception and Analytics Dashboards.'}
            />

            <DashboardInnerLayout>
                <BrandDashboard
                    title={competitorName}
                    rawDataTab={<RawDataTab brandId={brandId} competitorId={competitorId} />}
                    websiteAuditTab={<WebsiteAuditData brandId={brandId} competitorId={competitorId} title={competitorName} />}
                    socialAuditTab={<SocialAuditTab brandId={brandId} competitorId={competitorId} />}
                    analyticsDashboardsTab={<AnalyticsDashboardsData brandId={brandId} brandName={brandData.name} competitorId={competitorId} />}
                />
            </DashboardInnerLayout>
        </>
    )
}