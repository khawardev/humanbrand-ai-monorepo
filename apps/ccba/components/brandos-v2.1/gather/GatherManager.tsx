'use client';

import { useEffect, useState, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Copy, Terminal, RefreshCw, Bot, Play, Loader2, CheckCircle2, AlertCircle, LayoutGrid, ChevronDown, FileText } from 'lucide-react';

import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AgentStatusCard } from './AgentStatusCard';
import { AuditorAgentCard } from './AuditorAgentCard';
import { SimpleWebsiteScrapViewer, SimpleSocialScrapViewer } from './ResultsViewers';
import { AuditorResultViewer } from './AuditorResultViewer';
import { SocialAuditorResultViewer } from './SocialAuditorResultViewer';
import { SocialReportsResultViewer, SocialReportsTaskListViewer } from './SocialReportsResultViewer';
import BrandProfile from "@/components/stages/ccba/details/profile-tab/BrandProfile";
import { getCcbaTaskStatus } from '@/server/actions/ccba/statusActions';
import { scrapeBatchWebsite } from '@/server/actions/ccba/website/websiteScrapeActions';
import { scrapeBatchSocial } from '@/server/actions/ccba/social/socialScrapeActions';
import { getBatchWebsiteScrapeStatus } from '@/server/actions/ccba/website/websiteStatusAction';
import { getBatchSocialScrapeStatus } from '@/server/actions/ccba/social/socialStatusAction';
import { runAuditorAgent, getAuditorOutput, runSocialAuditorAgent, getSocialAuditorOutput } from '@/server/actions/auditorActions';
import {
    runSocialReportsAgent,
    getSocialReportsOutput,
    listSocialReportsTasks,
    deleteSocialReportsTask,
    type SocialChannelName,
    type AnalysisScope
} from '@/server/actions/socialReportsActions';
import { setGatherCookies } from '@/server/actions/cookieActions';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Spinner } from '@/components/shared/SpinnerLoader';
import { MdOutlineArrowRight } from "react-icons/md";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GatherManagerProps {
    brandId: string;
    initialStatus: any;
    brandData: any;
    websiteData: any;
    socialData: any;
    websiteBatchStatus?: string | null;
    socialBatchStatus?: string | null;
    websiteBatchId?: string | null;
    socialBatchId?: string | null;
    webLimit: number;
    startDate: string;
    endDate: string;
    triggerScrape?: boolean;
}


