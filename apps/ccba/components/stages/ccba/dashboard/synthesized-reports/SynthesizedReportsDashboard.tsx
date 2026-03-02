'use client'

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy, DownloadCloud } from "lucide-react";
import { toast } from "sonner";
import { EmptyStateCard } from "@/components/shared/CardsUI";
import { MarkdownViewer } from "@/components/shared/MarkdownViewer";

export default function SynthesizedReportsDashboard({ synthesizerReport, title }: any) {
    const [copied, setCopied] = useState(false);

    if (!synthesizerReport) {
        return <EmptyStateCard message="No synthesized reports available." />
    }


    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(synthesizerReport);
            toast.success('Content Copied to Clipboard')
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
            try {
                toast.success('Content Copied to Clipboard')
                const textarea = document.createElement("textarea");
                textarea.value = synthesizerReport;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch {
                // fallback failed — silently fail
            }
        }
    };

    const handleDownload = () => {
        const blob = new Blob([synthesizerReport], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title}_synthesized-report.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="relative space-y-6 min-h-0">
            <div className="flex items-center justify-between gap-2 ">
                <h2 className="text-xl  font-semibold">
                    {title.charAt(0).toUpperCase() + title.slice(1)} Synthesized Report
                </h2>
                <div className="flex items-center gap-2">
                    <Button onClick={handleDownload} variant="outline" aria-label="Download report">
                        <DownloadCloud />
                        Download
                    </Button>
                    <Button onClick={handleCopy} variant="outline" aria-label="Copy report">
                        <Copy />
                        {copied ? "Copied!" : "Copy"}
                    </Button>
                </div>
            </div>

            <ScrollArea className="h-[70vh] bg-outline ">
                <MarkdownViewer content={synthesizerReport} />
            </ScrollArea>
        </div>
    );
}