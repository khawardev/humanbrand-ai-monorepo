"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentGeneration from "@/components/stages/cge/ContentGeneration";
import ContentRevision from "@/components/stages/cge/ContentRevision";
import Chat from "@/components/stages/cge/Chat";

export default function CgeSessionClient({ cgeSessionId, brandId }: { cgeSessionId: string, brandId: string }) {
  const [generatedContent, setGeneratedContent] = useState("");
  const [revisedContent, setRevisedContent] = useState("");

  return (
    <Tabs defaultValue="content-generation">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="content-generation">Content Generation</TabsTrigger>
        <TabsTrigger value="content-revision">Content Revision</TabsTrigger>
        <TabsTrigger value="chat">Chat</TabsTrigger>
      </TabsList>
      <TabsContent value="content-generation" className="mt-6">
        <ContentGeneration
          camSessionId={cgeSessionId}
          brandId={brandId}
          generatedContent={generatedContent}
          setGeneratedContent={setGeneratedContent}
        />
      </TabsContent>
      <TabsContent value="content-revision" className="mt-6">
        <ContentRevision
          camSessionId={cgeSessionId}
          brandId={brandId}
          originalContent={generatedContent}
          revisedContent={revisedContent}
          setRevisedContent={setRevisedContent}
        />
      </TabsContent>
      <TabsContent value="chat" className="mt-6">
        <Chat camSessionId={cgeSessionId} brandId={brandId} />
      </TabsContent>
    </Tabs>
  );
}
