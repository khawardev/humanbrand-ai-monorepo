'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomChartTooltipContent from '@/components/stages/ccba/dashboard/shared/CustomChartTooltipContent';

export default function TimelineTab({ data }: any) {
    const { narrativeVelocity, industryEvents, colors } = data;

    const formatMonth = (dateStr: string) => {
        const [year, month] = dateStr.split('-');
        if (!year || !month) return dateStr;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthName = months[parseInt(month) - 1] || month;
        return `${monthName} ${year.slice(-2)}`;
    };

    const velocityChartData = narrativeVelocity.map((item: any) => ({
        month: formatMonth(item.month),
        positive: item.positive,
        challenging: item.challenging,
        netSentiment: item.positive - item.challenging
    }));

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Narrative Velocity & Timeline</CardTitle>
                    <CardDescription>Monthly sentiment trends and net delta</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={velocityChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip content={<CustomChartTooltipContent />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="positive"
                                stroke={colors.positive}
                                strokeWidth={2}
                                name="Positive"
                                dot={{ fill: colors.positive, r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="challenging"
                                stroke={colors.challenging}
                                strokeWidth={2}
                                name="Challenging"
                                dot={{ fill: colors.challenging, r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="netSentiment"
                                stroke={colors.primary}
                                strokeWidth={3}
                                name="Net Sentiment"
                                strokeDasharray="5 5"
                                dot={{ fill: colors.primary, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {narrativeVelocity.slice(-3).map((item: any, idx: number) => (
                                <div key={idx} className="border rounded-lg p-3">
                                    <h5 className="font-semibold text-sm mb-2">{formatMonth(item.month)}</h5>
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                            <span>Positive:</span><span className="font-medium text-primary">{item.positive}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Challenging:</span><span className="font-medium text-red-600">{item.challenging}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-semibold">
                                            <span>Net Delta:</span><span className={item.netDelta >= 0 ? 'text-primary' : 'text-red-600'}>{item.netDelta > 0 ? '+' : ''}{item.netDelta}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Industry Events Overlay</CardTitle>
                    <CardDescription>Key events and their impact on coverage</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[600px]">
                        <div className="space-y-4">
                            {industryEvents.slice().reverse().map((event: any, idx: number) => (
                                <div key={idx} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-semibold">{event.event}</h4>
                                            <p className="text-sm text-muted-foreground">{formatMonth(event.date)}</p>
                                        </div>
                                        <Badge variant={event.toneShift >= 0 ? 'default' : 'destructive'}>{event.toneShift > 0 ? '+' : ''}{event.toneShift} tone shift</Badge>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                        <div><p className="text-xs text-muted-foreground">Driver</p><p className="text-sm font-medium">{event.driver}</p></div>
                                        <div><p className="text-xs text-muted-foreground">Coverage</p><p className="text-sm font-medium">{event.coverage} articles</p></div>
                                        <div><p className="text-xs text-muted-foreground">Magna Articles</p><p className="text-sm font-medium">{event.magnaArticles}</p></div>
                                        <div><p className="text-xs text-muted-foreground">Sources</p><p className="text-sm font-medium">{event.sources}</p></div>
                                    </div>
                                    <Progress value={(event.magnaArticles / event.coverage) * 100}  />
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </>
    );
}