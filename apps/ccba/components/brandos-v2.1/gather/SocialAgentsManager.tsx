'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import {
    Trash2, Eye, ChevronDown, Loader2, Clock,
    FileText, AlertCircle, MessageSquare, Edit, Settings2
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { MdOutlineArrowRight } from 'react-icons/md';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    runSocialReportsAgent,
    getSocialReportsOutput,
    listSocialReportsTasks,
    deleteSocialReportsTask,
    type SocialChannelName,
    type AnalysisScope,
    type AnalysisPriority,
    type SocialReportsTaskListItem
} from '@/server/actions/socialReportsActions';
import { getScrapeBatchSocial } from '@/server/actions/ccba/social/socialScrapeActions';
import { SocialReportsResultViewer } from './SocialReportsResultViewer';
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
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type SocialAgentsManagerProps = {
    clientId: string;
    brandId: string;
    batchSocialTaskId: string | null;
    brandName?: string;
    availableChannels: string[];
    competitors?: Array<{
        id: string;
        name: string;
        linkedin_url?: string;
        facebook_url?: string;
        instagram_url?: string;
        x_url?: string;
        youtube_url?: string;
        tiktok_url?: string;
    }>;
}

const ANALYSIS_PRIORITY_OPTIONS: { value: AnalysisPriority; label: string }[] = [
    { value: 'balanced', label: 'Balanced' },
    { value: 'employer_brand', label: 'Employer Brand' },
    { value: 'product_marketing', label: 'Product Marketing' },
    { value: 'thought_leadership', label: 'Thought Leadership' },
    { value: 'community', label: 'Community' },
];

const REGION_OPTIONS = [
    'North America',
    'Europe',
    'Asia',
    'South America',
    'Africa',
    'Middle East',
    'Oceania',
];

const TASKS_CACHE: Record<string, SocialReportsTaskListItem[]> = {};

