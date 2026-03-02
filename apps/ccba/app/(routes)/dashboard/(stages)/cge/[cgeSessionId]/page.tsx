import { ContainerMd } from "@/components/shared/Containers";
import StaticBanner from "@/components/shared/StaticBanner";
import { DashboardInnerLayout, DashboardLayoutHeading } from "@/components/stages/ccba/dashboard/shared/DashboardComponents";
import CgeSessionClient from "@/components/stages/cge/CgeSessionClient";

export default async function BvoDetailPage({ params, searchParams }: any) {
  const { cgeSessionId } = await params
  const { brand_id: brandId } = await searchParams

  if (!brandId) {
    return (
      <ContainerMd>
        <StaticBanner title="Error" badge="CGE Session" />
        <p>Brand ID is missing. Please return to the CGE home page and select a session.</p>
      </ContainerMd>
    );
  }

  return (
    <>
      <DashboardLayoutHeading
        title={'CGE Session'}
        subtitle={'CGE Session'}
      />
      <DashboardInnerLayout>
        <CgeSessionClient cgeSessionId={cgeSessionId} brandId={brandId} />
      </DashboardInnerLayout>
    </>
  );
}
