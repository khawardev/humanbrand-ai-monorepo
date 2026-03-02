import { BlurDelay3 } from "@/components/shared/MagicBlur";
import BvoList from "@/components/stages/bvo/BvoList";
import { DashboardHeaderBlock, DashboardLayoutHeading } from "@/components/stages/ccba/dashboard/shared/DashboardComponents";
import { BrandOSConfig } from "@/config/brandos-sidebar-config";

export default function page() {
  return (
    <>
      <DashboardLayoutHeading
        title={BrandOSConfig.mainNav[1].title}
        subtitle={BrandOSConfig.mainNav[1].desc}
      />
      <DashboardHeaderBlock
        title="Brand Intention Intelligence"
        subtitle="View and Add Brands Report in Intention Intelligence"
        buttonLabel="Brand"
        buttonHref="/dashboard/bvo/new"
      />
       <BlurDelay3>
        <BvoList />
      </BlurDelay3> 
    </>
  );
}
