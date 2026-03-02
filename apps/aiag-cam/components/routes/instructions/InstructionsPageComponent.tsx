"use client";

import { LoomVideosList } from "@/components/routes/admin/loom/LoomVideosList";

interface InstructionsPageComponentProps {
  videos: any[];
}

export function InstructionsPageComponent({ videos }: InstructionsPageComponentProps) {
  return (
    <div className="space-y-6 py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Support videos & Instructions for AIAG CAM 26.2</h1>
        <p className="text-muted-foreground">
          Watch instructional videos to learn how to use AIAG CAM 26.2 effectively.
        </p>
      </div>

      <LoomVideosList videos={videos} readOnly={true} />
    </div>
  );
}
