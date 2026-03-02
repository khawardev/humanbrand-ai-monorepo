'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles, Copy, Download, FileText, Terminal, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarkdownViewer } from "@/components/shared/MarkdownViewer";
import { toast } from 'sonner';
import { exportWebSynthesisToSlides } from "@/server/actions/googleSlidesActions";
import { Separator } from "@/components/ui/separator";
import { exportToPDF, exportToDocx } from '@/lib/brandos-v2.1/exportUtils';
import { FileDown, FileType, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type WebSynthesisResultViewerProps = {
    data: any;
    onReRun?: () => void;
    isReRunning?: boolean;
}

export function WebSynthesisResultViewer({ data, onReRun, isReRunning = false }: WebSynthesisResultViewerProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [isExportingPDF, setIsExportingPDF] = useState(false);
    const [isExportingDocx, setIsExportingDocx] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    if (!data) return null;

    const synthesisReport = data.synthesis_report || '';
    const executionTimeValue = typeof data.execution_time_seconds === 'number' && !isNaN(data.execution_time_seconds)
        ? data.execution_time_seconds.toFixed(2)
        : 'N/A';
        
    const metadata = {
        taskId: data.task_id || 'N/A',
        entityName: data.entity_name || 'Brand',
        analysisScope: data.analysis_scope || 'N/A',
        timestamp: data.timestamp ? new Date(data.timestamp).toLocaleString() : 'N/A',
        executionTime: executionTimeValue !== 'N/A' ? `${executionTimeValue}s` : 'N/A',
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const result = await exportWebSynthesisToSlides({
                synthesis_report: synthesisReport,
                entity_name: metadata.entityName
            });

            if (result.success && result.data?.download_url) {
                const link = document.createElement('a');
                link.href = result.data.download_url;
                link.download = result.data.filename || `${metadata.entityName}_Web_Synthesis.pptx`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toast.success('PPTX Exported Successfully!');
            } else {
                toast.error(result.error || 'Failed to export presentation');
            }
        } catch (e) {
            toast.error('An unexpected error occurred during export');
            console.error(e);
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportPDF = async () => {
        if (!synthesisReport) return;
        setIsExportingPDF(true);
        try {
            await exportToPDF(synthesisReport, `${metadata.entityName}_Web_Synthesis`, `Web Synthesis Report - ${metadata.entityName}`);
            toast.success("PDF exported successfully!");
        } catch (error) {
            toast.error("Failed to export PDF");
        } finally {
            setIsExportingPDF(false);
        }
    };

    const handleExportDocx = async () => {
        if (!synthesisReport) return;
        setIsExportingDocx(true);
        try {
            await exportToDocx(synthesisReport, `${metadata.entityName}_Web_Synthesis`, `Web Synthesis Report - ${metadata.entityName}`);
            toast.success("DOCX exported successfully!");
        } catch (error) {
            toast.error("Failed to export DOCX");
        } finally {
            setIsExportingDocx(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(synthesisReport);
        toast.success('Report copied to clipboard');
    };

    return (
        <div className="space-y-6 w-full max-w-full overflow-x-hidden animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        Web Synthesis Report
                        <Badge variant="outline" className="ml-2 font-mono text-xs">
                            {metadata.entityName.toUpperCase()}
                        </Badge>
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                        <ClockIcon className="w-3 h-3" />
                        <span>Generated on {metadata.timestamp}</span>
                        <span>•</span>
                        <span>Time: {metadata.executionTime}</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {onReRun && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onReRun}
                            disabled={isReRunning}
                            className="bg-background"
                        >
                            <RefreshCw className={cn("w-3.5 h-3.5 mr-2", isReRunning && "animate-spin")} />
                            {isReRunning ? "Synthesizing..." : "Re Run "}
                        </Button>
                    )}
                    
                    <Button 
                        variant="default" 
                        size="sm" 
                        onClick={handleExport} 
                        disabled={isExporting}
                    >
                        <Download className={cn("w-3.5 h-3.5 mr-2", isExporting && "animate-pulse")} />
                        {isExporting ? 'Exporting...' : 'Export PPTX'}
                    </Button>
                    <Button 
                        variant="outline"
                        size="sm" 
                        onClick={handleExportPDF}
                        disabled={isExportingPDF}
                    >
                        {isExportingPDF ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                        ) : (
                            <FileDown className="w-3.5 h-3.5 mr-2" />
                        )}
                        {isExportingPDF ? 'Processing...' : 'Download PDF'}
                    </Button>
                     {/* <Button 
                        variant="outline"
                        size="sm" 
                        onClick={handleExportDocx}
                        disabled={isExportingDocx}
                    >
                        {isExportingDocx ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                        ) : (
                            <FileType className="w-3.5 h-3.5 mr-2" />
                        )}
                        {isExportingDocx ? 'Processing...' : 'Download DOCX'}
                    </Button>  */}
                    <Button
                        variant="ghost"
                        onClick={handleCopy}
                        className="h-8 text-xs hover:bg-background"
                    >
                        <Copy/>
                        Copy 
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsFullScreen(true)}
                        className="h-8 w-8 hover:bg-background"
                        title="View Full Screen"
                    >
                        <Maximize2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Main Content Card */}
            <Card>
                <CardContent>
                    <ScrollArea className="h-[700px] w-full">
                        <div id={`web-synthesis-content-${metadata.taskId || 'preview'}`} className="p-4 ">
                            <MarkdownViewer content={synthesisReport} />
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Debug/Ref Details */}
            <div className="rounded-lg border bg-muted/20">
                <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-3 text-xs font-medium text-muted-foreground hover:bg-muted/40 transition-colors">
                        <div className="flex items-center gap-2">
                            <Terminal className="h-4 w-4" />
                            <span>Raw Data Object</span>
                        </div>
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded">JSON</span>
                    </summary>
                    <Separator />
                    <div className="bg-card p-4">
                        <ScrollArea className="h-[200px]">
                            <pre className="text-[10px] font-mono whitespace-pre-wrap break-all text-muted-foreground">
                                {JSON.stringify(data, null, 2)}
                            </pre>
                        </ScrollArea>
                    </div>
                </details>
            </div>

            {/* Full Screen Dialog */}
            <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
                <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] sm:max-w-[95vw] flex flex-col p-0">
                    <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
                        <div className="flex items-center justify-between w-full">
                            <DialogTitle className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                                Web Synthesis Report
                                <Badge variant="outline" className="ml-2 font-mono text-xs">
                                    {metadata.entityName.toUpperCase()} 
                                </Badge>
                            </DialogTitle>
                        </div>
                    </DialogHeader>
                    <ScrollArea className="h-full w-full">
                        <div className="max-w-7xl mx-auto min-h-full  p-8 pb-20">
                            <MarkdownViewer content={synthesisReport} />
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function ClockIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
