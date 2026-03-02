'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, LabelList } from 'recharts';
import { AlertCircle, Target } from 'lucide-react';
import CustomChartTooltipContent from '@/components/stages/ccba/dashboard/shared/CustomChartTooltipContent';

export default function TopicsAndPillarsTab({ data }: any) {
    const { shareOfVoice, brandPillars, businessDrivers, whiteSpace, colors } = data;

    const getToneBadgeVariant = (tone: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (tone.toLowerCase()) {
            case 'positive': return 'default';
            case 'challenging': return 'destructive';
            default: return 'secondary';
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Share of Voice & Media Impact</CardTitle>
                    <CardDescription>Topic cluster distribution and tone analysis</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={shareOfVoice}
                            layout="vertical"
                            margin={{ left: 40}}
                        >
                            <CartesianGrid horizontal={false} vertical={false} strokeDasharray="3 3" />
                            <XAxis
                                type="number"
                                tick={{ fontSize: 12}}
                                tickLine={false}
                                axisLine={false}
                                unit="%"
                            />
                            <YAxis
                                type="category"
                                dataKey="topic"
                                tick={{ fontSize: 12}}
                                tickLine={false}
                                axisLine={false}
                                width={150}
                            />
                            <Tooltip
                                formatter={(value: any) => `${value}%`}
                                content={<CustomChartTooltipContent />}
                            />
                            <Bar dataKey="share" radius={6} barSize={25}>
                                {shareOfVoice.map((entry: any, index: number) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            entry.tone === 'Positive'
                                                ? colors.positive
                                                : entry.tone === 'Challenging'
                                                    ? colors.challenging
                                                    : entry.tone === 'Neutral'
                                                        ? colors.neutral
                                                        : colors.primary
                                        }
                                    />
                                ))}
                                <LabelList
                                    dataKey="share"
                                    position="right"
                                    offset={10}
                                    formatter={(value: any) => `${value}%`}
                                    fontSize={12}
                                    fontWeight="bold"
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-6 space-y-3">
                        {shareOfVoice.map((item: any, idx: number) => (
                            <div key={idx} className="border rounded-lg p-3">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-sm">{item.topic}</h4>
                                    <div className="flex gap-2">
                                        <Badge variant={getToneBadgeVariant(item.tone)}>{item.tone}</Badge>
                                        <Badge variant="outline">{item.share}%</Badge>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">Sources: {item.sources}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Emergent Brand Pillars</CardTitle>
                    <CardDescription>Media-ascribed brand positioning</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={brandPillars}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="pillar" fontSize={11} />
                            <PolarRadiusAxis />
                            <Radar name="Share %" dataKey="share" stroke={colors.primary} fill={colors.primary} fillOpacity={0.6} />
                            <Tooltip content={<CustomChartTooltipContent />} />
                        </RadarChart>
                    </ResponsiveContainer>
                    <div className="mt-6 space-y-4">
                        {brandPillars.map((pillar: any, idx: number) => (
                            <div key={idx} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold">{pillar.pillar}</h4>
                                    <div className="flex gap-2">
                                        <Badge variant={getToneBadgeVariant(pillar.tone)}>{pillar.tone}</Badge>
                                        <Badge variant="outline">{pillar.share}%</Badge>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{pillar.phrases}</p>
                                <blockquote className="italic text-sm border-l-2 pl-3">"{pillar.quote}"</blockquote>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Business Drivers & Macrotrends</CardTitle>
                    <CardDescription>Fixed taxonomy analysis</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={businessDrivers}
                            layout="vertical"
                        >
                            <CartesianGrid horizontal={false} vertical={false} strokeDasharray="3 3" />
                            <XAxis
                                type="number"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="driver"
                                tick={{ fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                                width={150}
                            />
                            <Tooltip content={<CustomChartTooltipContent />} />
                            <Bar dataKey="hits" fill={colors.secondary} radius={6} barSize={25}>
                                <LabelList
                                    dataKey="hits"
                                    position="right"
                                    offset={10}
                                    fontSize={12}
                                    fontWeight="bold"
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-6 space-y-3">
                        {businessDrivers.map((driver: any, idx: number) => (
                            <div key={idx} className="border rounded-lg p-3">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-semibold text-sm">{driver.driver}</h4>
                                    <div className="flex gap-2">
                                        <Badge variant={driver.toneBias === 'Positive' ? 'default' : 'secondary'}>{driver.toneBias}</Badge>
                                        <Badge variant="outline">{driver.hits} hits</Badge>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">{driver.relevance}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Topic-Void / White-Space Heat Map</CardTitle>
                    <CardDescription>Underrepresented topics requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {whiteSpace.map((item: any, idx: number) => (
                            <div key={idx} className="border rounded-lg p-4 bg-muted/30">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-semibold">{item.topic}</h4>
                                        <p className="text-sm text-muted-foreground">Coverage: {item.coverage}</p>
                                    </div>
                                    <AlertCircle className="h-5 w-5 text-destructive" />
                                </div>
                                <p className="text-sm mb-2">{item.importance}</p>
                                <div className="flex items-center gap-2">
                                    <Target className="h-4 w-4" />
                                    <p className="text-sm font-medium">{item.action}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}