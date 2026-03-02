'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
    Play, Trash2, Eye, ChevronDown, Loader2, Clock, Cpu,
    FileText, RefreshCw, Search, Database, Sparkles, AlertCircle, Building2, Users, Edit
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { MdOutlineArrowRight } from 'react-icons/md';
import {
    runWebExtractionAgent,
    getWebExtractionOutput,
    listWebExtractionTasks,
    deleteWebExtractionTask,
    runWebSynthesisAgent,
    getWebSynthesisOutput,
    listWebSynthesisTasks,
    deleteWebSynthesisTask,
    type WebExtractionTask,
    type WebSynthesisTask
} from '@/server/actions/webAuditorActions';
import { WebExtractionResultViewer } from './WebExtractionResultViewer';
import { WebSynthesisResultViewer } from './WebSynthesisResultViewer';
import { Skeleton } from '@/components/ui/skeleton';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type WebAgentsManagerProps = {
    clientId: string;
    brandId: string;
    batchWebsiteTaskId: string | null;
    brandName?: string;
    competitors?: Array<{ id: string; name: string }>;
}

// Cache to store tasks by brandId to prevent reloading on tab switch
const EXTRACTION_TASKS_CACHE: Record<string, WebExtractionTask[]> = {};
const SYNTHESIS_TASKS_CACHE: Record<string, WebSynthesisTask[]> = {};

