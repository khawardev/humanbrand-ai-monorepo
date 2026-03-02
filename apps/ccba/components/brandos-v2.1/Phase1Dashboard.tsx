'use client'

import { useEffect, useState } from 'react';
import { AgentState, UrlExtraction, PostExtraction, ImageExtraction, WebsiteVerbalBedrock, WebsiteVisualBedrock, SocialChannelBedrock, SocialVisualBedrock, GateOutputs } from '@/lib/brandos-v2.1/types';
import { pollPhase1StatusAction, startPhase1Action } from '@/server/brandos-v2.1/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MdOutlineArrowRight } from "react-icons/md";
import { ButtonSpinner } from '@/components/shared/SpinnerLoader';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { DashboardInnerLayout, GateResultDisplay, JsonViewer } from './shared/DashboardComponents';
import { AgentList } from './shared/AgentList';
import { DeliverablesTable, DeliverableItem } from './shared/DeliverablesTable';
import { Badge } from '@/components/ui/badge';

const EXTRACTION_DELIVERABLES: DeliverableItem[] = [
    { name: 'Webpage Extraction', filename: 'url_extraction_{source_id}.json', schema: 'url_extraction.json', owner: 'OI-01' },
    { name: 'Image Extraction', filename: 'image_extraction_{source_id}.json', schema: 'image_extraction.json', owner: 'OI-02' },
    { name: 'Social Post Extraction', filename: 'post_extraction_{source_id}.json', schema: 'post_extraction.json', owner: 'OI-03' },
];

const COMPILATION_DELIVERABLES: DeliverableItem[] = [
    { name: 'Website Verbal Bedrock', filename: '{entity}_website_verbal_bedrock.json', schema: 'website_verbal_bedrock.json', owner: 'COMP-01' },
    { name: 'Website Visual Bedrock', filename: '{entity}_website_visual_bedrock.json', schema: 'website_visual_bedrock.json', owner: 'COMP-02' },
    { name: 'Social Channel Bedrock', filename: '{entity}_{channel}_bedrock.json', schema: 'social_channel_bedrock.json', owner: 'COMP-03' },
    { name: 'Social Visual Bedrock', filename: '{entity}_{channel}_visual_bedrock.json', schema: 'social_visual_bedrock.json', owner: 'COMP-04' },
];

