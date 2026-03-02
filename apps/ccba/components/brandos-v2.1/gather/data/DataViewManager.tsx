'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Copy, Terminal, Database, FileText } from 'lucide-react';
import { ScrapeStatusBadge } from '../ScrapeStatusBadge';
import { PollingStatusBadge } from '../PollingStatusBadge';
import { isStatusProcessing, isWithinOneDay } from '@/lib/utils';
import { BatchSelector } from './BatchSelector';
import BrandProfile from '@/components/stages/ccba/details/profile-tab/BrandProfile';
import { AuditorAgentCard } from '../AuditorAgentCard';
import { AuditorResultViewer } from '../AuditorResultViewer';
import { SocialAuditorResultViewer } from '../SocialAuditorResultViewer';
import { useAuditor } from './hooks/UseAuditor';
import { useSocialAuditor } from './hooks/UseSocialAuditor';
import { AiOutlinePieChart } from "react-icons/ai";
import { RecollectDialog } from '../RecollectDialog';
import { WebAgentsManager } from '../WebAgentsManager';
import { SocialAgentsManager } from '../SocialAgentsManager';
import { SocialDataViewer } from './SocialDataViewer';
import { WebsiteDataViewer } from './WebsiteDataViewer';
import { MdOutlineArrowLeft } from 'react-icons/md';

type WebsiteBatch = {
    batch_id: string;
    created_at: string;
    status: string;
    brand_id: string;
    client_id: string;
    scraped_pages: any;
    errors: any;
    result_keys: any;
};

type SocialBatch = {
    batch_id: string;
    created_at: string;
    status: string;
    brand_id: string;
    client_id: string;
    start_date: string;
    end_date: string;
    error: any;
};

type DataViewManagerProps = {
    brandId: string;
    brandData: any;
    websiteBatches: WebsiteBatch[];
    socialBatches: SocialBatch[];
    defaultWebsiteBatchId: string | null;
    defaultSocialBatchId: string | null;
    defaultWebsiteStatus: string | null;
    defaultSocialStatus: string | null;
    availableChannels: string[];
    hasResults: boolean;
    hasWebsiteData: boolean;
    hasSocialData: boolean;
    isWebComplete: boolean;
    isSocialComplete: boolean;
};

function isCompleteStatus(status: string | null): boolean {
    return status === 'Completed' || status === 'CompletedWithErrors';
}

