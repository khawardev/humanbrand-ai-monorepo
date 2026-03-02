import { getCurrentUser } from "@/server/actions/authActions";
import ProfileComp from "@/components/static/ProfileSection";
import { DashboardInnerLayout, DashboardLayoutHeading } from "@/components/stages/ccba/dashboard/shared/DashboardComponents";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  return (
    <>
      <DashboardLayoutHeading
        title="Profile"
        subtitle="Update your personal information, account settings, and preferences"
      />
      <DashboardInnerLayout>
          <ProfileComp user={user} />
      </DashboardInnerLayout>
    </>
  );
}