
'use client'

import { useEffect, useState } from 'react';
import { AgentState, EvidenceLedger, CorpusManifest, GateOutputs } from '@/lib/brandos-v2.1/types';
import { pollPhase0StatusAction, startPhase0Action } from '@/server/brandos-v2.1/actions';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { DashboardInnerLayout, GateResultDisplay, JsonViewer } from './shared/DashboardComponents';
import { AgentList } from './shared/AgentList';
import { DeliverablesTable, DeliverableItem } from './shared/DeliverablesTable';
import { ButtonSpinner } from '@/components/shared/SpinnerLoader';
import { MdOutlineArrowRight } from "react-icons/md";

const SETUP_DELIVERABLES: DeliverableItem[] = [
    { name: 'Engagement Config', filename: 'engagement_config.json', schema: 'engagement_config.json', owner: 'Client / Orchestrator' },
    { name: 'Evidence Ledger', filename: 'evidence_ledger.json', schema: 'evidence_ledger.json', owner: 'SA-00' },
    { name: 'Corpus Manifest', filename: 'corpus_manifest.json', schema: 'corpus_manifest.json', owner: 'SA-00' },
];

export default function Phase0Dashboard({ engagementId }: { engagementId: string }) {
    const router = useRouter();
    const [agents, setAgents] = useState<AgentState[]>([]);
    const [ledger, setLedger] = useState<EvidenceLedger | undefined>(undefined);
    const [manifest, setManifest] = useState<CorpusManifest | undefined>(undefined);
    const [gateResults, setGateResults] = useState<GateOutputs | undefined>(undefined);
    const [config, setConfig] = useState<any>(undefined);
    const [isPolling, setIsPolling] = useState(true);

    useEffect(() => {
        if (engagementId) {
            startPhase0Action(engagementId);
        }
    }, [engagementId]);

    useEffect(() => {
        if (!isPolling) return;

        const interval = setInterval(async () => {
            const result = await pollPhase0StatusAction(engagementId);
            setAgents(result.agents);
            if (result.ledger) setLedger(result.ledger);
            if (result.manifest) setManifest(result.manifest);
            if (result.gateResults) setGateResults(result.gateResults);
            if (result.config) setConfig(result.config);

            const allCompleted = result.agents.every(a => a.status === 'completed' || a.status === 'failed');
            if (allCompleted) setIsPolling(false);
        }, 2000);

        return () => clearInterval(interval);
    }, [engagementId, isPolling]);

    const overallStatus = (gateResults?.overall_status === 'pass' || gateResults?.overall_status === 'warn') ? 'complete' : 'pending';
    const canProceed = overallStatus === 'complete';
    const isSwarmComplete = agents.length > 0 && agents.every(a => a.status === 'completed' || a.status === 'failed');

    return (
        <DashboardInnerLayout>
            {/* Agents */}
            <div className="space-y-6">
                <div className="border-b pb-2">
                    <h3 className="text-2xl font-medium tracking-tight">Agent Swarm Status</h3>
                    <p className="text-muted-foreground mt-1">Real-time status of Phase 0 agents.</p>
                </div>
                <AgentList agents={agents} />
            </div>

            {/* Gate 0 */}
            {isSwarmComplete && gateResults && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 mt-8">
                    <h3 className="text-2xl font-medium tracking-tight">Gate 0: Corpus Adequacy</h3>
                    <GateResultDisplay results={gateResults} />
                </div>
            )}

            {/* Artifacts */}
            {isSwarmComplete && (ledger || manifest || config) && (
                <div className="space-y-8 pt-12">
                    <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-medium tracking-tight">Phase 0 Deliverables</h3>
                        <div className="h-px flex-1 bg-border" />
                    </div>

                    <DeliverablesTable items={SETUP_DELIVERABLES} />

                    <Tabs defaultValue="manifest" className="w-full mt-6">
                        <TabsList >
                            <TabsTrigger value="config" >Engagement Config</TabsTrigger>
                            <TabsTrigger value="manifest" >Manifest</TabsTrigger>
                            <TabsTrigger value="ledger" >Ledger</TabsTrigger>
                        </TabsList>

                        <div className="mt-8">
                            <TabsContent value="config">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <JsonViewer data={config} title="engagement_config.json" />
                                </div>
                            </TabsContent>
                            <TabsContent value="manifest">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <JsonViewer data={manifest} title="corpus_manifest.json" />
                                </div>
                            </TabsContent>
                            <TabsContent value="ledger">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <JsonViewer data={ledger} title="evidence_ledger.json" />
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            )}
        </DashboardInnerLayout>
    );
}
