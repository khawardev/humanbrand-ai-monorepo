'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExecutiveSummary from './tabs/ExecutiveSummary';
import OverviewTab from './tabs/OverviewTab';
import SentimentTab from './tabs/SentimentTab';
import TopicsAndPillarsTab from './tabs/TopicsAndPillarsTab';
import TimelineTab from './tabs/TimelineTab';
import StrategicTab from './tabs/StrategicTab';
import V4Tab from './tabs/V4Tab';

export default function EarnedMediaDashboard({ data }: any) {
    const [activeTab, setActiveTab] = useState('v4');
    const v1Data = data.v1;
    const v4Data = data.v4;

    return (
        <div className="flex flex-col space-y-6 mt-4">
            <ExecutiveSummary data={v1Data} />
            <Card>
                <CardHeader>
                    <CardTitle>Comparison Dashboard Fields</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground">Brand</p>
                            <p className="text-sm font-medium">{data.comparisonFields.brand}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Period</p>
                            <p className="text-sm font-medium">{data.comparisonFields.period}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Articles</p>
                            <p className="text-sm font-medium">{data.comparisonFields.articles}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">% Positive (Weighted)</p>
                            <p className="text-sm font-medium">{data.comparisonFields.positivePercentage}%</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">% Challenging</p>
                            <p className="text-sm font-medium">{data.comparisonFields.challengingPercentage}%</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Top Pillar</p>
                            <p className="text-sm font-medium">{data.comparisonFields.topPillar}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Dominant Region</p>
                            <p className="text-sm font-medium">{data.comparisonFields.dominantRegion}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Risks</p>
                            <p className="text-sm font-medium">{data.comparisonFields.riskCount}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Velocity Δ</p>
                            <p className="text-sm font-medium">{data.comparisonFields.latestVelocity}</p>
                        </div>
                        <div className="md:col-span-3">
                            <p className="text-xs text-muted-foreground">Positioning</p>
                            <p className="text-sm font-medium">{data.comparisonFields.positioning}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList >
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                    <TabsTrigger value="topics">Topics & Pillars</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="strategic">Strategic</TabsTrigger>
                    <TabsTrigger value="v4">V4 Dashboard</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-6"><OverviewTab data={v1Data} /></TabsContent>
                <TabsContent value="sentiment" className="space-y-6"><SentimentTab data={v1Data} /></TabsContent>
                <TabsContent value="topics" className="space-y-6"><TopicsAndPillarsTab data={v1Data} /></TabsContent>
                <TabsContent value="timeline" className="space-y-6"><TimelineTab data={v1Data} /></TabsContent>
                <TabsContent value="strategic" className="space-y-6"><StrategicTab data={v1Data} /></TabsContent>
                <TabsContent value="v4" className="space-y-6"><V4Tab data={v4Data} /></TabsContent>
            </Tabs>
        </div>
    );
}