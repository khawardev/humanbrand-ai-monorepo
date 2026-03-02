import { getBrands } from "@/server/actions/brandActions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DashboardHeaderBlock, DashboardInnerLayout, DashboardLayoutHeading } from "@/components/stages/ccba/dashboard/shared/DashboardComponents";
import { BrandOSConfig } from "@/config/brandos-sidebar-config";
import { CgeSessionsList } from "@/components/stages/cge/CgeSessionsList";
import { BlurDelay3 } from "@/components/shared/MagicBlur";

export default async function CgePage() {
    const brands = await getBrands();

    return (
        <>
            <DashboardLayoutHeading
                title={BrandOSConfig.mainNav[2].title}
                subtitle={BrandOSConfig.mainNav[2].desc}
            />
            <DashboardHeaderBlock
                title="Brand Ground Truth & Content Studio"
                subtitle="View and Add Brands and competitors in Ground Truth & Content Studio"
                buttonLabel="Session"
                buttonHref="/dashboard/cge/new"
            />
            <BlurDelay3>
                <CgeSessionsList brands={brands} />
            </BlurDelay3>
            
        </>
    );
}