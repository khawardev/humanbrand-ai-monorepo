'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ChevronDown, Loader2, Play, AlertCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { MdOutlineArrowRight } from "react-icons/md";

interface AuditorAgentCardProps {
    title: string;
    description: string;
    icon: React.ElementType; // Icon component
    agentCode: string; // e.g. "OI-AUDITOR"
    status: 'idle' | 'running' | 'complete' | 'error';
    isRunning?: boolean;
    onRun: () => void;
    taskId?: string | null;
    result?: any;
    RenderResult?: React.ComponentType<{ data: any, onReRun?: () => void, isReRunning?: boolean, [key: string]: any }>;
    resultProps?: Record<string, any>; // Additional props to pass to RenderResult
    controls?: ReactNode; // Extra controls like Select
    isDisabled?: boolean;
    buttonLabel?: string;
    processingLabels?: {
        running: string;
        processing: string;
    }
}

export function AuditorAgentCard({
    title,
    description,
    icon: Icon,
    agentCode,
    status,
    isRunning,
    onRun,
    taskId,
    result,
    RenderResult,
    resultProps = {},
    controls,
    isDisabled,
    buttonLabel = "Run Analysis",
    processingLabels = { running: "Analyzing...", processing: "Agent is processing data..." }
}: AuditorAgentCardProps) {
    
    // Determine status badge
    const renderStatusBadge = () => {
        if (isRunning) {
            return (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> {processingLabels.running}
                </span>
            );
        }

        if (status === 'complete') {
            return (
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Done
                    </span>
                    {controls}
                    <Button 
                        onClick={onRun} 
                        disabled={isDisabled || isRunning} 
                        variant="outline"
                    >
                        Run Again 
                        {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <MdOutlineArrowRight className="w-3 h-3 mr-1" />}
                    </Button>
                </div>
            );
        }

        if (status === 'error') {
            return (
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                        <AlertCircle className="w-4 h-4 mr-2" /> Failed
                    </span>
                     <Button 
                        onClick={onRun} 
                        size="sm" 
                        variant="ghost"
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        Retry
                    </Button>
                </div>
            );
        }

        // Idle state with button (only if not result is present, or re-run allowed)
        return (
            <div className="flex items-center gap-2">
                {controls}
                <Button 
                    onClick={onRun} 
                    disabled={isDisabled || isRunning} 
                    size="sm" 
                    className={cn("h-9", isRunning ? "opacity-80" : "")}
                >
                    {isRunning ? (
                         <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {processingLabels.running}</>
                    ) : (
                            <>{buttonLabel}<MdOutlineArrowRight className="w-4 h-4" /></>
                    )}
                </Button>
            </div>
        );
    };

    return (
        <Collapsible defaultOpen={true} className="group bg-muted/20 p-4 rounded-3xl border transition-all hover:bg-muted/30">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex items-center gap-3">
                      <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-0 h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground">
                                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </Button>
                        </CollapsibleTrigger>
                        <div>
                            <div className="flex items-center gap-2">
                                <Icon className="w-5 h-5 text-primary" />
                                <span className="text-lg leading-none font-medium">{title}</span>
                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-mono bg-background/50">
                                    {agentCode}
                                </Badge>
                            </div>
                            <span className="text-xs font-medium text-muted-foreground mt-1 block">
                                {description}
                            </span>
                        </div>
                    </div>
                    
                    {/* Actions / Status Wrapper */}
                    <div className="flex items-center gap-2 ml-9 md:ml-0">
                         {renderStatusBadge()}
                    </div>
                </div>

                {/* Progress State */}
                {isRunning && (
                    <div className="space-y-1.5 pl-9">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{processingLabels.processing}</span>
                            <span className="text-blue-500 font-mono text-[10px]">{taskId}</span>
                        </div>
                        <Progress value={undefined} className="h-2 w-full animate-pulse" />
                    </div>
                )}

                {/* Result Content */}
                {result && RenderResult && (
                    <CollapsibleContent className="pl-0 md:pl-9 space-y-4 pt-2">
                         <div className="animate-in slide-in-from-top-2 fade-in duration-500">
                             {/* Pass re-run capability explicitly to the result viewer as well */}
                            <RenderResult 
                                data={result} 
                                onReRun={onRun}
                                isReRunning={isRunning}
                                {...resultProps}
                            />
                         </div>
                    </CollapsibleContent>
                )}
            </div>
        </Collapsible>
    );
}
