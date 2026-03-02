import { getBrands } from "@/server/actions/brandActions";
import CreateCgeSessionForm from "@/components/stages/cge/CreateCgeSessionForm";
import { DashboardInnerLayout, DashboardLayoutHeading } from "@/components/stages/ccba/dashboard/shared/DashboardComponents";

export default async function NewCgeSessionPage() {
    const brands = await getBrands();

    return (
        <>
            <DashboardLayoutHeading
                title="Create New CGE Session"
                subtitle="Select a brand and a completed BVO session to create a knowledge base for content generation."
            />
            <DashboardInnerLayout>
                <CreateCgeSessionForm brands={brands} />
            </DashboardInnerLayout>
        </>
    );
}
