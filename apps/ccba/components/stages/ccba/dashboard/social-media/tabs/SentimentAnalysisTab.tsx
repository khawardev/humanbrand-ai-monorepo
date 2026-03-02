'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomChartTooltipContent from "@/components/stages/ccba/dashboard/shared/CustomChartTooltipContent";
import { BRAND_SOCIAL_COLOR } from "@/lib/static/dashboardColor";

export default function SentimentAnalysisTab({ data }: any) {
    const { platforms } = data;
    const { SENTIMENT_COLORS }:any = BRAND_SOCIAL_COLOR;
    const platformKeys = Object.keys(platforms);

    return (
        <Tabs defaultValue={platformKeys[0]}>
            <div className="w-full overflow-x-auto">
                <TabsList>
                    {platformKeys.map(key => <TabsTrigger key={key} value={key}>{platforms[key].name}</TabsTrigger>)}
                </TabsList>
            </div>
            <div className="mt-4">
                {platformKeys.map(key => {
                    const platform = platforms[key];
                    const chartData = Object.entries(platform.sentiment).map(([name, value]) => ({ name, value: Number(value) }));
                    return (
                        <TabsContent key={key} value={key} className="flex flex-col gap-8">
                            <Card>
                                <CardHeader><CardTitle>{platform.name} Sentiment Breakdown</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {chartData.map((item: any) => (
                                        <div key={item.name}>
                                            <div className="flex justify-between mb-1">
                                                <p className="text-sm font-medium capitalize">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">{item.value}%</p>
                                            </div>
                                            <Progress value={item.value} style={{ backgroundColor: SENTIMENT_COLORS[item.name] }} />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Sentiment Distribution</CardTitle></CardHeader>
                                <CardContent className="h-[400px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label={({ name, value }) => `${name}: ${value}%`}>
                                                {chartData.map((entry: any, index: any) => <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.name]} stroke={'none'} />)}
                                            </Pie>
                                            <Tooltip content={<CustomChartTooltipContent />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )
                })}
            </div>
        </Tabs>
    );
}