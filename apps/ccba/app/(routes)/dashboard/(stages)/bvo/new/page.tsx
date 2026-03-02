import NewBvoForm from "@/components/stages/bvo/NewBvoForm";
import { getBrands } from "@/server/actions/brandActions";
import { getCurrentUser } from "@/server/actions/authActions";
import { DashboardInnerLayout, DashboardLayoutHeading } from "@/components/stages/ccba/dashboard/shared/DashboardComponents";

export default async function AddBvoPage() {
  const brands = await getBrands();
  const user = await getCurrentUser()

  return (
    <>
      <DashboardLayoutHeading
        title="BVO Details"
        subtitle="Configure the core details of your Brand Validation & Optimization audit."
      />
      <DashboardInnerLayout>
        <NewBvoForm client_id={user.client_id} brands={brands} />
      </DashboardInnerLayout >
    </>
  );
}