export default function Phase1Dashboard({ engagementId }: { engagementId: string }) {
    const router = useRouter();
    const [agents, setAgents] = useState<AgentState[]>([]);
    const [extractions, setExtractions] = useState<{ url: UrlExtraction[], posts: PostExtraction[], images: ImageExtraction[] } | null>(null);
    const [bedrocks, setBedrocks] = useState<{ website: WebsiteVerbalBedrock, website_visual: WebsiteVisualBedrock, social: SocialChannelBedrock, social_visual: SocialVisualBedrock } | null>(null);
    const [gate1Results, setGate1Results] = useState<GateOutputs | null>(null);
    const [gate2Results, setGate2Results] = useState<GateOutputs | null>(null);
    const [isPolling, setIsPolling] = useState(true);

    useEffect(() => {
        if (engagementId) {
            startPhase1Action(engagementId);
        }
    }, [engagementId]);

    useEffect(() => {
        if (!isPolling) return;

        const interval = setInterval(async () => {
            // Updated to handle return type of pollPhase1StatusAction correctly
            const result = await pollPhase1StatusAction(engagementId);
            setAgents(result.agents);

            if (result.extractions) setExtractions(result.extractions);
            if (result.bedrocks) setBedrocks(result.bedrocks);
            if (result.gate1Results) setGate1Results(result.gate1Results);
            if (result.gate2Results) setGate2Results(result.gate2Results);

            const allCompleted = result.agents.every(a => a.status === 'completed' || a.status === 'failed');
            if (allCompleted) {
                setIsPolling(false);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [engagementId, isPolling]);

    const overallStatus = (gate2Results?.overall_status === 'pass' || gate2Results?.overall_status === 'warn') ? 'complete' : 'pending';
    const canProceed = overallStatus === 'complete';
    const isSwarmComplete = agents.length > 0 && agents.every(a => a.status === 'completed' || a.status === 'failed');

    return (
        <DashboardInnerLayout>
            {/* Agents Status */}
            <div className="space-y-6 ">
                <div className="border-b pb-2 flex justify-between">
                    <div>
                        <h3 className="text-2xl font-medium tracking-tight">Agent Swarm Status</h3>
                        <p className="text-muted-foreground mt-1">Real-time status of extraction and compilation agents.</p>
                    </div>
                    <Button disabled={!canProceed} onClick={() => router.push(`/dashboard/brandos-v2.1/phase-2?engagementId=${engagementId}`)} >
                        {canProceed ? (
                            <>
                                Proceed to Phase 2
                                <MdOutlineArrowRight />
                            </>
                        ) : (
                            <ButtonSpinner> Phase 1</ButtonSpinner>
                        )}
                    </Button>
                </div>
                <div className="flex flex-col gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                             <h4 className="text-lg font-medium">Extraction Agents (Map)</h4>
                             <Badge variant="secondary" className="text-xs">Phase 1A</Badge>
                        </div>
                        <AgentList agents={agents.filter(a => a.id.startsWith('oi-') || a.id === 'scrapers')} />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                             <h4 className="text-lg font-medium">Compilation Agents (Reduce)</h4>
                             <Badge variant="secondary" className="text-xs">Phase 1B</Badge>
                        </div>
                        <AgentList agents={agents.filter(a => a.id.startsWith('comp-'))} />
                    </div>
                </div>
            </div>
            {/* Gate 1 Logic */}
            {isSwarmComplete && gate1Results && (
                <div className="space-y-6 mt-10 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-2xl font-medium tracking-tight">Gate 1: Extraction Quality</h3>
                    <GateResultDisplay results={gate1Results} />
                </div>
            )}

            {/* Gate 2 Logic */}
            {isSwarmComplete && gate2Results && (
                <div className="space-y-6 mt-10 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-2xl font-medium tracking-tight">Gate 2: Compilation Integrity</h3>
                    <GateResultDisplay results={gate2Results} />
                </div>
            )}

            {/* Artifacts Viewer */}
            {isSwarmComplete && (extractions || bedrocks) && (
                <div className="space-y-8 pt-12">
                    <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-medium tracking-tight">Phase 1 Deliverables</h3>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    <Tabs defaultValue="bedrocks" className="w-full">
                        <TabsList >
                            <TabsTrigger
                                value="extractions"
                            >
                                Phase 1A: Extraction Outputs
                            </TabsTrigger>
                            <TabsTrigger
                                value="bedrocks"

                            >
                                Phase 1B: Compilation Outputs
                            </TabsTrigger>
                        </TabsList>

                        <div className="mt-8">
                            <TabsContent value="extractions" className="space-y-6">
                                <DeliverablesTable items={EXTRACTION_DELIVERABLES} />
                                <div className="grid md:grid-cols-2 gap-6 pt-4">
                                    <JsonViewer data={extractions?.url} title="url_extractions_sample.json" />
                                    <JsonViewer data={extractions?.posts} title="social_post_extraction.json" />
                                    <JsonViewer data={extractions?.images} title="image_extraction.json" />
                                </div>
                            </TabsContent>
                            <TabsContent value="bedrocks" className="space-y-6">
                                <DeliverablesTable items={COMPILATION_DELIVERABLES} />
                                <div className="grid md:grid-cols-2 gap-6 pt-4">
                                    <JsonViewer data={bedrocks?.website} title="website_verbal_bedrock.json" />
                                    <JsonViewer data={bedrocks?.website_visual} title="website_visual_bedrock.json" />
                                    <JsonViewer data={bedrocks?.social} title="social_channel_bedrock.json" />
                                    <JsonViewer data={bedrocks?.social_visual} title="social_visual_bedrock.json" />
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            )}
        </DashboardInnerLayout>
    );
}
