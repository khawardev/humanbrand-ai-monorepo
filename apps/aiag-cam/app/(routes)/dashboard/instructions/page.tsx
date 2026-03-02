import { Suspense } from "react";
import { getLoomVideos } from "@/server/actions/loomActions";
import { InstructionsPageComponent } from "@/components/routes/instructions/InstructionsPageComponent";
import { DashboardInnerLayout } from "@/components/shared/DashboardComponents";

export default async function InstructionsPage() {
  const videos = await getLoomVideos();

  return (
    <DashboardInnerLayout>
        <Suspense fallback={<div>Loading instructional videos...</div>}>
          <InstructionsPageComponent videos={videos} />
        </Suspense>
    </DashboardInnerLayout>
  );
}