export function GatherManager({
    brandId,
    initialStatus,
    brandData,
    websiteData,
    socialData,
    websiteBatchStatus,
    socialBatchStatus,
    websiteBatchId,
    socialBatchId,
    webLimit,
    startDate,
    endDate,
    triggerScrape
}: GatherManagerProps) {
    const router = useRouter();
    const [status, setStatus] = useState(initialStatus);
    const [activeTab, setActiveTab] = useState("brand_profile");
    const [isStarting, startTransition] = useTransition();
    const [isPolling, setIsPolling] = useState(false);
    const [pollingMessage, setPollingMessage] = useState<string>("");

    useEffect(() => {
        if (brandId) {
            setGatherCookies({
                brandId,
                startDate,
                endDate,
                webLimit: webLimit.toString()
            }).catch(console.error);
        }
    }, [brandId, startDate, endDate, webLimit]);

    const [hasAutoTriggered, setHasAutoTriggered] = useState(false);
    useEffect(() => {
        if (triggerScrape && !hasAutoTriggered && !isStarting && !isPolling) {
            if (status && status.total_running > 0) {
                console.log("Skipping auto-trigger because tasks are already running.");
                setHasAutoTriggered(true);
                setIsPolling(true);
                return;
            }

            console.log("Auto-triggering scrape from URL param...");
            setHasAutoTriggered(true);
            handleStartCollection();
        }
    }, [triggerScrape, hasAutoTriggered]); // eslint-disable-line react-hooks/exhaustive-deps

    const [currentWebBatchId, setCurrentWebBatchId] = useState<string | null>(websiteBatchId || null);
    const [currentSocialBatchId, setCurrentSocialBatchId] = useState<string | null>(socialBatchId || null);
    const [webBatchStatus, setWebBatchStatus] = useState<string | null>(websiteBatchStatus || null);
    const [socBatchStatus, setSocBatchStatus] = useState<string | null>(socialBatchStatus || null);

    useEffect(() => {
        if (websiteBatchStatus) setWebBatchStatus(websiteBatchStatus);
        if (socialBatchStatus) setSocBatchStatus(socialBatchStatus);
        if (websiteBatchId) setCurrentWebBatchId(websiteBatchId);
        if (socialBatchId) setCurrentSocialBatchId(socialBatchId);
    }, [websiteBatchStatus, socialBatchStatus, websiteBatchId, socialBatchId]);

    const [auditorTaskId, setAuditorTaskId] = useState<string | null>(null);
    const [auditorResult, setAuditorResult] = useState<any>(null);
    const [isAuditorRunning, setIsAuditorRunning] = useState(false);
    const [websiteAuditScope, setWebsiteAuditScope] = useState<string>("both");
    const [websiteAuditModel, setWebsiteAuditModel] = useState<string>("claude-4.5-sonnet");

    const [socialAuditorTaskId, setSocialAuditorTaskId] = useState<string | null>(null);
    const [socialAuditorResult, setSocialAuditorResult] = useState<any>(null);
    const [isSocialAuditorRunning, setIsSocialAuditorRunning] = useState(false);
    const [selectedChannel, setSelectedChannel] = useState<string>("linkedin");
    const [socialAuditScope, setSocialAuditScope] = useState<string>("brand");

    const [socialReportsTaskId, setSocialReportsTaskId] = useState<string | null>(null);
    const [socialReportsResult, setSocialReportsResult] = useState<any>(null);
    const [isSocialReportsRunning, setIsSocialReportsRunning] = useState(false);
    const [socialReportsChannel, setSocialReportsChannel] = useState<SocialChannelName>("linkedin");
    const [socialReportsScope, setSocialReportsScope] = useState<AnalysisScope>("brand");
    const [socialReportsInstruction, setSocialReportsInstruction] = useState<string>("");
    const [socialReportsCompetitorId, setSocialReportsCompetitorId] = useState<string>("");
    const [socialReportsTasks, setSocialReportsTasks] = useState<any[]>([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    const [isDeletingTask, setIsDeletingTask] = useState(false);
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

    const hasResults = !!(websiteData || socialData);
    const isWebComplete = webBatchStatus === 'Completed' || webBatchStatus === 'CompletedWithErrors';
    const isSocialComplete = socBatchStatus === 'Completed' || socBatchStatus === 'CompletedWithErrors';
    const isComplete = hasResults && isWebComplete && isSocialComplete;
    const isRunning = (status && status.total_running > 0) || isPolling;

    const availableChannels:any = (() => {
        if (!socialData) return [];
        let channels: string[] = [];

        if (Array.isArray(socialData)) {
            channels = socialData.map((item: any) => item.platform || item.network || item.channel || item.source).filter(Boolean);
        }
        else if (socialData.posts && Array.isArray(socialData.posts)) {
            channels = socialData.posts.map((item: any) => item.platform || item.network || item.channel || item.source).filter(Boolean);
        }
        else if (socialData.social_platforms && Array.isArray(socialData.social_platforms)) {
            channels = socialData.social_platforms.map((p: any) => p.name || p.network || p.platform);
        }
        else if (socialData.brand?.social_platforms && Array.isArray(socialData.brand.social_platforms)) {
            channels = socialData.brand.social_platforms.map((p: any) => p.name || p.network || p.platform);
        }
        else if (Array.isArray(socialData.social_platforms)) {
            channels = socialData.social_platforms.map((p: any) => p.name || p.network || p.platform);
        }
        else if (typeof socialData === 'object') {
            const knownPlatforms = ['linkedin', 'facebook', 'instagram', 'x', 'twitter', 'youtube', 'tiktok'];
            channels = Object.keys(socialData).filter(key => knownPlatforms.includes(key.toLowerCase()));
        }

        const unique = Array.from(new Set(channels.filter(Boolean).map(c => c.toLowerCase())));

        if (unique.length === 0 && (Array.isArray(socialData) ? socialData.length > 0 : Object.keys(socialData).length > 0)) {
            if (JSON.stringify(socialData).toLowerCase().includes('linkedin')) return ['linkedin'];
            return ['linkedin'];
        }

        return unique;
    })();

    const competitors = brandData?.competitors || [];

    useEffect(() => {
        if (availableChannels.length > 0 && !availableChannels.includes(selectedChannel)) {
            setSelectedChannel(availableChannels[0]);
        }
        if (availableChannels.length > 0 && !availableChannels.includes(socialReportsChannel)) {
            setSocialReportsChannel(availableChannels[0] as SocialChannelName);
        }
    }, [availableChannels, selectedChannel, socialReportsChannel]);

    useEffect(() => {
        if (currentSocialBatchId && brandData?.client_id) {
            loadSocialReportsTasks();
        }
    }, [currentSocialBatchId, brandData?.client_id]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadSocialReportsTasks = async () => {
        if (!brandData?.client_id) return;
        setIsLoadingTasks(true);
        try {
            const res = await listSocialReportsTasks({
                client_id: brandData.client_id,
                brand_id: brandId,
            });
            if (res.success && res.data?.tasks) {
                setSocialReportsTasks(res.data.tasks);
            }
        } catch (e) {
            console.error("Failed to load social reports tasks", e);
        } finally {
            setIsLoadingTasks(false);
        }
    };

    const handleRunAuditor = async () => {
        if (!currentWebBatchId) {
            toast.error("No website data found. Please run data collection first.");
            return;
        }
        setIsAuditorRunning(true);
        toast.info(`Starting Website Auditor analysis (${websiteAuditScope})...`);
        try {
            const res = await runAuditorAgent({
                client_id: brandData.client_id,
                brand_id: brandId,
                batch_id: currentWebBatchId,
                analysis_scope: websiteAuditScope as any,
                model_name: websiteAuditModel
            });

            if (res.success && res.data?.task_id) {
                setAuditorTaskId(res.data.task_id);
                toast.success("Auditor Agent started! Analyzing content...");
                pollAuditorResult(res.data.task_id);
            } else {
                toast.error(`Auditor failed to start: ${res.error || 'Unknown error'}`);
                setIsAuditorRunning(false);
            }
        } catch (e) {
            console.error(e);
            toast.error("Error starting Auditor Agent");
            setIsAuditorRunning(false);
        }
    };

    const pollAuditorResult = async (taskId: string) => {
        let attempts = 0;
        const maxAttempts = 60;

        const interval = setInterval(async () => {
            attempts++;
            try {
                const res = await getAuditorOutput({
                    client_id: brandData.client_id,
                    brand_id: brandId,
                    task_id: taskId
                });

                if (res.success && res.data) {
                    setAuditorResult(res.data);
                    toast.success("Auditor analysis complete!");
                    setIsAuditorRunning(false);
                    clearInterval(interval);
                } else if (attempts >= maxAttempts) {
                    toast.error("Auditor analysis timed out. Please try fetching later.");
                    setIsAuditorRunning(false);
                    clearInterval(interval);
                }
            } catch (e) {
                console.error("Polling auditor error", e);
            }
        }, 3000);
    };

    const handleRunSocialAuditor = async () => {
        if (!currentSocialBatchId) {
            toast.error("No social data found. Please run data collection first.");
            return;
        }
        setIsSocialAuditorRunning(true);
        setSocialAuditorResult(null);
        toast.info(`Starting Social Auditor Analysis for ${selectedChannel} (${socialAuditScope})...`);

        try {
            const res = await runSocialAuditorAgent({
                client_id: brandData.client_id,
                brand_id: brandId,
                batch_id: currentSocialBatchId,
                channel_name: selectedChannel as any,
                analysis_scope: socialAuditScope as any
            });

            if (res.success && res.data?.task_id) {
                setSocialAuditorTaskId(res.data.task_id);
                toast.success(`Social Auditor started for ${selectedChannel}!`);
                pollSocialAuditorResult(res.data.task_id);
            } else {
                toast.error(`Social Auditor failed: ${res.error || 'Unknown error'}`);
                setIsSocialAuditorRunning(false);
            }
        } catch (e) {
            console.error(e);
            toast.error("Error starting Social Auditor");
            setIsSocialAuditorRunning(false);
        }
    };

    const pollSocialAuditorResult = async (taskId: string) => {
        let attempts = 0;
        const maxAttempts = 60;

        const interval = setInterval(async () => {
            attempts++;
            try {
                const res = await getSocialAuditorOutput({
                    client_id: brandData.client_id,
                    brand_id: brandId,
                    task_id: taskId
                });

                if (res.success && res.data) {
                    setSocialAuditorResult(res.data);
                    toast.success("Social analysis complete!");
                    setIsSocialAuditorRunning(false);
                    clearInterval(interval);
                } else if (attempts >= maxAttempts) {
                    toast.error("Social analysis timed out.");
                    setIsSocialAuditorRunning(false);
                    clearInterval(interval);
                }
            } catch (e) {
                console.error("Polling social auditor error", e);
            }
        }, 3000);
    };

    const handleRunSocialReports = async () => {
        if (!currentSocialBatchId) {
            toast.error("No social data found. Please run data collection first.");
            return;
        }

        if (socialReportsScope === 'competitors' && !socialReportsCompetitorId) {
            toast.error("Please select a competitor for competitor analysis.");
            return;
        }

        setIsSocialReportsRunning(true);
        setSocialReportsResult(null);
        toast.info(`Starting Social Reports Agent for ${socialReportsChannel} (${socialReportsScope})...`);

        try {
            const res = await runSocialReportsAgent({
                client_id: brandData.client_id,
                brand_id: brandId,
                batch_id: currentSocialBatchId,
                channel_name: socialReportsChannel,
                analysis_scope: socialReportsScope,
                competitor_id: socialReportsScope === 'competitors' ? socialReportsCompetitorId : undefined,
                instruction: socialReportsInstruction || undefined
            });

            if (res.success && res.data?.task_id) {
                setSocialReportsTaskId(res.data.task_id);
                toast.success(`Social Reports Agent started for ${socialReportsChannel}!`);
                pollSocialReportsResult(res.data.task_id);
            } else {
                toast.error(`Social Reports Agent failed: ${res.error || 'Unknown error'}`);
                setIsSocialReportsRunning(false);
            }
        } catch (e) {
            console.error(e);
            toast.error("Error starting Social Reports Agent");
            setIsSocialReportsRunning(false);
        }
    };

    const pollSocialReportsResult = async (taskId: string) => {
        let attempts = 0;
        const maxAttempts = 120;

        const interval = setInterval(async () => {
            attempts++;
            try {
                const res = await getSocialReportsOutput({
                    client_id: brandData.client_id,
                    brand_id: brandId,
                    task_id: taskId
                });

                if (res.success && res.data) {
                    setSocialReportsResult(res.data);
                    toast.success("Social report generated successfully!");
                    setIsSocialReportsRunning(false);
                    clearInterval(interval);
                    loadSocialReportsTasks();
                } else if (attempts >= maxAttempts) {
                    toast.error("Social report generation timed out.");
                    setIsSocialReportsRunning(false);
                    clearInterval(interval);
                }
            } catch (e) {
                console.error("Polling social reports error", e);
            }
        }, 3000);
    };

    const handleSelectSocialReportTask = async (taskId: string) => {
        setSocialReportsTaskId(taskId);
        setIsSocialReportsRunning(true);
        try {
            const res = await getSocialReportsOutput({
                client_id: brandData.client_id,
                brand_id: brandId,
                task_id: taskId
            });
            if (res.success && res.data) {
                setSocialReportsResult(res.data);
            } else {
                toast.error("Failed to load report");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error loading report");
        } finally {
            setIsSocialReportsRunning(false);
        }
    };

    const handleDeleteSocialReportTask = async (taskId: string) => {
        if (!confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
            return;
        }
        setIsDeletingTask(true);
        setDeletingTaskId(taskId);
        try {
            const res = await deleteSocialReportsTask({
                client_id: brandData.client_id,
                brand_id: brandId,
                task_id: taskId
            });
            if (res.success) {
                toast.success("Report deleted successfully");
                if (socialReportsTaskId === taskId) {
                    setSocialReportsTaskId(null);
                    setSocialReportsResult(null);
                }
                loadSocialReportsTasks();
            } else {
                toast.error(`Failed to delete report: ${res.error || 'Unknown error'}`);
            }
        } catch (e) {
            console.error(e);
            toast.error("Error deleting report");
        } finally {
            setIsDeletingTask(false);
            setDeletingTaskId(null);
        }
    };

    const checkBatchStatuses = useCallback(async () => {
        let webStatus = null;
        let socialStatus = null;

        if (currentWebBatchId) {
            webStatus = await getBatchWebsiteScrapeStatus(brandId, currentWebBatchId);
            if (webStatus?.status) setWebBatchStatus(webStatus.status);
        }
        if (currentSocialBatchId) {
            socialStatus = await getBatchSocialScrapeStatus(brandId, currentSocialBatchId);
            if (socialStatus?.status) setSocBatchStatus(socialStatus.status);
        }

        const taskStatus = await getCcbaTaskStatus(brandId);
        setStatus(taskStatus);

        return { webStatus, socialStatus, taskStatus };
    }, [brandId, currentWebBatchId, currentSocialBatchId]);

    useEffect(() => {
        if (!isPolling) return;
        let pollCount = 0;
        const maxPolls = 36;

        const interval = setInterval(async () => {
            pollCount++;
            setPollingMessage(`Checking status... (${pollCount})`);
            try {
                const { webStatus, socialStatus, taskStatus } = await checkBatchStatuses();

                const webDone = webStatus?.status === 'Completed' || webStatus?.status === 'CompletedWithErrors' || webStatus?.status === 'Failed';
                const socialDone = socialStatus?.status === 'Completed' || socialStatus?.status === 'CompletedWithErrors' || socialStatus?.status === 'Failed';
                const tasksRunning = taskStatus?.total_running > 0;

                if ((webDone || !currentWebBatchId) && (socialDone || !currentSocialBatchId) && !tasksRunning) {
                    toast.success("Data collection completed!");
                    setPollingMessage("");
                    clearInterval(interval);
                    setIsPolling(false);
                    startTransition(() => {
                        router.refresh();
                    });
                    return;
                }

                let msgParts = [];
                if (webStatus?.progress) msgParts.push(`Web: ${webStatus.progress.completed}/${webStatus.progress.total_urls}`);
                if (socialStatus?.status) msgParts.push(`Social: ${socialStatus.status}`);

                setPollingMessage(msgParts.length > 0 ? msgParts.join(" | ") : "Processing...");

            } catch (e) {
                console.error("[GatherManager] Polling error:", e);
            }
            if (pollCount >= maxPolls) {
                setIsPolling(false);
                setPollingMessage("");
                clearInterval(interval);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [isPolling, checkBatchStatuses, router, currentWebBatchId, currentSocialBatchId]);

    const handleStartCollection = () => {
        startTransition(async () => {
            if (!startDate) {
                toast.error("Start Date is required.");
                return;
            }
            toast.info("Initializing Data Collection Swarm...");
            setWebBatchStatus("Initializing");
            setSocBatchStatus("Initializing");

            try {
                const webResult = await scrapeBatchWebsite(brandId, webLimit);
                if (!webResult?.success) {
                    toast.error(`Website capture failed: ${webResult?.message}`);
                    return;
                }
                if (webResult.data?.task_id) setCurrentWebBatchId(webResult.data.task_id);

                const socialResult = await scrapeBatchSocial(brandId, startDate, endDate);
                if (!socialResult?.success) {
                    toast.error(`Social capture failed: ${socialResult?.message}`);
                    return;
                }

                const sBatchId = socialResult.data?.task_id || socialResult.data?.batch_id;
                if (sBatchId) {
                    setCurrentSocialBatchId(sBatchId);
                    console.log("Social Batch ID set to:", sBatchId);
                } else {
                    console.warn("No Social Batch ID returned", socialResult);
                }

                toast.success("Swarm agents deployed.");
                setIsPolling(true);
            } catch (e) {
                console.error(e);
                toast.error("Trigger error");
            }
        });
    };

    const handleScrapeWebsite = () => {
        startTransition(async () => {
            setWebBatchStatus("Initializing");
            toast.info("Starting Website Collection...");
            try {
                const webResult = await scrapeBatchWebsite(brandId, webLimit);
                if (!webResult?.success) {
                    toast.error(`Website capture failed: ${webResult?.message}`);
                    setWebBatchStatus("Failed");
                    return;
                }
                if (webResult.data?.task_id) {
                    setCurrentWebBatchId(webResult.data.task_id);
                    toast.success("Website agent deployed.");
                    setIsPolling(true);
                }
            } catch (e) {
                console.error(e);
                toast.error("Error starting website collection");
                setWebBatchStatus("Failed");
            }
        });
    };

    const handleScrapeSocial = () => {
        startTransition(async () => {
            if (!startDate) {
                toast.error("Start Date is required.");
                return;
            }
            setSocBatchStatus("Initializing");
            toast.info("Starting Social Collection...");
            try {
                const socialResult = await scrapeBatchSocial(brandId, startDate, endDate);
                if (!socialResult?.success) {
                    toast.error(`Social capture failed: ${socialResult?.message}`);
                    setSocBatchStatus("Failed");
                    return;
                }

                const sBatchId = socialResult.data?.task_id || socialResult.data?.batch_id;
                if (sBatchId) {
                    setCurrentSocialBatchId(sBatchId);
                    toast.success("Social agent deployed.");
                    setIsPolling(true);
                } else {
                    toast.error("Failed to get batch ID for social scan");
                }
            } catch (e) {
                console.error(e);
                toast.error("Error starting social collection");
                setSocBatchStatus("Failed");
            }
        });
    };

    return (
        <div className="space-y-8 w-full pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-medium tracking-tight">Data Collection Agent</h3>
                    <p className="text-muted-foreground">Real-time status of the multi-source data collection swarm and auditors.</p>
                    {pollingMessage && <p className="text-sm text-blue-500 mt-1">{pollingMessage}</p>}
                </div>
                <Button variant="outline" asChild>
                    <Link href="/dashboard/brandos-v2.1/gather">
                        <LayoutGrid className="w-4 h-4" />
                        Switch Brand
                    </Link>
                </Button>
            </div>

            <div className="space-y-4">
                <AgentStatusCard
                    status={status}
                    isComplete={isComplete}
                    hasData={hasResults}
                    onStart={handleStartCollection}
                    isStarting={isStarting || isPolling}
                />
            </div>

            {brandData && (
                <div className="space-y-6 pt-8 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-medium tracking-tight">Intelligence Hub</h3>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList>
                            <TabsTrigger value="brand_profile">Brand Profile</TabsTrigger>
                            <TabsTrigger value="captured_data">
                                Captured Data
                                {!hasResults && <span className="ml-2 text-xs text-muted-foreground"><Spinner /></span>}
                            </TabsTrigger>
                            <TabsTrigger value="ai_audit" disabled={!isComplete}>
                                <Bot className="w-4 h-4" />
                                Outside-in Audit
                            </TabsTrigger>
                            <TabsTrigger value="social_reports" disabled={!isSocialComplete}>
                                <FileText className="w-4 h-4" />
                                Social Reports
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="brand_profile" className="space-y-6">
                            <BrandProfile brand={brandData} isScrapped={true} />
                        </TabsContent>

                        <TabsContent value="captured_data" className="space-y-6">
                            <Tabs defaultValue="website" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="website">
                                        Website Data
                                        {websiteBatchStatus && websiteBatchStatus !== 'Completed' && (
                                            <span className="ml-2 text-xs"><Loader2 className="w-3 h-3 animate-spin" /> ({websiteBatchStatus})</span>
                                        )}
                                    </TabsTrigger>
                                    <TabsTrigger value="social">
                                        Social Media Data
                                        {socialBatchStatus && socialBatchStatus !== 'Completed' && (
                                            <span className="ml-2 text-xs"><Loader2 className="w-3 h-3 animate-spin" /> ({socialBatchStatus})</span>
                                        )}
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="website" className="pt-6">
                                    {!websiteData ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/5 border-dashed">
                                            <Globe className="w-12 h-12 text-muted-foreground/50 mb-4" />
                                            <h3 className="text-lg font-medium">No Website Data</h3>
                                            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                                                Collect website data to analyze brand messaging and content structure.
                                            </p>
                                            <Button onClick={handleScrapeWebsite} disabled={isPolling || isStarting}>
                                                {isPolling && webBatchStatus === 'Initializing' ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <MdOutlineArrowRight className="w-4 h-4" />
                                                )}
                                                Run Website Collection
                                            </Button>
                                        </div>
                                    ) : (
                                        <SimpleWebsiteScrapViewer scrapsData={websiteData} brandName={brandData.name} status={websiteBatchStatus} />
                                    )}
                                </TabsContent>
                                <TabsContent value="social" className="pt-6">
                                    {!socialData ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-muted/5 border-dashed">
                                            <Fingerprint className="w-12 h-12 text-muted-foreground/50 mb-4" />
                                            <h3 className="text-lg font-medium">No Social Data</h3>
                                            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                                                Collect social media data to analyze audience engagement and sentiment.
                                            </p>
                                            <Button onClick={handleScrapeSocial} disabled={isPolling || isStarting}>
                                                {isPolling && socBatchStatus === 'Initializing' ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <MdOutlineArrowRight className="w-4 h-4" />
                                                )}
                                                Run Social Collection
                                            </Button>
                                        </div>
                                    ) : (
                                        <SimpleSocialScrapViewer scrapsData={socialData} brandName={brandData.name} brandData={brandData} status={socialBatchStatus} />
                                    )}
                                </TabsContent>
                            </Tabs>
                        </TabsContent>

                        <TabsContent value="ai_audit" className="space-y-8 pt-4">
                            <div className="flex flex-col gap-8">
                                <AuditorAgentCard
                                    title="Website Auditor"
                                    description="Analyze captured website content for verbal bedrock."
                                    icon={Globe}
                                    agentCode="OI-WEB-AUDIT"
                                    status={isAuditorRunning ? 'running' : auditorResult ? 'complete' : 'idle'}
                                    isRunning={isAuditorRunning}
                                    onRun={handleRunAuditor}
                                    taskId={auditorTaskId}
                                    result={auditorResult}
                                    RenderResult={AuditorResultViewer}
                                    isDisabled={!currentWebBatchId}
                                    buttonLabel="Run Website Audit"
                                    controls={
                                        <div className="flex items-center gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild disabled={isAuditorRunning}>
                                                    <Button variant="outline" className="w-[180px] h-9 justify-between bg-background font-normal">
                                                        {websiteAuditModel === 'claude-4.5-sonnet' ? 'Claude 4.5 Sonnet' :
                                                            websiteAuditModel === 'claude-3-5-sonnet' ? 'Claude 3.5 Sonnet' :
                                                                'Claude 3 Haiku'}
                                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-[180px]">
                                                    <DropdownMenuItem onClick={() => setWebsiteAuditModel('claude-4.5-sonnet')}>Claude 4.5 Sonnet</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setWebsiteAuditModel('claude-3-5-sonnet')}>Claude 3.5 Sonnet</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setWebsiteAuditModel('claude-3-haiku')}>Claude 3 Haiku</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild disabled={isAuditorRunning}>
                                                    <Button variant="outline" className="w-[140px] h-9 justify-between bg-background font-normal">
                                                        {websiteAuditScope === 'brand' ? 'Brand Only' :
                                                            websiteAuditScope === 'competitors' ? 'Competitors Only' :
                                                                'Brand & Competitors'}
                                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-[140px]">
                                                    <DropdownMenuItem onClick={() => setWebsiteAuditScope('brand')}>Brand Only</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setWebsiteAuditScope('competitors')}>Competitors Only</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setWebsiteAuditScope('both')}>Brand & Competitors</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    }
                                />

                                <AuditorAgentCard
                                    title="Social Auditor"
                                    description="Extract emergent attributes from social channels."
                                    icon={Fingerprint}
                                    agentCode="OI-SOC-AUDIT"
                                    status={isSocialAuditorRunning ? 'running' : socialAuditorResult ? 'complete' : 'idle'}
                                    isRunning={isSocialAuditorRunning}
                                    onRun={handleRunSocialAuditor}
                                    taskId={socialAuditorTaskId}
                                    result={socialAuditorResult}
                                    RenderResult={SocialAuditorResultViewer}
                                    isDisabled={!currentSocialBatchId || !availableChannels.length}
                                    buttonLabel="Run  Analysis"
                                    controls={
                                        <div className="flex items-center gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild disabled={isSocialAuditorRunning || !availableChannels.length}>
                                                    <Button variant="outline" className="w-[140px] h-9 justify-between bg-background capitalize font-normal">
                                                        {selectedChannel || "Channel"}
                                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-[140px]">
                                                    {availableChannels.length > 0 ? (
                                                        availableChannels.map((channel: any) => (
                                                            <DropdownMenuItem key={channel} onClick={() => setSelectedChannel(channel)} className="capitalize">
                                                                {channel}
                                                            </DropdownMenuItem>
                                                        ))
                                                    ) : (
                                                        <DropdownMenuItem disabled>No Data Available</DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild disabled={isSocialAuditorRunning}>
                                                    <Button variant="outline" className="w-[160px] h-9 justify-between bg-background font-normal">
                                                        {socialAuditScope === 'brand' ? 'Brand Only' :
                                                            socialAuditScope === 'competitors' ? 'Competitors Only' :
                                                                'Brand & Competitors'}
                                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-[160px]">
                                                    <DropdownMenuItem onClick={() => setSocialAuditScope('brand')}>Brand Only</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setSocialAuditScope('competitors')}>Competitors Only</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setSocialAuditScope('both')}>Brand & Competitors</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    }
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="social_reports" className="space-y-8 pt-4">
                            <div className="flex flex-col gap-8">
                                <AuditorAgentCard
                                    title="Social Reports Agent"
                                    description="Generate comprehensive reports from social media batch data with AI-powered analysis."
                                    icon={FileText}
                                    agentCode="OI-SOC-REPORTS"
                                    status={isSocialReportsRunning ? 'running' : socialReportsResult ? 'complete' : 'idle'}
                                    isRunning={isSocialReportsRunning}
                                    onRun={handleRunSocialReports}
                                    taskId={socialReportsTaskId}
                                    result={socialReportsResult}
                                    RenderResult={SocialReportsResultViewer}
                                    resultProps={{
                                        clientId: brandData?.client_id,
                                        brandId: brandId,
                                        channelName: socialReportsChannel
                                    }}
                                    isDisabled={!currentSocialBatchId || !availableChannels.length}
                                    buttonLabel="Generate Report"
                                    processingLabels={{
                                        running: "Generating Report...",
                                        processing: "AI agent is analyzing social data and generating report..."
                                    }}
                                    controls={
                                        <div className="flex flex-wrap items-center gap-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild disabled={isSocialReportsRunning || !availableChannels.length}>
                                                    <Button variant="outline" className="w-[140px] h-9 justify-between bg-background capitalize font-normal">
                                                        {socialReportsChannel || "Channel"}
                                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-[140px]">
                                                    {availableChannels.length > 0 ? (
                                                        availableChannels.map((channel: any) => (
                                                            <DropdownMenuItem
                                                                key={channel}
                                                                onClick={() => setSocialReportsChannel(channel as SocialChannelName)}
                                                                className="capitalize"
                                                            >
                                                                {channel}
                                                            </DropdownMenuItem>
                                                        ))
                                                    ) : (
                                                        <DropdownMenuItem disabled>No Data Available</DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild disabled={isSocialReportsRunning}>
                                                    <Button variant="outline" className="w-[140px] h-9 justify-between bg-background font-normal">
                                                        {socialReportsScope === 'brand' ? 'Brand' : 'Competitors'}
                                                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-[140px]">
                                                    <DropdownMenuItem onClick={() => setSocialReportsScope('brand')}>Brand</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setSocialReportsScope('competitors')}>Competitors</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                            {socialReportsScope === 'competitors' && competitors.length > 0 && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild disabled={isSocialReportsRunning}>
                                                        <Button variant="outline" className="w-[180px] h-9 justify-between bg-background font-normal">
                                                            {competitors.find((c: any) => c.id === socialReportsCompetitorId)?.name || "Select Competitor"}
                                                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-[180px]">
                                                        {competitors.map((comp: any) => (
                                                            <DropdownMenuItem
                                                                key={comp.id}
                                                                onClick={() => setSocialReportsCompetitorId(comp.id)}
                                                            >
                                                                {comp.name}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    }
                                />

                                <Card className="border-dashed">
                                    <CardHeader >
                                        <CardTitle className="text-sm font-medium">Custom Instructions (Optional)</CardTitle>
                                        <CardDescription className="text-xs">
                                            Provide specific guidance for the AI analysis, e.g., &quot;Focus on visual trends&quot; or &quot;Analyze competitor positioning&quot;
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Input
                                            placeholder="Enter custom instructions for the analysis..."
                                            value={socialReportsInstruction}
                                            onChange={(e) => setSocialReportsInstruction(e.target.value)}
                                            disabled={isSocialReportsRunning}
                                            className="max-w-xl"
                                        />
                                    </CardContent>
                                </Card>

                                {socialReportsTasks.length > 0 && (
                                    <Card>
                                        <CardHeader >
                                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                Report History
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                View and manage previously generated social reports
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <SocialReportsTaskListViewer
                                                tasks={socialReportsTasks}
                                                onSelectTask={handleSelectSocialReportTask}
                                                onDeleteTask={handleDeleteSocialReportTask}
                                                selectedTaskId={socialReportsTaskId}
                                                isDeleting={isDeletingTask}
                                                deletingTaskId={deletingTaskId}
                                            />
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            )}

            <Collapsible className="group border rounded-lg bg-muted/20">
                <CollapsibleTrigger asChild>
                    <div className="flex items-center gap-2 p-3 cursor-pointer hover:bg-muted/30 transition-colors">
                        <Terminal className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">API Debug Parameters</span>
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div className="p-3 pt-0 space-y-2 border-t bg-muted/10">
                        <DebugIdRow label="Client ID" value={brandData?.client_id || 'N/A'} />
                        <DebugIdRow label="Brand ID" value={brandId} />
                        <DebugIdRow label="Website Batch ID" value={currentWebBatchId || websiteBatchId || 'N/A'} />
                        <DebugIdRow label="Social Batch ID" value={currentSocialBatchId || socialBatchId || 'N/A'} />
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );

}


function DebugIdRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center text-xs h-7">
            <span className="text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2">
                <code className="bg-background border px-1.5 py-0.5 rounded font-mono text-[10px] text-foreground">{value}</code>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                    navigator.clipboard.writeText(value);
                    toast.success(`Copied ${label}`);
                }}>
                    <Copy className="h-3 w-3" />
                </Button>
            </div>
        </div>
    )
}

function Globe({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <line x1="2" x2="22" y1="12" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    )
}

function Fingerprint({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
            <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
            <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
            <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
            <path d="M8.65 22c.21-.66.45-1.32.57-2" />
            <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
            <path d="M2 16h.01" />
            <path d="M21.8 16c.2-2 .131-5.354 0-6" />
            <path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" />
        </svg>
    )
}
