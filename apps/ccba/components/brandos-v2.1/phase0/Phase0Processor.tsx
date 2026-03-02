"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { runEvidenceLedgerBuilderAction } from '@/server/actions/phase0/evidenceActions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

type Phase0ProcessorProps = {
    clientId: string;
    brandId: string;
    websiteBatchId: string | null;
    socialBatchId: string | null;
    brandName?: string;
};

export function Phase0Processor({ clientId, brandId, websiteBatchId, socialBatchId, brandName }: Phase0ProcessorProps) {
    const router = useRouter();
    const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("Initializing...");
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const startProcess = async () => {
            try {
                setStatus('running');
                setMessage("Starting Evidence Ledger Builder...");
                setProgress(10);

                // Simulate progress for better UX while waiting for the server action
                const progressInterval = setInterval(() => {
                    setProgress(prev => {
                        if (prev >= 90) return prev;
                        return prev + Math.random() * 5;
                    });
                }, 1000);

                const result = await runEvidenceLedgerBuilderAction(brandId, websiteBatchId, socialBatchId);
                
                clearInterval(progressInterval);

                if (result.success && result.data?.engagement_id) {
                    setProgress(100);
                    setStatus('completed');
                    setMessage("Ledger Built Successfully!");
                    toast.success("Phase 0 Audit Complete");
                    
                    // Add a small delay so user sees 100%
                    setTimeout(() => {
                        router.push(`/dashboard/brandos-v2.1/phase-0/results/${brandId}?engagementId=${result.data.engagement_id}`);
                    }, 1000);
                } else {
                    setStatus('error');
                    setMessage(result.message || "Failed to build evidence ledger.");
                    toast.error(result.message || "Processing failed");
                }
            } catch (error) {
                console.error(error);
                setStatus('error');
                setMessage("An unexpected error occurred.");
                toast.error("An unexpected error occurred.");
            }
        };

        startProcess();
    }, [brandId, websiteBatchId, socialBatchId, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
            <div className="w-full max-w-md space-y-6">
                <div className=' space-y-6'>
                    <CardHeader className="text-center pb-2">
                        <CardTitle>Phase 0: Evidence Processing</CardTitle>
                        <CardDescription>Building the Evidence Ledger from collected data.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex justify-center">
                            {status === 'running' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                            {status === 'completed' && <CheckCircle className="h-6 w-6 text-green-500" />}
                            {status === 'error' && <AlertCircle className="h-6 w-6 text-destructive" />}
                        </div>
                        
                        <div className="space-y-2">
                            <Progress value={progress} className="h-2" />
                            <p className="text-sm text-center text-muted-foreground italic">{message}</p>
                        </div>
                    </CardContent>
                </div>

                {/* ID Information */}
                <Card className="bg-muted/30">
                     <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1" className="border-b-0">
                                <AccordionTrigger className="hover:no-underline py-0">
                                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                                        <Info className="h-3 w-3" />
                                        <span>View Processing Identifiers</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-4">
                                    <dl className="space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <dt className="text-muted-foreground">Client ID</dt>
                                            <dd className="font-mono">{clientId}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-muted-foreground">Brand ID</dt>
                                            <dd className="font-mono">{brandId}</dd>
                                        </div>
                                        {brandName && (
                                             <div className="flex justify-between">
                                                <dt className="text-muted-foreground">Brand Name</dt>
                                                <dd className="font-medium">{brandName}</dd>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <dt className="text-muted-foreground">Website Batch ID</dt>
                                            <dd>
                                                {websiteBatchId ? (
                                                    <p>{websiteBatchId}</p>
                                                ) : <span className="text-muted-foreground italic">None</span>}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <dt className="text-muted-foreground">Social Batch ID</dt>
                                            <dd>
                                                {socialBatchId ? (
                                                    <p>{socialBatchId}</p>
                                                ) : <span className="text-muted-foreground italic">None</span>}
                                            </dd>
                                        </div>
                                    </dl>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
