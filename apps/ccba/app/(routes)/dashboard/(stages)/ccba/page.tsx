import { DashboardHeaderBlock, DashboardLayoutHeading } from "@/components/stages/ccba/dashboard/shared/DashboardComponents";
import { BrandOSConfig } from "@/config/brandos-sidebar-config";
import { BlurDelay3 } from "@/components/shared/MagicBlur";
import BrandList from "@/components/stages/ccba/list/BrandList";

export default async function page() {
  return (
    <>
      <DashboardLayoutHeading
        title={BrandOSConfig.mainNav[0].title}
        subtitle={BrandOSConfig.mainNav[0].desc}
      />
      <DashboardHeaderBlock
        title="Brand Perception Intelligence"
        subtitle="View and Add Brands and competitors in Perception Intelligence"
        buttonLabel="Brand"
        buttonHref="/dashboard/ccba/new"
      />
      <BlurDelay3>
        <BrandList />
      </BlurDelay3>
    </>
  );
}
