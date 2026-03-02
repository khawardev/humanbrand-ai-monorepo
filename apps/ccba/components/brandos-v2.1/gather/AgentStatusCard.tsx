import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ChevronDown, FileInput, FileOutput, Loader2, Play, RotateCw, AlertCircle } from "lucide-react";
import { MdOutlineArrowRight } from "react-icons/md";

interface AgentStatusCardProps {
    status: any;
    isComplete: boolean;
    hasData: boolean;
    onStart?: () => void;
    isStarting?: boolean;
}

export function AgentStatusCard({ status, isComplete, hasData, onStart, isStarting }: AgentStatusCardProps) {
    // isStarting includes both the transition state and polling state from parent
    const isRunning = isStarting || (status && status.total_running > 0);


    // Determine what to show in the status area
    const renderStatusBadge = () => {
        if (isRunning) {
            return (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    <Loader2 className="w-4 h-4  animate-spin" /> Collecting Data...
                </span>
            );
        }

        if (isComplete && hasData) {
            return (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Data Capturing Completed
                </span>
            );
        }

        if (hasData && !isComplete) {
            return (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                    <AlertCircle className="w-4 h-4 " /> Partial Data Available
                </span>
            );
        }

        // Idle state - show start button
        if (onStart) {
            return (
                <Button onClick={onStart} disabled={isStarting} size="sm" className="bg-primary hover:bg-primary/90 h-9">
                    {isStarting ? (
                        <><RotateCw className="w-4 h-4  animate-spin" /> Starting...</>
                    ) : (
                        <> Start Collection <MdOutlineArrowRight className="w-4 h-4 " /></>
                    )}
                </Button>
            );
        }

        return null;
    };

    return (
        <Collapsible defaultOpen={true} className="group bg-muted/20 p-4 rounded-xl border transition-all hover:bg-muted/30">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-0 h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground">
                                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </Button>
                        </CollapsibleTrigger>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg leading-none">Data Collection Swarm</span>
                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-mono bg-background/50">
                                    OI-SWARM
                                </Badge>
                            </div>
                            <span className="text-xs font-medium text-muted-foreground mt-1 block">
                                Autonomous multi-source capture agent for Web & Social
                            </span>
                        </div>
                    </div>
                    {renderStatusBadge()}
                </div>

                {isRunning && (
                    <div className="space-y-1.5 pl-9">
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Processing Batches...</span>
                            <span className="text-blue-500">Running</span>
                        </div>
                        <Progress value={undefined} className="h-2 w-full animate-pulse" />
                    </div>
                )}

                <CollapsibleContent className="pl-9 space-y-4 pt-2">
                    <div className="text-sm space-y-4 animate-in slide-in-from-top-2">
                        <p className="text-muted-foreground leading-relaxed">
                            Orchestrates web data capture and social media API extraction across multiple threads. Returns raw HTML, JSON, and unstructured text for downstream compilation.
                        </p>
                        <div className="grid grid-cols-1 gap-3 p-3 bg-background/50 rounded-lg border">
                            <div className="space-y-1.5">
                                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                    <FileInput className="w-3 h-3" /> Inputs
                                </span>
                                <div className="flex gap-2 flex-wrap">
                                    <Badge variant="secondary" className="font-mono text-[10px]">Brand URL</Badge>
                                    <Badge variant="secondary" className="font-mono text-[10px]">Competitor URLs</Badge>
                                    <Badge variant="secondary" className="font-mono text-[10px]">Social Handles</Badge>
                                </div>
                            </div>
                            <div className="space-y-1.5 pt-2 border-t">
                                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                                    <FileOutput className="w-3 h-3" /> Outputs
                                </span>
                                <div className="flex gap-2 flex-wrap">
                                    <Badge variant="secondary" className="font-mono text-[10px]">Raw Web Pages</Badge>
                                    <Badge variant="secondary" className="font-mono text-[10px]">Social Posts JSON</Badge>
                                    <Badge variant="secondary" className="font-mono text-[10px]">Media Assets</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </CollapsibleContent>
            </div>
        </Collapsible>
    )
}
