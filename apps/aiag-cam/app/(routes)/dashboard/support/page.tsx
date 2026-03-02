import { Suspense } from "react";
import { getUserSupportTickets } from "@/server/actions/supportActions";
import { SupportPageComponent } from "@/components/routes/support/SupportPageComponent";
import { DashboardInnerLayout } from "@/components/shared/DashboardComponents";
import { getLoomVideos } from "@/server/actions/loomActions";


export default async function SupportPage() {
  const tickets = await getUserSupportTickets();

  return (
    <DashboardInnerLayout>
        <Suspense fallback={<div>Loading support tickets...</div>}>
          <SupportPageComponent tickets={tickets} />
        </Suspense>
    </DashboardInnerLayout>
  );
}
