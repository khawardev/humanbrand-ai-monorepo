import { getBrandbyIdWithCompetitors } from '@/server/actions/brandActions';
import { AnimatedTabs } from '@/components/stages/ccba/details/AnimatedTabs';
import { BlurDelay3 } from '@/components/shared/MagicBlur';
import { Suspense } from 'react';
import BrandProfileTab from '../../../../../../components/stages/ccba/details/_components/BrandProfileTab';
import ScrapsTab from '../../../../../../components/stages/ccba/details/_components/ScrapsTab';
import ReportsTab from '../../../../../../components/stages/ccba/details/_components/ReportsTab';
import { BrandProfileSkeleton } from '../../../../../../components/stages/ccba/details/_components/_skeleton/BrandProfileSkeleton';
import ScrapDataViewerSkeleton from '../../../../../../components/stages/ccba/details/_components/_skeleton/ScrapDataViewerSkeleton';
import { ReportDataViewerSkeleton } from '../../../../../../components/stages/ccba/details/_components/_skeleton/ReportDataViewerSkeleton';
import { SCRAPS } from '@/lib/constants';
import { getBatchWebsiteReports } from '@/server/actions/ccba/website/websiteReportActions';
import { getpreviousWebsiteScraps } from '@/server/actions/ccba/website/websiteScrapeActions';
import { getCcbaTaskStatus } from '@/server/actions/ccba/statusActions';
import { DashboardInnerLayout, DashboardLayoutHeading } from '@/components/stages/ccba/dashboard/shared/DashboardComponents';

export default async function BrandDetailPage({
  params
}: {
  params: Promise<{ brandId: string }>;
}) {
  const { brandId } = await params;

  const brandData = await getBrandbyIdWithCompetitors(brandId);
  const websiteReportData = await getBatchWebsiteReports(brandId);
  const websiteScraps:any = await getpreviousWebsiteScraps(brandId);
  const taskStatusData = await getCcbaTaskStatus(brandId);
  

  const tabs = [
    {
      label: 'Brand Profile',
      value: 'brand_profile',
      tooltip: 'View Brand & Competitors profile',
      content: (
        <Suspense fallback={<BrandProfileSkeleton />}>
          <BrandProfileTab brandId={brandId} />
        </Suspense>
      )
    },
    {
      label: SCRAPS,
      value: 'brand_scraps',
      disabled: websiteScraps?.[0].status === 'Processing',
      disabledTooltip: 'Please Capture Data for Website',
      tooltip: 'View Brand & Competitors Captured Data',
      content: (
        <Suspense fallback={<ScrapDataViewerSkeleton />}>
          <ScrapsTab brandId={brandId} />
        </Suspense>
      )
    },
    {
      label: 'Reports',
      value: 'brand_reports',
      disabled: !(websiteReportData && websiteReportData.length > 0),
      disabledTooltip: 'Please Generate Reports for Website and Socials',
      tooltip: 'View Brand & Competitors Reports',
      content: (
        <Suspense fallback={<ReportDataViewerSkeleton />}>
          <ReportsTab brandId={brandId} />
        </Suspense>
      )
    }
  ];

  return (
    <>
      <DashboardLayoutHeading
        title={`${brandData?.name} - Brand Details`}
        subtitle="See how the brand and competitors truly show up."
      />
      <DashboardInnerLayout>
        <BlurDelay3>
          <AnimatedTabs tabs={tabs} status={taskStatusData} />
        </BlurDelay3>
      </DashboardInnerLayout >
    </>
  );
}