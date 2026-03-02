
'use client'

import { useEffect, useState } from 'react';
import { PositioningLandscape, CategoryGrammar, TopicOwnership, WhitespaceAnalysis, CompetitorPlaybook, VisualCompetitiveAnalysis } from '@/lib/brandos-v2.1/types';
import { getComparativeDataAction } from '@/server/brandos-v2.1/actions';
import { DashboardInnerLayout } from '@/components/stages/ccba/dashboard/shared/DashboardComponents';
import { JsonViewer } from './shared/DashboardComponents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DeliverablesTable, DeliverableItem } from './shared/DeliverablesTable';
import { Button } from '@/components/ui/button';
import { MdOutlineArrowRight } from "react-icons/md";
import { useRouter } from 'next/navigation';

interface ComparativeData {
    positioning_landscape: PositioningLandscape;
    category_grammar: CategoryGrammar;
    topic_ownership: TopicOwnership;
    whitespace_analysis: WhitespaceAnalysis;
    competitor_playbooks: CompetitorPlaybook;
    visual_competitive: VisualCompetitiveAnalysis;
}

const COMPARATIVE_DELIVERABLES: DeliverableItem[] = [
    { name: 'Positioning Landscape', filename: 'positioning_landscape.json', schema: 'positioning_landscape.json', owner: 'OI-13' },
    { name: 'Category Grammar', filename: 'category_grammar.json', schema: 'category_grammar.json', owner: 'OI-13' },
    { name: 'Topic Ownership', filename: 'topic_ownership.json', schema: 'topic_ownership.json', owner: 'OI-13' },
    { name: 'Whitespace Analysis', filename: 'whitespace_analysis.json', schema: 'whitespace_analysis.json', owner: 'OI-13' },
    { name: 'Competitor Playbooks', filename: 'competitor_playbooks.json', schema: 'competitor_playbooks.json', owner: 'OI-13' },
    { name: 'Visual Competitive Analysis', filename: 'visual_competitive_analysis.json', schema: 'visual_competitive_analysis.json', owner: 'OI-17' },
];

export default function ComparativeDashboard({ engagementId }: { engagementId: string }) {
    const router = useRouter();
    const [data, setData] = useState<ComparativeData | null>(null);

    useEffect(() => {
        if (engagementId) {
            getComparativeDataAction(engagementId).then(setData);
        }
    }, [engagementId]);

    if (!data) return <div className="p-8">Loading comparative data...</div>;

    const chartData = data.positioning_landscape.matrix.map(m => ({
        name: m.entity,
        value: m.market_share_proxy
    }));

    return (
        <DashboardInnerLayout>
            <div className="relative flex gap-3 mt-6">
                <Button onClick={() => router.push(`/dashboard/brandos-v2.1/export?engagementId=${engagementId}`)}>
                    Proceed to Export
                    <MdOutlineArrowRight />
                </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 mt-8">
                {/* Positioning Matrix Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Positioning Matrix</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Entity</TableHead>
                                    <TableHead>Positioning</TableHead>
                                    <TableHead className="text-right">Share Proxy</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.positioning_landscape.matrix.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">{row.entity}</TableCell>
                                        <TableCell>{row.positioning}</TableCell>
                                        <TableCell className="text-right">{(row.market_share_proxy * 100).toFixed(1)}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Market Share Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Market Share Proxy</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                                <Tooltip />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? 'var(--brandos-green)' : 'var(--muted-foreground)'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

            </div>

            {/* Artifacts */}
            <div className="space-y-8 pt-12">
                <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-medium tracking-tight">Phase 2B: Cross-Entity Outputs</h3>
                    <div className="h-px flex-1 bg-border" />
                </div>

                <DeliverablesTable items={COMPARATIVE_DELIVERABLES} />

                <div className="grid md:grid-cols-2 gap-6 pt-4">
                    <JsonViewer data={data.positioning_landscape} title="verbal_positioning_map.json" />
                    <JsonViewer data={{ market_share_analysis: data.positioning_landscape.matrix.map(m => ({ entity: m.entity, share: m.market_share_proxy })) }} title="market_share_estimation.json" />
                    <JsonViewer data={data.category_grammar} title="category_grammar.json" />
                    <JsonViewer data={data.topic_ownership} title="topic_ownership.json" />
                    <JsonViewer data={data.whitespace_analysis} title="whitespace_analysis.json" />
                    <JsonViewer data={data.competitor_playbooks} title="competitor_playbooks.json" />
                    <JsonViewer data={data.visual_competitive} title="visual_competitive.json" />
                </div>
            </div>
        </DashboardInnerLayout>
    );
}
