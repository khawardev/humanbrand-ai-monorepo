'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import CustomChartTooltipContent from '@/components/stages/ccba/dashboard/shared/CustomChartTooltipContent';
import { Activity } from 'lucide-react';

export default function ExecutiveSummary({ data }: any) {
    const { executiveSummary, colors } = data;

    const sentimentPieData = [
        { name: 'Positive', value: executiveSummary.sentiment.positive, fill: colors.positive },
        { name: 'Neutral', value: executiveSummary.sentiment.neutral, fill: colors.neutral },
        { name: 'Challenging', value: executiveSummary.sentiment.challenging, fill: colors.challenging }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Executive Summary
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Articles</p>
                        <p className="text-2xl font-bold">{executiveSummary.articles.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Analysis Period</p>
                        <p className="text-sm font-medium">{executiveSummary.period}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Regional Distribution</p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                            {Object.entries(executiveSummary.regionalSplit).map(([region, value]:any) => (
                                <Badge key={region} variant="outline">{region}: {value}%</Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-sm font-semibold mb-8">Sentiment Distribution (Weighted)</h4>
                        <ResponsiveContainer width="100%" height={225}>
                            <PieChart>
                                <Pie data={sentimentPieData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={80} dataKey="value">
                                    {sentimentPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} stroke={'none'} />)}
                                </Pie>
                                <Tooltip content={<CustomChartTooltipContent />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-3">Top Media-Ascribed Pillars</h4>
                        <div className="space-y-3">
                            {executiveSummary.topPillars.map((pillar: any, idx: number) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm">{pillar.name}</span>
                                        <span className="text-sm font-semibold">{pillar.percentage}%</span>
                                    </div>
                                    <Progress value={pillar.percentage} className="h-1" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Separator className="my-4" />
                <div className="bg-accent/40 border p-4 rounded-lg">
                    <p className="text-sm leading-relaxed">{executiveSummary.narrative}</p>
                </div>
            </CardContent>
        </Card>
    );
}