export function SocialAgentsManager({
    clientId,
    brandId,
    batchSocialTaskId,
    brandName = 'Brand',
    availableChannels = [],
    competitors = []
}: SocialAgentsManagerProps) {
    const [reportsTasks, setReportsTasks] = useState<SocialReportsTaskListItem[]>([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);
    const [isRunningReports, setIsRunningReports] = useState(false);
    const [reportsTaskId, setReportsTaskId] = useState<string | null>(null);
    const [selectedReportsResult, setSelectedReportsResult] = useState<any>(null);
    const [loadingResultId, setLoadingResultId] = useState<string | null>(null);
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
    const [analysisScope, setAnalysisScope] = useState<AnalysisScope>('brand');
    const [selectedChannel, setSelectedChannel] = useState<SocialChannelName>(
        (availableChannels[0] as SocialChannelName) || 'linkedin'
    );
    const [selectedCompetitorId, setSelectedCompetitorId] = useState<string | null>(null);
    const [customInstruction, setCustomInstruction] = useState('');
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    const [analysisPriority, setAnalysisPriority] = useState<AnalysisPriority>('balanced');
    const [priorityRegions, setPriorityRegions] = useState<string[]>([]);
    const [mandatedDriversInput, setMandatedDriversInput] = useState('');
    const [channelsWithPosts, setChannelsWithPosts] = useState<Record<string, boolean>>({});
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const getCompetitorChannels = (competitorId: string): string[] => {
        const competitor = competitors.find(c => String(c.id) === competitorId);
        if (!competitor) return [];

        const channels: string[] = [];
        if (competitor.linkedin_url) channels.push('linkedin');
        if (competitor.facebook_url) channels.push('facebook');
        if (competitor.instagram_url) channels.push('instagram');
        if (competitor.x_url) channels.push('x');
        if (competitor.youtube_url) channels.push('youtube');
        if (competitor.tiktok_url) channels.push('tiktok');

        return channels;
    };

    const currentAvailableChannels = useMemo(() => {
        if (analysisScope === 'brand') {
            return availableChannels;
        } else if (analysisScope === 'competitors') {
            return selectedCompetitorId ? getCompetitorChannels(selectedCompetitorId) : [];
        }
        return [];
    }, [analysisScope, selectedCompetitorId, availableChannels, competitors]);

    const loadReportsTasks = useCallback(async () => {
        setIsLoadingTasks(true);

        try {
            const res = await listSocialReportsTasks({ client_id: clientId, brand_id: brandId });
            if (res.success && res.data?.tasks) {
                // Sort by timestamp descending
                const sortedTasks = res.data.tasks.sort((a: SocialReportsTaskListItem, b: SocialReportsTaskListItem) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                );
                setReportsTasks(sortedTasks);
                TASKS_CACHE[brandId] = sortedTasks;
            }
        } catch (e) {
            console.error('Failed to load social reports tasks:', e);
        } finally {
            setIsLoadingTasks(false);
        }
    }, [clientId, brandId]);

    useEffect(() => {
        loadReportsTasks();
    }, [loadReportsTasks]);

    useEffect(() => {
        if (!batchSocialTaskId || !brandId) return;

        const fetchChannelsWithPosts = async () => {
            try {
                const socialData = await getScrapeBatchSocial(brandId, batchSocialTaskId);
                if (socialData) {
                    const brandPlatforms = socialData.brand?.social_platforms || socialData.social_platforms || [];
                    const postsMap: Record<string, boolean> = {};

                    brandPlatforms.forEach((platform: any) => {
                        const platformName = platform.platform?.toLowerCase();
                        if (platformName) {
                            postsMap[platformName] = platform.posts && Array.isArray(platform.posts) && platform.posts.length > 0;
                        }
                    });

                    setChannelsWithPosts(postsMap);
                }
            } catch (e) {
                console.error('Failed to fetch social data for channels:', e);
            }
        };

        fetchChannelsWithPosts();
    }, [brandId, batchSocialTaskId]);

    useEffect(() => {
        if (currentAvailableChannels.length > 0) {
            if (!currentAvailableChannels.includes(selectedChannel)) {
                setSelectedChannel(currentAvailableChannels[0] as SocialChannelName);
            }
        }
    }, [currentAvailableChannels, selectedChannel]);

    useEffect(() => {
        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
        };
    }, []);

    const toggleRegion = (region: string) => {
        setPriorityRegions(prev =>
            prev.includes(region)
                ? prev.filter(r => r !== region)
                : [...prev, region]
        );
    };

    const handleRunReports = async () => {
        if (!batchSocialTaskId) {
            toast.error('No social batch data available. Please run data collection first.');
            return;
        }

        if (analysisScope === 'competitors' && !selectedCompetitorId && competitors.length > 0) {
            toast.error('Please select a competitor for competitor analysis.');
            return;
        }

        if (currentAvailableChannels.length === 0) {
            toast.error('No social channels available for the selected entity.');
            return;
        }

        setIsRunningReports(true);
        // Do not clear the current result so the user can still view other reports
        // setSelectedReportsResult(null); 

        const entityName = analysisScope === 'brand'
            ? brandName
            : competitors.find(c => String(c.id) === selectedCompetitorId)?.name || 'Competitor';

        toast.info(`Starting Social Reports Agent for ${entityName} on ${selectedChannel}...`);

        try {
            const res = await runSocialReportsAgent({
                client_id: clientId,
                brand_id: brandId,
                batch_id: batchSocialTaskId,
                channel_name: selectedChannel,
                analysis_scope: analysisScope === 'competitors' ? undefined : analysisScope,
                competitor_id: analysisScope === 'competitors' ? (selectedCompetitorId || undefined) : undefined,
                priority_regions: priorityRegions.length > 0 ? priorityRegions : undefined,
                analysis_priority: analysisPriority !== 'balanced' ? analysisPriority : undefined,
                mandated_drivers: mandatedDriversInput.trim() || undefined,
                instruction: customInstruction || undefined,
            });

            if (res.success && res.data?.task_id) {
                setReportsTaskId(res.data.task_id);
                toast.success('Social Reports Agent completed! Polling for results...');
                pollReportsResult(res.data.task_id);
            } else {
                toast.error(`Social Reports Agent failed: ${res.error || 'Unknown error'}`);
                setIsRunningReports(false);
            }
        } catch (e) {
            console.error(e);
            toast.error('Error starting Social Reports Agent');
            setIsRunningReports(false);
        }
    };

    const resultRef = useRef<HTMLDivElement>(null);
    const isPollingRef = useRef(false);

    // ... (existing code)

    const pollReportsResult = (taskId: string) => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
        }

        isPollingRef.current = true;
        let attempts = 0;
        const maxAttempts = 120;

        pollIntervalRef.current = setInterval(async () => {
            // Safety check if polling was stopped externally
            if (!isPollingRef.current) {
                if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
                return;
            }

            attempts++;
            try {
                const res = await getSocialReportsOutput({
                    client_id: clientId,
                    brand_id: brandId,
                    task_id: taskId
                });

                if (res.success && res.data) {
                    isPollingRef.current = false;
                    if (pollIntervalRef.current) {
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = null;
                    }

                    setSelectedReportsResult(res.data);
                    toast.success('Social Reports complete!');
                    setIsRunningReports(false);
                    loadReportsTasks();

                    // Scroll to results
                    setTimeout(() => {
                        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                } else if (attempts >= maxAttempts) {
                    isPollingRef.current = false;
                    if (pollIntervalRef.current) {
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = null;
                    }

                    toast.error('Report generation timed out. Please check back later.');
                    setIsRunningReports(false);
                }
            } catch (e) {
                console.error('Polling reports error:', e);
            }
        }, 3000);
    };

    const handleViewReportsResult = async (taskId: string) => {
        setLoadingResultId(taskId);
        try {
            const res = await getSocialReportsOutput({
                client_id: clientId,
                brand_id: brandId,
                task_id: taskId
            });

            if (res.success && res.data) {
                setSelectedReportsResult(res.data);
                setReportsTaskId(taskId);
                toast.success('Report has been shown below !!', {
                    description: 'Scroll down to view.'
                });

                // Scroll to results
                setTimeout(() => {
                    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            } else {
                toast.error(`Failed to load result: ${res.error || 'Unknown error'}`);
            }
        } catch (e) {
            console.error(e);
            toast.error('Error loading report result');
        } finally {
            setLoadingResultId(null);
        }
    };

    const confirmDelete = (taskId: string) => {
        setTaskToDelete(taskId);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteTask = async () => {
        if (!taskToDelete) return;

        setDeletingTaskId(taskToDelete);
        try {
            const res = await deleteSocialReportsTask({
                client_id: clientId,
                brand_id: brandId,
                task_id: taskToDelete
            });

            if (res.success) {
                toast.success('Report task deleted');
                if (TASKS_CACHE[brandId]) {
                    TASKS_CACHE[brandId] = TASKS_CACHE[brandId].filter(t => t.task_id !== taskToDelete);
                }
                loadReportsTasks();
                if (selectedReportsResult?.task_id === taskToDelete) {
                    setSelectedReportsResult(null);
                }
            } else {
                toast.error(`Failed to delete: ${res.error || 'Unknown error'}`);
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

    const getChannelDisplayName = (channel: string) => {
        const channelNames: Record<string, string> = {
            facebook: 'Facebook',
            instagram: 'Instagram',
            linkedin: 'LinkedIn',
            x: 'X (Twitter)',
            youtube: 'YouTube',
            tiktok: 'TikTok'
        };
        return channelNames[channel] || channel;
    };

    return (
        <div className="space-y-8">
            <div className="grid lg:grid-cols-1 gap-6">
                <Card className="overflow-hidden pt-0">
                    <CardHeader className="bg-linear-to-r from-pink-500/10 to-purple-500/10 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-pink-500/20 p-2.5 rounded-full">
                                    <MessageSquare className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Social Reports Agent</CardTitle>
                                    <CardDescription>Generate comprehensive reports from social media data</CardDescription>
                                </div>
                            </div>
                            <Badge variant="outline" className="font-mono text-[10px]">SOC-REPORTS v3</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Select
                                        value={analysisScope}
                                        onValueChange={(value: AnalysisScope) => {
                                            setAnalysisScope(value);
                                            if (value === 'brand') setSelectedCompetitorId(null);
                                        }}
                                        disabled={isRunningReports}
                                    >
                                        <SelectTrigger className="w-[140px] h-9 bg-background capitalize">
                                            <SelectValue placeholder="Scope" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="brand">Brand</SelectItem>
                                            <SelectItem value="competitors">Competitors</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {analysisScope === 'competitors' && competitors.length > 0 && (
                                        <Select
                                            value={selectedCompetitorId || ''}
                                            onValueChange={(value) => setSelectedCompetitorId(value)}
                                            disabled={isRunningReports}
                                        >
                                            <SelectTrigger className="w-[180px] h-9 bg-background">
                                                <SelectValue placeholder="Select Competitor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {competitors.map((competitor) => (
                                                    <SelectItem key={competitor.id} value={String(competitor.id)}>
                                                        {competitor.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}

                                    <TooltipProvider>
                                        <Select
                                            value={selectedChannel}
                                            onValueChange={(value: SocialChannelName) => setSelectedChannel(value)}
                                            disabled={isRunningReports || currentAvailableChannels.length === 0}
                                        >
                                            <SelectTrigger className="w-[140px] h-9 bg-background capitalize">
                                                <div className="flex items-center gap-2">
                                                    {/* <ChannelIcon channel={selectedChannel} /> */}
                                                    <SelectValue placeholder="Channel" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {currentAvailableChannels.map((channel) => {
                                                    const hasNoPosts = channelsWithPosts[channel] === false;
                                                    return (
                                                        <SelectItem
                                                            key={channel}
                                                            value={channel}
                                                            disabled={hasNoPosts}
                                                            className="capitalize"
                                                        >
                                                            {getChannelDisplayName(channel)} {hasNoPosts && '(No Data)'}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </TooltipProvider>
                                    <Button
                                        onClick={handleRunReports}
                                        disabled={
                                            isRunningReports ||
                                            !batchSocialTaskId ||
                                            currentAvailableChannels.length === 0 ||
                                            (analysisScope === 'competitors' && competitors.length > 0 && !selectedCompetitorId)
                                        }

                                    >
                                        {isRunningReports ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                Generate Report
                                                <MdOutlineArrowRight className="h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={loadReportsTasks}
                                        disabled={isLoadingTasks}
                                    >
                                        <Loader2 className={cn("h-4 w-4", isLoadingTasks && "animate-spin")} />Refresh
                                    </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Popover open={showAdvancedSettings} onOpenChange={setShowAdvancedSettings}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" title="Advanced Settings">
                                                <Settings2 className="h-4 w-4" />
                                                <span className="hidden sm:inline">Advanced</span>
                                                {(priorityRegions.length > 0 || analysisPriority !== 'balanced' || mandatedDriversInput) && (
                                                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                                                        !
                                                    </Badge>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-96" align="end">
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-medium leading-none mb-3">Advanced Configuration</h4>
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        Configure Universal Module v3 parameters for enhanced analysis.
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Analysis Priority</Label>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="outline" className="w-full justify-between">
                                                                {ANALYSIS_PRIORITY_OPTIONS.find(o => o.value === analysisPriority)?.label || 'Balanced'}
                                                                <ChevronDown className="h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent className="w-full">
                                                            {ANALYSIS_PRIORITY_OPTIONS.map(option => (
                                                                <DropdownMenuItem
                                                                    key={option.value}
                                                                    onClick={() => setAnalysisPriority(option.value)}
                                                                >
                                                                    {option.label}
                                                                </DropdownMenuItem>
                                                            ))}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Priority Regions</Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {REGION_OPTIONS.map(region => (
                                                            <Badge
                                                                key={region}
                                                                variant={priorityRegions.includes(region) ? "default" : "outline"}
                                                                className="cursor-pointer transition-colors"
                                                                onClick={() => toggleRegion(region)}
                                                            >
                                                                {region}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    {priorityRegions.length > 0 && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 text-xs"
                                                            onClick={() => setPriorityRegions([])}
                                                        >
                                                            Clear All
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-sm font-medium">Mandated Drivers (JSON)</Label>
                                                    <Textarea
                                                        placeholder='[{"driver_name":"Sustainability","definition":"Environmental responsibility"}]'
                                                        value={mandatedDriversInput}
                                                        onChange={(e) => setMandatedDriversInput(e.target.value)}
                                                        className="h-20 resize-none font-mono text-xs"
                                                    />
                                                    <p className="text-[11px] text-muted-foreground">
                                                        Optional JSON array of mandated drivers for customized analysis.
                                                    </p>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" title="Custom Instructions">
                                                <Edit className="h-4 w-4" /> Add Instructions
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80">
                                            <div className="space-y-2">
                                                <h4 className="font-medium leading-none">Custom Instructions</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Add specific guidelines for the agent.
                                                </p>
                                                <Textarea
                                                    placeholder="e.g., Focus on engagement metrics..."
                                                    value={customInstruction}
                                                    onChange={(e) => setCustomInstruction(e.target.value)}
                                                    className="h-24 resize-none"
                                                />
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            {!batchSocialTaskId && (
                                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900/30">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>No social batch data available. Run data collection first.</span>
                                </div>
                            )}

                            {currentAvailableChannels.length === 0 && batchSocialTaskId && (
                                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900/30">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>No social channels with data available for the selected {analysisScope === 'brand' ? 'brand' : 'competitor'}.</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">Report Tasks</span>
                                    <Badge variant="secondary">{reportsTasks.length}</Badge>
                                </div>
                                <ScrollArea className="h-[320px] pt-4">
                                    {isLoadingTasks ? (
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
                                    ) : reportsTasks.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm p-14">
                                            <FileText className="h-10 w-10 mb-3 opacity-40" />
                                            <span className="font-medium">No report tasks yet</span>
                                            <span className="text-xs mt-1 opacity-70">Generate a report to see it here</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {reportsTasks.map((task) => (
                                                <div
                                                    key={task.task_id}
                                                    className={cn(
                                                        "group relative flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all duration-200 cursor-pointer ",
                                                        selectedReportsResult?.task_id === task.task_id && "border-primary/50 bg-primary/5"
                                                    )}
                                                    onClick={() => handleViewReportsResult(task.task_id)}
                                                >
                                                    <div className="shrink-0">
                                                        <div className={cn(
                                                            "w-10 h-10 rounded-lg flex items-center justify-center",
                                                            task.analysis_scope === 'brand'
                                                                ? "bg-primary/10 text-primary"
                                                                : "bg-secondary text-secondary-foreground"
                                                        )}>
                                                            <FileText className="h-5 w-5" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0 space-y-1.5">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-semibold text-sm truncate">
                                                                {task.entity_name || 'Report'}
                                                            </span>
                                                            <Badge
                                                                variant={task.analysis_scope === 'brand' ? 'default' : 'secondary'}
                                                                className="text-[10px] px-2 py-0.5 font-medium capitalize"
                                                            >
                                                                {task.analysis_scope || 'brand'}
                                                            </Badge>
                                                            {task.channel_name && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-[10px] px-2 py-0.5 font-medium capitalize"
                                                                >
                                                                    {getChannelDisplayName(task.channel_name)}
                                                                </Badge>
                                                            )}
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
                                                                handleViewReportsResult(task.task_id);
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
                                                                confirmDelete(task.task_id);
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



            {selectedReportsResult && (
                <div ref={resultRef}>
                    <Card className="border rounded-2xl p-6 bg-card">
                        <SocialReportsResultViewer
                            data={selectedReportsResult}
                            onReRun={handleRunReports}
                            isReRunning={isRunningReports}
                            clientId={clientId}
                            brandId={brandId}
                            channelName={selectedReportsResult.channel_name || selectedChannel}
                        />
                    </Card>
                </div>
            )}

            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this report task? This action cannot be undone and all associated data will be permanently removed.
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