export function WebAgentsManager({
    clientId,
    brandId,
    batchWebsiteTaskId,
    brandName = 'Brand',
    competitors = []
}: WebAgentsManagerProps) {
    const [extractionTasks, setExtractionTasks] = useState<WebExtractionTask[]>([]);
    const [synthesisTasks, setSynthesisTasks] = useState<WebSynthesisTask[]>([]);
    const [isLoadingExtractionTasks, setIsLoadingExtractionTasks] = useState(true);
    const [isLoadingSynthesisTasks, setIsLoadingSynthesisTasks] = useState(true);
    const [isRunningExtraction, setIsRunningExtraction] = useState(false);
    const [isRunningSynthesis, setIsRunningSynthesis] = useState(false);
    const [extractionTaskId, setExtractionTaskId] = useState<string | null>(null);
    const [synthesisTaskId, setSynthesisTaskId] = useState<string | null>(null);
    const [selectedExtractionResult, setSelectedExtractionResult] = useState<any>(null);
    const [selectedSynthesisResult, setSelectedSynthesisResult] = useState<any>(null);
    const [loadingResultId, setLoadingResultId] = useState<string | null>(null);
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
    const [extractionScope, setExtractionScope] = useState<'brand' | 'competitors'>('brand');
    const [selectedCompetitorId, setSelectedCompetitorId] = useState<string | null>(null);
    const [selectedExtractionForSynthesis, setSelectedExtractionForSynthesis] = useState<string | null>(null);
    const [extractionInstruction, setExtractionInstruction] = useState('');
    const [synthesisInstruction, setSynthesisInstruction] = useState('');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<{ id: string; type: 'extraction' | 'synthesis' } | null>(null);
    const [activeResultTab, setActiveResultTab] = useState<'extraction' | 'synthesis'>('extraction');

    const loadExtractionTasks = useCallback(async () => {
        setIsLoadingExtractionTasks(true);
        try {
            const res = await listWebExtractionTasks({ client_id: clientId, brand_id: brandId });
            if (res.success && res.data?.tasks) {
                // Sort by timestamp descending
                const sortedTasks = res.data.tasks.sort((a: WebExtractionTask, b: WebExtractionTask) => 
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );
                setExtractionTasks(sortedTasks);
                // Update cache
                EXTRACTION_TASKS_CACHE[brandId] = sortedTasks;
            }
        } catch (e) {
            console.error('Failed to load extraction tasks:', e);
        } finally {
            setIsLoadingExtractionTasks(false);
        }
    }, [clientId, brandId]);

    const loadSynthesisTasks = useCallback(async () => {
        setIsLoadingSynthesisTasks(true);
        try {
            const res = await listWebSynthesisTasks({ client_id: clientId, brand_id: brandId });
            if (res.success && res.data?.tasks) {
                 // Sort by timestamp descending
                 const sortedTasks = res.data.tasks.sort((a: WebSynthesisTask, b: WebSynthesisTask) => 
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );
                setSynthesisTasks(sortedTasks);
                // Update cache
                SYNTHESIS_TASKS_CACHE[brandId] = sortedTasks;
            }
        } catch (e) {
            console.error('Failed to load synthesis tasks:', e);
        } finally {
            setIsLoadingSynthesisTasks(false);
        }
    }, [clientId, brandId]);

    useEffect(() => {
        loadExtractionTasks();
        loadSynthesisTasks();
    }, [loadExtractionTasks, loadSynthesisTasks]);

    const handleRunExtraction = async () => {
        if (!batchWebsiteTaskId) {
            toast.error('No website batch data available. Please run data collection first.');
            return;
        }

        if (extractionScope === 'competitors' && !selectedCompetitorId && competitors.length > 0) {
            toast.error('Please select a competitor for competitor analysis.');
            return;
        }

        setIsRunningExtraction(true);
        // Do not clear the current result so the user can still view other reports
        // setSelectedExtractionResult(null); 
        toast.info(`Starting Web Extraction for ${extractionScope}...`);

        try {
            const res = await runWebExtractionAgent({
                client_id: clientId,
                brand_id: brandId,
                batch_website_task_id: batchWebsiteTaskId,
                analysis_scope: extractionScope,
                competitor_id: extractionScope === 'competitors' ? (selectedCompetitorId || undefined) : undefined,
                instruction: extractionInstruction || undefined,
            });

            if (res.success && res.data?.task_id) {
                setExtractionTaskId(res.data.task_id);
                toast.success('Web Extraction completed! Polling for results...');
                pollExtractionResult(res.data.task_id);
            } else {
                toast.error(`Extraction failed: ${res.error || 'Unknown error'}`);
                setIsRunningExtraction(false);
            }
        } catch (e) {
            console.error(e);
            toast.error('Error starting Web Extraction');
            setIsRunningExtraction(false);
        }
    };

    const resultRef = useRef<HTMLDivElement>(null);
    const isPollingExtractionRef = useRef(false);
    const isPollingSynthesisRef = useRef(false);
    const extractionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const synthesisIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (extractionIntervalRef.current) clearInterval(extractionIntervalRef.current);
            if (synthesisIntervalRef.current) clearInterval(synthesisIntervalRef.current);
        };
    }, []);

    // ... (existing code not shown)

    const pollExtractionResult = async (taskId: string) => {
        // Clear any existing interval
        if (extractionIntervalRef.current) clearInterval(extractionIntervalRef.current);
        
        isPollingExtractionRef.current = true;
        let attempts = 0;
        const maxAttempts = 120;

        extractionIntervalRef.current = setInterval(async () => {
            if (!isPollingExtractionRef.current) {
                if (extractionIntervalRef.current) clearInterval(extractionIntervalRef.current);
                return;
            }
            
            attempts++;
            try {
                const res = await getWebExtractionOutput({
                    client_id: clientId,
                    brand_id: brandId,
                    task_id: taskId
                });

                // Check again if polling was stopped while awaiting
                if (!isPollingExtractionRef.current) return;

                if (res.success && res.data) {
                    isPollingExtractionRef.current = false;
                    if (extractionIntervalRef.current) clearInterval(extractionIntervalRef.current);

                    setSelectedExtractionResult(res.data);
                    toast.success('Web Extraction complete!');
                    setIsRunningExtraction(false);
                    loadExtractionTasks();
                    
                    // Auto-select for synthesis and switch tab
                    setSelectedExtractionForSynthesis(taskId);
                    setActiveResultTab('extraction');

                     // Scroll
                    setTimeout(() => {
                        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                } else if (attempts >= maxAttempts) {
                    isPollingExtractionRef.current = false;
                    if (extractionIntervalRef.current) clearInterval(extractionIntervalRef.current);
                    
                    toast.error('Extraction timed out. Please check back later.');
                    setIsRunningExtraction(false);
                }
            } catch (e) {
                console.error('Polling extraction error:', e);
            }
        }, 3000);
    };

    const handleRunSynthesis = async () => {
        if (!selectedExtractionForSynthesis) {
            toast.error('Please select an extraction task to synthesize.');
            return;
        }

        setIsRunningSynthesis(true);
        // Do not clear the current result so the user can still view other reports
        // setSelectedSynthesisResult(null); 
        
        const selectedTask = extractionTasks.find(t => t.task_id === selectedExtractionForSynthesis);
        const entityName = selectedTask?.entity_name || 'Selected Entity';

        toast.info(`Starting Web Synthesis for ${entityName}...`);

        try {
            const res = await runWebSynthesisAgent({
                client_id: clientId,
                brand_id: brandId,
                extraction_task_id: selectedExtractionForSynthesis,
                instruction: synthesisInstruction || undefined,
            });

            if (res.success && res.data?.task_id) {
                setSynthesisTaskId(res.data.task_id);
                toast.success('Web Synthesis completed! Polling for results...');
                pollSynthesisResult(res.data.task_id);
            } else {
                toast.error(`Synthesis failed: ${res.error || 'Unknown error'}`);
                setIsRunningSynthesis(false);
            }
        } catch (e) {
            console.error(e);
            toast.error('Error starting Web Synthesis');
            setIsRunningSynthesis(false);
        }
    };

    const pollSynthesisResult = async (taskId: string) => {
        // Clear any existing interval
        if (synthesisIntervalRef.current) clearInterval(synthesisIntervalRef.current);

        isPollingSynthesisRef.current = true;
        let attempts = 0;
        const maxAttempts = 120;

        synthesisIntervalRef.current = setInterval(async () => {
             if (!isPollingSynthesisRef.current) {
                if (synthesisIntervalRef.current) clearInterval(synthesisIntervalRef.current);
                return;
            }
            attempts++;
            try {
                const res = await getWebSynthesisOutput({
                    client_id: clientId,
                    brand_id: brandId,
                    task_id: taskId
                });

                // Check again if polling was stopped while awaiting
                if (!isPollingSynthesisRef.current) return;

                if (res.success && res.data) {
                    isPollingSynthesisRef.current = false;
                    if (synthesisIntervalRef.current) clearInterval(synthesisIntervalRef.current);

                    setSelectedSynthesisResult(res.data);
                    toast.success('Web Synthesis complete!');
                    setIsRunningSynthesis(false);
                    loadSynthesisTasks();
                    
                    // Scroll
                    setTimeout(() => {
                         resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                } else if (attempts >= maxAttempts) {
                    isPollingSynthesisRef.current = false;
                    if (synthesisIntervalRef.current) clearInterval(synthesisIntervalRef.current);

                    toast.error('Synthesis timed out. Please check back later.');
                    setIsRunningSynthesis(false);
                }
            } catch (e) {
                console.error('Polling synthesis error:', e);
            }
        }, 3000);
    };

    const handleViewExtractionResult = async (taskId: string) => {
        setLoadingResultId(taskId);
        try {
            const res = await getWebExtractionOutput({
                client_id: clientId,
                brand_id: brandId,
                task_id: taskId
            });

            if (res.success && res.data) {
                setSelectedExtractionResult(res.data);
                setActiveResultTab('extraction');
                toast.success('Report has been shown below !!', { description: 'Scroll down to view.' });
                 // Scroll
                setTimeout(() => {
                    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                toast.error(`Failed to load result: ${res.error || 'Unknown error'}`);
            }
        } catch (e) {
            console.error(e);
            toast.error('Error loading extraction result');
        } finally {
            setLoadingResultId(null);
        }
    };

    const handleViewSynthesisResult = async (taskId: string) => {
        setLoadingResultId(taskId);
        try {
            const res = await getWebSynthesisOutput({
                client_id: clientId,
                brand_id: brandId,
                task_id: taskId
            });

            if (res.success && res.data) {
                setSelectedSynthesisResult(res.data);
                setActiveResultTab('synthesis');
                toast.success('Report has been shown below !!', { description: 'Scroll down to view.' });
                 // Scroll
                setTimeout(() => {
                    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                toast.error(`Failed to load result: ${res.error || 'Unknown error'}`);
            }
        } catch (e) {
            console.error(e);
            toast.error('Error loading synthesis result');
        } finally {
            setLoadingResultId(null);
        }
    };

    const confirmDelete = (taskId: string, type: 'extraction' | 'synthesis') => {
        setTaskToDelete({ id: taskId, type });
        setDeleteConfirmOpen(true);
    };

    const handleDeleteTask = async () => {
        if (!taskToDelete) return;

        setDeletingTaskId(taskToDelete.id);
        try {
            let res;
            if (taskToDelete.type === 'extraction') {
                res = await deleteWebExtractionTask({
                    client_id: clientId,
                    brand_id: brandId,
                    task_id: taskToDelete.id
                });
                if (res.success) {
                    toast.success('Extraction task deleted');
                    // Update cache immediately
                    if (EXTRACTION_TASKS_CACHE[brandId]) {
                        EXTRACTION_TASKS_CACHE[brandId] = EXTRACTION_TASKS_CACHE[brandId].filter(t => t.task_id !== taskToDelete.id);
                    }
                    loadExtractionTasks();
                    if (selectedExtractionResult?.task_id === taskToDelete.id) {
                        setSelectedExtractionResult(null);
                    }
                }
            } else {
                res = await deleteWebSynthesisTask({
                    client_id: clientId,
                    brand_id: brandId,
                    task_id: taskToDelete.id
                });
                if (res.success) {
                    toast.success('Synthesis task deleted');
                    // Update cache immediately
                    if (SYNTHESIS_TASKS_CACHE[brandId]) {
                        SYNTHESIS_TASKS_CACHE[brandId] = SYNTHESIS_TASKS_CACHE[brandId].filter(t => t.task_id !== taskToDelete.id);
                    }
                    loadSynthesisTasks();
                    if (selectedSynthesisResult?.task_id === taskToDelete.id) {
                        setSelectedSynthesisResult(null);
                    }
                }
            }

            if (!res?.success) {
                toast.error(`Failed to delete: ${res?.error || 'Unknown error'}`);
            }
        } catch (e) {
            console.error(e);
            toast.error('Error deleting task');
        } finally {
            setDeletingTaskId(null);
            setDeleteConfirmOpen(false);
            setTaskToDelete(null);
        }
    };

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleString();
    };

    const formatExecutionTime = (seconds: number | string | undefined | null) => {
        if (seconds === undefined || seconds === null) return 'N/A';
        const numSeconds = typeof seconds === 'string' ? parseFloat(seconds) : seconds;
        if (isNaN(numSeconds)) return 'N/A';
        if (numSeconds < 60) return `${numSeconds.toFixed(1)}s`;
        return `${(numSeconds / 60).toFixed(1)}m`;
    };

    return (
        <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-6">
                <Card className="overflow-hidden pt-0">
                    <CardHeader className="bg-linear-to-r from-blue-500/10 to-cyan-500/10 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-500/20 p-2.5 rounded-full">
                                    <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Web Extraction Agent</CardTitle>
                                    <CardDescription>Extract structured data from website content</CardDescription>
                                </div>
                            </div>
                            <Badge variant="outline" className="font-mono text-[10px]">WEB-EXTRACT</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild disabled={isRunningExtraction}>
                                        <Button variant="outline" className="h-9 justify-between capitalize">
                                            {extractionScope}
                                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onSelect={() => { setExtractionScope('brand'); setSelectedCompetitorId(null); }}>Brand</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => setExtractionScope('competitors')}>Competitors</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {extractionScope === 'competitors' && competitors.length > 0 && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild disabled={isRunningExtraction}>
                                            <Button variant="outline" className="h-9 justify-between min-w-[140px]">
                                                {selectedCompetitorId
                                                    ? competitors.find(c => String(c.id) === selectedCompetitorId)?.name || 'Selected'
                                                    : <span className="text-muted-foreground">Select Competitor</span>
                                                }
                                                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-[180px]">
                                            {competitors.map((competitor) => (
                                                <DropdownMenuItem
                                                    key={competitor.id}
                                                    onSelect={() => setSelectedCompetitorId(String(competitor.id))}
                                                >
                                                    {competitor.name}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}



                                <Button
                                    onClick={handleRunExtraction}
                                    disabled={
                                        isRunningExtraction ||
                                        !batchWebsiteTaskId ||
                                        (extractionScope === 'competitors' && competitors.length > 0 && !selectedCompetitorId)
                                    }

                                >
                                    {isRunningExtraction ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Extracting...
                                        </>
                                    ) : (
                                        <>
                                            Run Extraction
                                            <MdOutlineArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={loadExtractionTasks}
                                    disabled={isLoadingExtractionTasks}
                                >
                                    <Loader2 className={cn("h-4 w-4", isLoadingExtractionTasks && "animate-spin")} />Refresh
                                </Button>
                            </div>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" title="Custom Instructions">
                                        <Edit className="h-4 w-4" />  Instructions
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Extraction Instructions</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Add guidelines for the scraper.
                                        </p>
                                        <Textarea
                                            placeholder="e.g., Focus on pricing tables..."
                                            value={extractionInstruction}
                                            onChange={(e) => setExtractionInstruction(e.target.value)}
                                            className="h-24 resize-none"
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {!batchWebsiteTaskId && (
                            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900/30">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>No website batch data available. Run data collection first.</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground font-medium">Extraction Tasks</span>
                                <Badge variant="secondary">{extractionTasks.length}</Badge>
                            </div>
                            <ScrollArea className="h-[320px] pt-4">
                                {isLoadingExtractionTasks ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border bg-card">
                                                <div className="shrink-0">
                                                    <Skeleton className="w-10 h-10 rounded-lg" />
                                                </div>
                                                <div className="flex-1 min-w-0 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Skeleton className="h-5 w-28" />
                                                        <Skeleton className="h-5 w-16 rounded-full" />
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Skeleton className="h-4 w-36" />
                                                        <Skeleton className="h-4 w-16 rounded-full" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-9 w-20 rounded-md" />
                                                    <Skeleton className="h-9 w-9 rounded-md" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : extractionTasks.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm p-14">
                                        <Database className="h-10 w-10 mb-3 opacity-40" />
                                        <span className="font-medium">No extraction tasks yet</span>
                                        <span className="text-xs mt-1 opacity-70">Run an extraction to see it here</span>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {extractionTasks.map((task) => (
                                            <div
                                                key={task.task_id}
                                                className={cn(
                                                    "group relative flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50  hover:border-primary/30 transition-all duration-200 cursor-pointer ",
                                                    selectedExtractionResult?.task_id === task.task_id && "border-primary/50 bg-primary/5"
                                                )}
                                                onClick={() => handleViewExtractionResult(task.task_id)}
                                            >
                                                <div className="shrink-0">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-lg flex items-center justify-center",
                                                        task.analysis_scope === 'brand'
                                                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                                            : "bg-secondary text-secondary-foreground"
                                                    )}>
                                                        <Database className="h-5 w-5" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0 space-y-1.5">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-semibold text-sm truncate">
                                                            {task.entity_name || 'Extraction'}
                                                        </span>
                                                        <Badge
                                                            variant={task.analysis_scope === 'brand' ? 'default' : 'secondary'}
                                                            className="text-[10px] px-2 py-0.5 font-medium capitalize"
                                                        >
                                                            {task.analysis_scope || 'brand'}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1.5">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            {formatDate(task.timestamp)}
                                                        </span>
                                                       
                                                    </div>

                                                </div>
                                                <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-9 px-3 gap-1.5"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewExtractionResult(task.task_id);
                                                        }}
                                                        disabled={loadingResultId === task.task_id}
                                                    >
                                                        {loadingResultId === task.task_id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Eye className="h-4 w-4" />
                                                                <span className="hidden sm:inline">View</span>
                                                            </>
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-9 px-3 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            confirmDelete(task.task_id, 'extraction');
                                                        }}
                                                        disabled={deletingTaskId === task.task_id}
                                                    >
                                                        {deletingTaskId === task.task_id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden pt-0">
                    <CardHeader className="bg-linear-to-r from-purple-500/10 to-pink-500/10 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-500/20 p-2.5 rounded-full">
                                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Web Synthesis Agent</CardTitle>
                                    <CardDescription>Generate comprehensive analysis reports</CardDescription>
                                </div>
                            </div>
                            <Badge variant="outline" className="font-mono text-[10px]">WEB-SYNTH</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild disabled={isRunningSynthesis || extractionTasks.length === 0}>
                                        <Button variant="outline" className="h-9 justify-between min-w-[200px]">
                                            {selectedExtractionForSynthesis ? (
                                                <div className="flex items-center gap-2 truncate">
                                                    <span className="truncate text-xs font-medium">
                                                        {extractionTasks.find(t => t.task_id === selectedExtractionForSynthesis)?.entity_name || 'Selected Task'}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">Select Extraction Task</span>
                                            )}
                                            <ChevronDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[250px]">
                                        {extractionTasks.length === 0 ? (
                                            <div className="p-2 text-xs text-muted-foreground text-center">
                                                No extraction tasks available
                                            </div>
                                        ) : (
                                            extractionTasks.map((task) => (
                                                <DropdownMenuItem
                                                    key={task.task_id}
                                                    onSelect={() => setSelectedExtractionForSynthesis(task.task_id)}
                                                >
                                                    <div className="flex flex-col gap-0.5 w-full">
                                                        <div className="flex items-center justify-between gap-2 w-full">
                                                            <span className="truncate font-medium">{task.entity_name}</span>
                                                            <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">{task.analysis_scope}</Badge>
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground">{formatDate(task.timestamp)}</span>
                                                    </div>
                                                </DropdownMenuItem>
                                            ))
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>


                                <Button
                                    onClick={handleRunSynthesis}
                                    disabled={isRunningSynthesis || !selectedExtractionForSynthesis}

                                >
                                    {isRunningSynthesis ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Synthesizing...
                                        </>
                                    ) : (
                                        <>
                                            Run Synthesis
                                            <MdOutlineArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={loadSynthesisTasks}
                                    disabled={isLoadingSynthesisTasks}
                                >
                                    <Loader2 className={cn("h-4 w-4", isLoadingSynthesisTasks && "animate-spin")} />Refresh
                                </Button>

                            </div>


                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" title="Custom Instructions">
                                        <Edit className="h-4 w-4" />  Instructions
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">Synthesis Instructions</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Add guidelines for the analysis.
                                        </p>
                                        <Textarea
                                            placeholder="e.g., Summarize key findings..."
                                            value={synthesisInstruction}
                                            onChange={(e) => setSynthesisInstruction(e.target.value)}
                                            className="h-24 resize-none"
                                        />
                                    </div>
                                </PopoverContent>
                            </Popover>

                        </div>

                        {extractionTasks.length === 0 && (
                            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900/30">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                <span>Run an extraction task first before synthesis.</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground font-medium">Synthesis Tasks</span>
                                <Badge variant="secondary">{synthesisTasks.length}</Badge>
                            </div>
                            <ScrollArea className="h-[320px] pt-4">
                                {isLoadingSynthesisTasks ? (
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl border bg-card">
                                                <div className="shrink-0">
                                                    <Skeleton className="w-10 h-10 rounded-lg" />
                                                </div>
                                                <div className="flex-1 min-w-0 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Skeleton className="h-5 w-28" />
                                                        <Skeleton className="h-5 w-16 rounded-full" />
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Skeleton className="h-4 w-36" />
                                                        <Skeleton className="h-4 w-16 rounded-full" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-9 w-20 rounded-md" />
                                                    <Skeleton className="h-9 w-9 rounded-md" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : synthesisTasks.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm p-14">
                                        <Sparkles className="h-10 w-10 mb-3 opacity-40" />
                                        <span className="font-medium">No synthesis tasks yet</span>
                                        <span className="text-xs mt-1 opacity-70">Run a synthesis to see it here</span>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {synthesisTasks.map((task) => (
                                            <div
                                                key={task.task_id}
                                                className={cn(
                                                    "group relative flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all duration-200 cursor-pointer ",
                                                    selectedSynthesisResult?.task_id === task.task_id && " border-primary/50 bg-primary/5"
                                                )}
                                                onClick={() => handleViewSynthesisResult(task.task_id)}
                                            >
                                                <div className="shrink-0">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-lg flex items-center justify-center",
                                                        task.analysis_scope === 'brand'
                                                            ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                                            : "bg-secondary text-secondary-foreground"
                                                    )}>
                                                        <Sparkles className="h-5 w-5" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0 space-y-1.5">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-semibold text-sm truncate">
                                                            {task.entity_name || 'Synthesis'}
                                                        </span>
                                                        <Badge
                                                            variant={task.analysis_scope === 'brand' ? 'default' : 'secondary'}
                                                            className="text-[10px] px-2 py-0.5 font-medium capitalize"
                                                        >
                                                            {task.analysis_scope || 'brand'}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1.5">
                                                            <Clock className="h-3.5 w-3.5" />
                                                            {formatDate(task.timestamp)}
                                                        </span>
                                                       
                                                    </div>

                                                </div>
                                                <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-9 px-3 gap-1.5"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleViewSynthesisResult(task.task_id);
                                                        }}
                                                        disabled={loadingResultId === task.task_id}
                                                    >
                                                        {loadingResultId === task.task_id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Eye className="h-4 w-4" />
                                                                <span className="hidden sm:inline">View</span>
                                                            </>
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-9 px-3 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            confirmDelete(task.task_id, 'synthesis');
                                                        }}
                                                        disabled={deletingTaskId === task.task_id}
                                                    >
                                                        {deletingTaskId === task.task_id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>
            </div>



            {(selectedExtractionResult || selectedSynthesisResult) && (
                <Tabs
                    value={activeResultTab}
                    onValueChange={(value) => setActiveResultTab(value as 'extraction' | 'synthesis')}
                >
                    <TabsList>
                        <TabsTrigger
                            value="extraction"

                            disabled={!selectedExtractionResult}
                        >
                            <Database className="w-4 h-4" />
                            Extraction Result
                            {!selectedExtractionResult && (
                                <Badge variant="outline" className="text-[9px] py-0 ml-1">No Data</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger
                            value="synthesis"

                            disabled={!selectedSynthesisResult}
                        >
                            <Sparkles className="w-4 h-4" />
                            Synthesis Result
                            {!selectedSynthesisResult && (
                                <Badge variant="outline" className="text-[9px] py-0 ml-1">No Data</Badge>
                            )}
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="extraction" className="border rounded-xl p-6 bg-card">
                        {selectedExtractionResult && (
                            <WebExtractionResultViewer
                                data={selectedExtractionResult}
                                onReRun={handleRunExtraction}
                                isReRunning={isRunningExtraction}
                            />
                        )}
                    </TabsContent>
                    <TabsContent value="synthesis" className="border rounded-xl p-6 bg-card">
                        {selectedSynthesisResult && (
                            <WebSynthesisResultViewer
                                data={selectedSynthesisResult}
                                onReRun={handleRunSynthesis}
                                isReRunning={isRunningSynthesis}
                            />
                        )}
                    </TabsContent>
                </Tabs>
            )}

            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this {taskToDelete?.type} task? This action cannot be undone and all associated data will be permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