export function DataViewManager({
    brandId,
    brandData,
    websiteBatches,
    socialBatches,
    defaultWebsiteBatchId,
    defaultSocialBatchId,
    availableChannels,
    hasResults,
    hasWebsiteData,
    hasSocialData,
}: DataViewManagerProps) {
    const [activeTab, setActiveTab] = useState('brand_profile');
    
    const [selectedWebsiteBatchId, setSelectedWebsiteBatchId] = useState<string | null>(defaultWebsiteBatchId);
    const [selectedSocialBatchId, setSelectedSocialBatchId] = useState<string | null>(defaultSocialBatchId);

    const [websiteAuditScope, setWebsiteAuditScope] = useState<string>('both');
    const [websiteAuditModel, setWebsiteAuditModel] = useState<string>('claude-4.5-sonnet');
    const [socialAuditScope, setSocialAuditScope] = useState<string>('brand');
    const [selectedChannel, setSelectedChannel] = useState<string>('linkedin');

    const selectedWebsiteBatch = useMemo(() => 
        websiteBatches.find(b => b.batch_id === selectedWebsiteBatchId),
        [websiteBatches, selectedWebsiteBatchId]
    );

    const selectedSocialBatch = useMemo(() => 
        socialBatches.find(b => b.batch_id === selectedSocialBatchId),
        [socialBatches, selectedSocialBatchId]
    );

    const selectedWebsiteStatus = selectedWebsiteBatch?.status || null;
    const selectedSocialStatus = selectedSocialBatch?.status || null;
    const selectedWebsiteCreatedAt = selectedWebsiteBatch?.created_at || null;
    const selectedSocialCreatedAt = selectedSocialBatch?.created_at || null;

    const isWebComplete = isCompleteStatus(selectedWebsiteStatus);
    const isSocialComplete = isCompleteStatus(selectedSocialStatus);

    const shouldPollWebsite = isStatusProcessing(selectedWebsiteStatus) && isWithinOneDay(selectedWebsiteCreatedAt);
    const shouldPollSocial = isStatusProcessing(selectedSocialStatus) && isWithinOneDay(selectedSocialCreatedAt);
    
    const competitors = useMemo(() => 
        brandData?.competitors?.map((c: any) => ({
            id: String(c.competitor_id),
            name: c.name,
            linkedin_url: c.linkedin_url,
            facebook_url: c.facebook_url,
            instagram_url: c.instagram_url,
            x_url: c.x_url,
            youtube_url: c.youtube_url,
            tiktok_url: c.tiktok_url
        })) ?? [],  
        [brandData?.competitors]
    );

    const {
        taskId: auditorTaskId,
        result: auditorResult,
        isRunning: isAuditorRunning,
        handleRun: handleRunAuditor
    } = useAuditor({
        clientId: brandData.client_id,
        brandId,
        batchId: selectedWebsiteBatchId,
        scope: websiteAuditScope,
        modelName: websiteAuditModel
    });

    const {
        taskId: socialAuditorTaskId,
        result: socialAuditorResult,
        isRunning: isSocialAuditorRunning,
        handleRun: handleRunSocialAuditor
    } = useSocialAuditor({
        clientId: brandData.client_id,
        brandId,
        batchId: selectedSocialBatchId,
        channel: selectedChannel,
        scope: socialAuditScope
    });

    const handleWebsiteBatchChange = (batchId: string) => {
        setSelectedWebsiteBatchId(batchId);
    };

    const handleSocialBatchChange = (batchId: string) => {
        setSelectedSocialBatchId(batchId);
    };

    return (
        <div className="space-y-8 w-full pb-12">
            <Button asChild className="rounded-full" variant={'outline'}>
                <Link href="/dashboard/brandos-v2.1/gather">
                    <MdOutlineArrowLeft/>
                    Back
                </Link>
            </Button>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-medium tracking-tight">{brandData.name}</h3>
                    <p className="text-muted-foreground">Captured Data & Analysis</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <RecollectDialog
                        brandId={brandId}
                        brandName={brandData.name}
                        variant="button"
                        trigger={
                            <Button>
                                Re Capture
                            </Button>
                        }
                    />
                    {hasWebsiteData && (
                        <BatchSelector
                            brandId={brandId}
                            type="website"
                            batches={websiteBatches}
                            selectedBatchId={selectedWebsiteBatchId}
                            onBatchChange={handleWebsiteBatchChange}
                        />
                    )}
                    {hasSocialData && (
                        <BatchSelector
                            brandId={brandId}
                            type="social"
                            batches={socialBatches}
                            selectedBatchId={selectedSocialBatchId}
                            onBatchChange={handleSocialBatchChange}
                        />
                    )}
                </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                    <TabsTrigger value="brand_profile">Brand Profile</TabsTrigger>
                    <TabsTrigger value="captured_data" disabled={!hasResults}>
                        Captured Data
                        {!hasResults && <span className="ml-2 text-xs text-muted-foreground">(pending)</span>}
                    </TabsTrigger>
                    {/* <TabsTrigger value="ai_audit" disabled={!hasWebsiteData && !hasSocialData}>
                        <Bot className="w-4 h-4 mr-1" />
                        Outside-in Audit
                    </TabsTrigger> */}
                    <TabsTrigger value="social_reports" disabled={!hasSocialData || !isSocialComplete}>
                        <FileText className="w-4 h-4 mr-1" />
                        Social Reports
                    </TabsTrigger>
                    <TabsTrigger value="web_agents" disabled={!hasWebsiteData || !isWebComplete}>
                        <Database className="w-4 h-4 mr-1" />
                        Web Reports
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="brand_profile" className="space-y-6 pt-4">
                    <BrandProfile brand={brandData} isScrapped={true} />
                </TabsContent>

                <TabsContent value="captured_data" className="space-y-6 pt-4">
                    <Tabs defaultValue={hasWebsiteData ? "website" : "social"} className="w-full">
                        <TabsList>
                            <TabsTrigger value="website" className="gap-2" disabled={!hasWebsiteData}>
                                Website Data
                                {selectedWebsiteStatus && (
                                    shouldPollWebsite && selectedWebsiteBatchId ? (
                                        <PollingStatusBadge
                                            type="Website"
                                            initialStatus={selectedWebsiteStatus}
                                            brandId={brandId}
                                            batchId={selectedWebsiteBatchId}
                                            createdAt={selectedWebsiteCreatedAt}
                                        />
                                    ) : (
                                        <ScrapeStatusBadge
                                            label="Website"
                                            status={selectedWebsiteStatus}
                                            showLabel={false}
                                            size="sm"
                                        />
                                    )
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="social" className="gap-2" disabled={!hasSocialData}>
                                Social Media Data
                                {selectedSocialStatus && (
                                    shouldPollSocial && selectedSocialBatchId ? (
                                        <PollingStatusBadge
                                            type="Social"
                                            initialStatus={selectedSocialStatus}
                                            brandId={brandId}
                                            batchId={selectedSocialBatchId}
                                            createdAt={selectedSocialCreatedAt}
                                        />
                                    ) : (
                                        <ScrapeStatusBadge
                                            label="Social"
                                            status={selectedSocialStatus}
                                            showLabel={false}
                                            size="sm"
                                        />
                                    )
                                )}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="website" className="pt-6">
                            {selectedWebsiteBatchId ? (
                                <WebsiteDataViewer
                                    brandId={brandId}
                                    batchId={selectedWebsiteBatchId}
                                    brandName={brandData.name}
                                    status={selectedWebsiteStatus}
                                />
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    No website data available. Please run data collection first.
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="social" className="pt-6">
                            {selectedSocialBatchId ? (
                                <SocialDataViewer
                                    brandId={brandId}
                                    batchId={selectedSocialBatchId}
                                    brandName={brandData.name}
                                    brandData={brandData}
                                    status={selectedSocialStatus}
                                />
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    No social media data available. Please run data collection first.
                                </div>
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
                            isDisabled={!selectedWebsiteBatchId || !isWebComplete}
                            buttonLabel="Run Website Audit"
                            controls={
                                <div className="flex items-center gap-2">
                                    <Select
                                        value={websiteAuditModel}
                                        onValueChange={setWebsiteAuditModel}
                                        disabled={isAuditorRunning}
                                    >
                                        <SelectTrigger className="w-[180px] h-9 bg-background">
                                            <SelectValue placeholder="Model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="claude-4.5-sonnet">Claude 4.5 Sonnet</SelectItem>
                                            <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                                            <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select
                                        value={websiteAuditScope}
                                        onValueChange={setWebsiteAuditScope}
                                        disabled={isAuditorRunning}
                                    >
                                        <SelectTrigger className="w-[140px] h-9 bg-background">
                                            <SelectValue placeholder="Scope" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="brand">Brand Only</SelectItem>
                                            <SelectItem value="competitors">Competitors Only</SelectItem>
                                            <SelectItem value="both">Brand & Competitors</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                            isDisabled={!selectedSocialBatchId || !isSocialComplete || !availableChannels.length}
                            buttonLabel="Run Social Analysis"
                            controls={
                                <div className="flex items-center gap-2">
                                    <Select
                                        value={selectedChannel}
                                        onValueChange={setSelectedChannel}
                                        disabled={isSocialAuditorRunning || !availableChannels.length}
                                    >
                                        <SelectTrigger className="w-[140px] h-9 bg-background">
                                            <SelectValue placeholder="Channel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableChannels.length > 0 ? (
                                                availableChannels.map(channel => (
                                                    <SelectItem key={channel} value={channel} className="capitalize">
                                                        {channel}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="none" disabled>No Data Available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>

                                    <Select
                                        value={socialAuditScope}
                                        onValueChange={setSocialAuditScope}
                                        disabled={isSocialAuditorRunning}
                                    >
                                        <SelectTrigger className="w-[160px] h-9 bg-background">
                                            <SelectValue placeholder="Scope" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="brand">Brand Only</SelectItem>
                                            <SelectItem value="competitors">Competitors Only</SelectItem>
                                            <SelectItem value="both">Brand & Competitors</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            }
                        />
                    </div>
                </TabsContent>
            </Tabs>

            {/* Social Reports Manager - Kept mounted to preserve state */}
            <div className={activeTab === "social_reports" ? "block space-y-6 pt-4" : "hidden"}>
                 <SocialAgentsManager
                    clientId={brandData?.client_id}
                    brandId={brandId}
                    batchSocialTaskId={selectedSocialBatchId}
                    brandName={brandData?.name}
                    availableChannels={availableChannels}
                    competitors={competitors}
                />
            </div>

            {/* Web Agents Manager - Kept mounted to preserve state */}
            <div className={activeTab === "web_agents" ? "block space-y-6 pt-4" : "hidden"}>
                <WebAgentsManager
                    clientId={brandData?.client_id}
                    brandId={brandId}
                    batchWebsiteTaskId={selectedWebsiteBatchId}
                    brandName={brandData?.name}
                    competitors={competitors}
                />
            </div>


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
                        <DebugIdRow label="Website Batch ID" value={selectedWebsiteBatchId || 'N/A'} />
                        <DebugIdRow label="Social Batch ID" value={selectedSocialBatchId || 'N/A'} />
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}

function DebugIdRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center text-xs h-7">
            <span className="text-muted-foreground">{label}</span>
            <div className="flex items-center gap-2">
                <code className="bg-background border px-1.5 py-0.5 rounded font-mono text-[10px] text-foreground">
                    {value}
                </code>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => {
                        navigator.clipboard.writeText(value);
                        toast.success(`Copied ${label}`);
                    }}
                >
                    <Copy className="h-3 w-3" />
                </Button>
            </div>
        </div>
    );
}

function Globe({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <line x1="2" x2="22" y1="12" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    );
}

function Fingerprint({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
            <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
            <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
            <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
            <path d="M8.65 22.2c.21-.66.45-1.32.57-2" />
            <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
            <path d="M2 16h.01" />
            <path d="M21.8 16c.2-2 .131-5.354 0-6" />
            <path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" />
        </svg>
    );
}
