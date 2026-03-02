
'use client'

import { useEffect, useState } from 'react';
import { AgentState } from '@/lib/brandos-v2.1/types';
import { pollHandoffStatusAction, startHandoffAction } from '@/server/brandos-v2.1/actions';
import { Button } from '@/components/ui/button';
import { Download, PackageCheck } from 'lucide-react';
import { DashboardInnerLayout } from './shared/DashboardComponents';
import { AgentList } from './shared/AgentList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DeliverablesTable, DeliverableItem } from './shared/DeliverablesTable';

const BRIDGE_DELIVERABLES: DeliverableItem[] = [
    { name: 'BAM Input Pack', filename: '{entity}_BAM_Input_Pack.zip', schema: 'bam_input_pack.zip', owner: 'BRG-00' },
    { name: 'Gate Outputs', filename: 'gate_outputs.json', schema: 'gate_outputs.json', owner: 'BRG-00' },
];

export default function ExportDashboard({ engagementId }: { engagementId: string }) {
    const [agents, setAgents] = useState<AgentState[]>([]);
    const [packageUrl, setPackageUrl] = useState<string | undefined>(undefined);
    const [isPolling, setIsPolling] = useState(true);

    useEffect(() => {
        if (engagementId) {
            startHandoffAction(engagementId);
        }
    }, [engagementId]);

    useEffect(() => {
        if (!isPolling) return;

        const interval = setInterval(async () => {
            const result = await pollHandoffStatusAction(engagementId);
            setAgents(result.agents);
            if (result.packageUrl) setPackageUrl(result.packageUrl);

            const allCompleted = result.agents.every(a => a.status === 'completed' || a.status === 'failed');
            if (allCompleted) setIsPolling(false);
        }, 2000);

        return () => clearInterval(interval);
    }, [engagementId, isPolling]);

    const isSwarmComplete = agents.length > 0 && agents.every(a => a.status === 'completed' || a.status === 'failed');

    return (
        <DashboardInnerLayout>
            {/* Agents */}
            <div className="space-y-6 ">
                <div className="border-b pb-2">
                    <h3 className="text-2xl font-medium tracking-tight">Agent Swarm Status</h3>
                    <p className="text-muted-foreground mt-1">Real-time status of handoff agent.</p>
                </div>
                <AgentList agents={agents} />
            </div>

            {/* Deliverables List */}
            {isSwarmComplete && (
                <div className="space-y-8 mt-8">
                    <div className="flex items-center gap-4">
                        <h3 className="text-2xl font-medium tracking-tight">Phase 3: Bridge Outputs</h3>
                        <div className="h-px flex-1 bg-border" />
                    </div>
                    <DeliverablesTable items={BRIDGE_DELIVERABLES} />
                </div>
            )}

            {/* Download */}
            {isSwarmComplete && packageUrl && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
                    <Card className="bg-(--brandos-green)/10 border-[var(--brandos-green)]/30">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-(--brandos-green)/20 rounded-lg">
                                    <PackageCheck className="w-6 h-6 text-[var(--brandos-green)]" />
                                </div>
                                <div>
                                    <CardTitle>BAM Input Pack Ready</CardTitle>
                                    <CardDescription>Your comprehensive brand synthesis package is ready for download.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full sm:w-auto gap-2   " asChild>
                                <a href={packageUrl} download>
                                    <Download className="w-4 h-4" />
                                    Download BAM Package (ZIP)
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </DashboardInnerLayout>
    );
}
