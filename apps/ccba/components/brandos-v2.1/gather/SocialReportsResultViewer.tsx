'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    Terminal, Clock, FileText, Calendar, Bot,
    Copy, CheckCircle2, Loader2, Trash2, RefreshCw, 
    Presentation, Globe, Settings2, MapPin, ChevronDown,
    Maximize2, Minimize2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MarkdownViewer } from "@/components/shared/MarkdownViewer";
import { toast } from "sonner";
import { exportToGoogleSlides } from "@/server/actions/googleSlidesActions";
import type { UniversalConfig } from "@/server/actions/socialReportsActions";
import { exportToPDF, exportToDocx } from '@/lib/brandos-v2.1/exportUtils';
import { FileDown, FileType } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type SocialReportsResultViewerProps = {
    data: any;
    onReRun?: () => void;
    isReRunning?: boolean;
    clientId?: string;
    brandId?: string;
    channelName?: string;
}

const CHANNEL_DISPLAY_NAMES: Record<string, string> = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    x: 'X (Twitter)',
    youtube: 'YouTube',
    tiktok: 'TikTok'
};

export function SocialReportsResultViewer({ 
    data, 
    onReRun, 
    isReRunning,
    clientId,
    brandId,
    channelName = 'linkedin'
}: SocialReportsResultViewerProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [isExportingPDF, setIsExportingPDF] = useState(false);
    const [isExportingDocx, setIsExportingDocx] = useState(false);
    const [showUniversalConfig, setShowUniversalConfig] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    if (!data) return null;

    const {
        social_report,
        entity_name,
        analysis_scope,
        channel_name: responseChannelName,
        universal_config,
        batch_id,
        model_used,
        timestamp,
        execution_time_seconds,
        task_id
    } = data;

    const displayChannelName = responseChannelName || channelName;

    const handleCopyReport = () => {
        if (social_report) {
            navigator.clipboard.writeText(social_report);
            toast.success("Report copied to clipboard");
        }
    };

    const handleExportToSlides = async () => {
        if (!social_report) {
            toast.error("No report content to export");
            return;
        }

        setIsExporting(true);
        try {
            const result = await exportToGoogleSlides({
                social_report: social_report,
                entity_name: entity_name || 'Social Report',
                channel_name: displayChannelName
            });

            if (result.success && result.data?.download_url) {
                const link = document.createElement('a');
                link.href = result.data.download_url;
                link.download = result.data.filename || 'Social_Report.pptx';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                toast.success("PowerPoint presentation downloaded successfully!");
            } else {
                toast.error(result.error || "Failed to export presentation");
            }
        } catch (error: any) {
            console.error('Export error:', error);
            toast.error(error?.message || "An error occurred while exporting");
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportPDF = async () => {
        if (!social_report) return;
        setIsExportingPDF(true);
        try {
            await exportToPDF(social_report, `${entity_name || 'Social'}_Report`, `Social Media Report - ${entity_name}`);
            toast.success("PDF exported successfully!");
        } catch (error) {
            toast.error("Failed to export PDF");
        } finally {
            setIsExportingPDF(false);
        }
    };

    const handleExportDocx = async () => {
        if (!social_report) return;
        setIsExportingDocx(true);
        try {
            await exportToDocx(social_report, `${entity_name || 'Social'}_Report`, `Social Media Report - ${entity_name}`);
            toast.success("DOCX exported successfully!");
        } catch (error) {
            toast.error("Failed to export DOCX");
        } finally {
            setIsExportingDocx(false);
        }
    };

    const formatExecutionTime = (seconds: number | string) => {
        const numSeconds = Number(seconds);
        if (!numSeconds || isNaN(numSeconds)) return 'N/A';
        if (numSeconds < 60) return `${numSeconds.toFixed(1)}s`;
        const minutes = Math.floor(numSeconds / 60);
        const remainingSeconds = numSeconds % 60;
        return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
    };

    const renderUniversalConfig = (config: UniversalConfig) => {
        if (!config) return null;

        return (
            <div className="space-y-3 text-sm">
                {config.client_name && (
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground min-w-[120px]">Client:</span>
                        <span className="font-medium">{config.client_name}</span>
                    </div>
                )}
                {config.channel_account_name && (
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground min-w-[120px]">Account:</span>
                        <span className="font-medium">{config.channel_account_name}</span>
                    </div>
                )}
                {config.analysis_window && (
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground min-w-[120px]">Analysis Window:</span>
                        <span className="font-medium">{config.analysis_window}</span>
                    </div>
                )}
                {config.priority_regions && config.priority_regions.length > 0 && (
                    <div className="flex items-start gap-2">
                        <span className="text-muted-foreground min-w-[120px]">Priority Regions:</span>
                        <div className="flex flex-wrap gap-1">
                            {config.priority_regions.map((region, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {region}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
                {config.mandated_drivers && config.mandated_drivers.length > 0 && (
                    <div className="space-y-2">
                        <span className="text-muted-foreground">Mandated Drivers:</span>
                        <div className="grid gap-2 ml-4">
                            {config.mandated_drivers.map((driver, idx) => (
                                <div key={idx} className="bg-muted/50 p-2 rounded-md">
                                    <div className="font-medium text-xs">{driver.driver_name}</div>
                                    <div className="text-xs text-muted-foreground">{driver.definition}</div>
                                    {driver.include_keywords && driver.include_keywords.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {driver.include_keywords.map((kw, i) => (
                                                <Badge key={i} variant="outline" className="text-[10px] text-green-600">
                                                    +{kw}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    {driver.exclude_keywords && driver.exclude_keywords.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {driver.exclude_keywords.map((kw, i) => (
                                                <Badge key={i} variant="outline" className="text-[10px] text-red-600">
                                                    -{kw}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 w-full max-w-full overflow-x-hidden">
            <Card className="border-l-4 border-l-primary">
                <CardHeader>
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Social Report
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <span>Analysis for:</span>
                                    <Badge variant="outline" className="capitalize">
                                        {entity_name || 'Unknown Entity'}
                                    </Badge>
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                {displayChannelName && (
                                    <Badge variant="secondary" className="capitalize">
                                        <Globe className="w-3 h-3 mr-1" />
                                        {CHANNEL_DISPLAY_NAMES[displayChannelName] || displayChannelName}
                                    </Badge>
                                )}
                                <Badge>
                                    {analysis_scope || 'brand'}
                                </Badge>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsFullScreen(true)}
                                    className="h-8 w-8 hover:bg-muted ml-2"
                                    title="View Full Screen"
                                >
                                    <Maximize2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-wrap  justify-between items-center gap-3 text-xs text-muted-foreground pt-2">
                            <div className="flex flex-wrap  items-center gap-3 text-xs text-muted-foreground pt-2">
                                <span className="flex items-center gap-1.5">
                                    <Bot className="w-3.5 h-3.5" />
                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                        {model_used || 'Claude 4.5 Sonnet'}
                                    </span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {formatExecutionTime(execution_time_seconds)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {timestamp ? new Date(timestamp).toLocaleDateString() : 'N/A'}
                                </span>
                                {batch_id && (
                                    <span className="flex items-center gap-1.5">
                                        <code className="font-mono text-muted-foreground bg-background px-1.5 py-0.5 rounded border">
                                            Batch: {batch_id.substring(0, 8)}...
                                        </code>
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap  items-center gap-3 text-xs text-muted-foreground pt-2">
                          
                                {onReRun && (
                                    <Button variant="outline" size="sm" onClick={onReRun} disabled={isReRunning}>
                                        {isReRunning ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <RefreshCw className="w-3.5 h-3.5" />
                                        )}
                                        Re Run
                                    </Button>
                                )}
                               
                                <Button 
                                    size="sm" 
                                    onClick={handleExportToSlides}
                                    disabled={isExporting}
                                >
                                    {isExporting ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Presentation className="w-3.5 h-3.5" />
                                    )}
                                    Export PPTX
                                </Button>
                                <Button 
                                    variant="outline"
                                    size="sm" 
                                    onClick={handleExportPDF}
                                    disabled={isExportingPDF}
                                >
                                    {isExportingPDF ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <FileDown className="w-3.5 h-3.5" />
                                    )}
                                    Download PDF
                                </Button>
                                 {/* <Button 
                                    variant="outline"
                                    size="sm" 
                                    onClick={handleExportDocx}
                                    disabled={isExportingDocx}
                                >
                                    {isExportingDocx ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <FileType className="w-3.5 h-3.5" />
                                    )}
                                    Download DOCX
                                </Button>  */}
                                <Button variant="outline" size="sm" onClick={handleCopyReport}>
                                    <Copy className="w-3.5 h-3.5" />
                                    Copy Report
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {universal_config && (
                <Collapsible open={showUniversalConfig} onOpenChange={setShowUniversalConfig}>
                    <Card className="border-dashed">
                            <CardHeader >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="font-medium">Universal Module Configuration</CardTitle>
                                        <Badge variant="outline" >v3</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                {renderUniversalConfig(universal_config)}
                            </CardContent>
                    </Card>
                </Collapsible>
            )}

            <Card >
                <CardHeader>
                    <CardTitle className=" flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Generated Social Report
                    </CardTitle>
                </CardHeader>
                <CardContent >
                    <ScrollArea className="h-[600px] w-full">
                        {social_report ? (
                            <div id={`social-report-content-${task_id || 'preview'}`} className="p-4">
                                <MarkdownViewer content={social_report} />
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No report content available.</p>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
         
            <div className="mt-8 pt-4">
                <details className="group">
                    <summary className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors w-fit p-2 rounded-md hover:bg-muted/50">
                        <Terminal className="h-4 w-4" />
                        <span className="font-medium">View Raw JSON</span>
                    </summary>
                    <div className="mt-2 bg-muted/50 rounded-lg overflow-hidden border">
                        <ScrollArea className="h-[300px] w-full">
                            <div className="p-4">
                                <pre className="text-[10px] font-mono whitespace-pre-wrap break-all text-muted-foreground">
                                    {JSON.stringify(data, null, 2)}
                                </pre>
                            </div>
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
                                <FileText className="w-5 h-5 text-primary" />
                                Social Report
                                <Badge variant="outline" className="ml-2 font-mono text-xs">
                                    {entity_name ? entity_name.toUpperCase() : 'UNKNOWN'} 
                                </Badge>
                            </DialogTitle>
                           
                        </div>
                    </DialogHeader>
                        <ScrollArea className="h-full w-full">
                            <div className="max-w-7xl mx-auto min-h-full  p-8 pb-20">
                                {social_report ? (
                                    <MarkdownViewer content={social_report} />
                                ) : (
                                    <p className="text-muted-foreground">No report content available.</p>
                                )}
                            </div>
                        </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}

type SocialReportsTaskListViewerProps = {
    tasks: any[];
    onSelectTask: (taskId: string) => void;
    onDeleteTask: (taskId: string) => void;
    selectedTaskId?: string | null;
    isDeleting?: boolean;
    deletingTaskId?: string | null;
}

export function SocialReportsTaskListViewer({
    tasks,
    onSelectTask,
    onDeleteTask,
    selectedTaskId,
    isDeleting,
    deletingTaskId
}: SocialReportsTaskListViewerProps) {
    if (!tasks || tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/5 border-dashed">
                <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No Reports Yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                    Run the Social Reports Agent to generate comprehensive reports from your social media data.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">
                    Previous Reports ({tasks.length})
                </h4>
            </div>
            <div className="grid gap-2">
                {tasks.map((task) => (
                    <div
                        key={task.task_id}
                        className={cn(
                            "flex items-center justify-between p-3 rounded-lg border bg-card cursor-pointer transition-all hover:bg-muted/30",
                            selectedTaskId === task.task_id && "border bg-primary/5"
                        )}
                        onClick={() => onSelectTask(task.task_id)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-md">
                                <FileText className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">
                                        {task.entity_name || 'Unknown Entity'}
                                    </span>
                                    <Badge variant="outline" className="text-[10px] h-5 capitalize">
                                        {task.analysis_scope || 'brand'}
                                    </Badge>
                                    {task.channel_name && (
                                        <Badge variant="secondary" className="text-[10px] h-5 capitalize">
                                            {CHANNEL_DISPLAY_NAMES[task.channel_name] || task.channel_name}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {task.timestamp ? new Date(task.timestamp).toLocaleDateString() : 'N/A'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {task.execution_time_seconds ? `${Number(task.execution_time_seconds).toFixed(1)}s` : 'N/A'}
                                    </span>
                                    {task.scraped_urls_count !== undefined && (
                                        <span className="flex items-center gap-1">
                                            <FileText className="w-3 h-3" />
                                            {task.scraped_urls_count} URLs
                                        </span>
                                    )}
                                    {task.model_used && (
                                        <span className="flex items-center gap-1">
                                            <Bot className="w-3 h-3" />
                                            {task.model_used}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {selectedTaskId === task.task_id && (
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteTask(task.task_id);
                                }}
                                disabled={isDeleting && deletingTaskId === task.task_id}
                            >
                                {isDeleting && deletingTaskId === task.task_id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
