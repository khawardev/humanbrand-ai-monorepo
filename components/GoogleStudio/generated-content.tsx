import React, { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Separator } from "@/components/ui/separator";
import { AIAG_VERSION } from "@/lib/ai/constants";
import { ContentActions } from "./content-actions";
import { ImageGenerator } from "./image-generator";
import { ContentChat } from "./content-chat";

interface GeneratedContentProps {
    content: string;
    imagePrompt: string;
    setImagePrompt: (prompt: string) => void;
}

export function GeneratedContent({ content, imagePrompt, setImagePrompt }: GeneratedContentProps) {
    const contentRef = useRef<any>(null);

    return (
        <main className="space-y-10">
            <section>
                <div className="md:flex items-center justify-between">
                    <h3 className="mb-4">AIAG - Content Generation Details ({AIAG_VERSION})</h3>
                    <ContentActions content={content} contentRef={contentRef} />
                </div>
                <Separator className="mb-4" />
                <div ref={contentRef} className="prose prose-neutral max-w-none markdown-body space-y-3 dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </div>
                <Separator className="mt-4" />
            </section>

            <ImageGenerator imagePrompt={imagePrompt}  />

            <Separator />

            <ContentChat />
        </main>
    );
}