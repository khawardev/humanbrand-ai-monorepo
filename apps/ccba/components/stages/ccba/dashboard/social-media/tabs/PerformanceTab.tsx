'use client'

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomChartTooltipContent from "@/components/stages/ccba/dashboard/shared/CustomChartTooltipContent";
import KpiCard from "../charts-and-cards/KpiCard";
import AudienceEngagementProfile from "../charts-and-cards/AudienceEngagementProfile";
import PrimaryContentThemes from "../charts-and-cards/PrimaryContentThemes";
import HomepageVsFeed from "../charts-and-cards/HomepageVsFeed";
import BrandVoiceTone from "../charts-and-cards/BrandVoiceTone";
import ContentStrategyGap from "../charts-and-cards/ContentStrategyGap";
import WhiteSpaceOpportunities from "../charts-and-cards/WhiteSpaceOpportunities";
import CompetitorPositioningMatrix from "../charts-and-cards/CompetitorPositioningMatrix";
import StrategySnapshotTable from "../charts-and-cards/StrategySnapshotTable";
import StrategicInitiativeTracker from "../charts-and-cards/StrategicInitiativeTracker";

export default function PerformanceTab({ data }: any) {
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? '#888888' : '#333333';
    const gridColor = theme === 'dark' ? '#444444' : '#dddddd';

    const { platforms } = data;
    const platformKeys = Object.keys(platforms);

    return (
        <Tabs defaultValue={platformKeys[0]}>
            <div className="w-full overflow-x-auto">
                <TabsList>
                    {platformKeys.map(key => (
                        <TabsTrigger key={key} value={key}>
                            {platforms[key].name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
            <div className="mt-4">
                {platformKeys.map(key => {
                    const platform = platforms[key];
                    if (!platform.PerformanceData) {
                        return (
                            <TabsContent key={key} value={key}>
                                <p>No performance data available for {platform.name}.</p>
                            </TabsContent>
                        );
                    }
                    return (
                        <TabsContent key={key} value={key} className="space-y-4">
                            <div className="flex flex-col gap-6">
                                <Card className="lg:col-span-3">
                                    <CardHeader><CardTitle>Top Engagement Drivers</CardTitle><CardDescription>Lift vs. Median (%)</CardDescription></CardHeader>
                                    <CardContent className="h-[350px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                accessibilityLayer
                                                data={platform.PerformanceData.topEngagementDrivers}
                                                layout="vertical"
                                                margin={{
                                                    left: 140,
                                                }}
                                            >
                                                <XAxis type="number"  hide />
                                                <YAxis
                                                    dataKey="name"
                                                    type="category"
                                                    tickLine={false}
                                                    tickMargin={10}
                                                    axisLine={false}
                                                    tick={{ fontSize: 14, fill: tickColor }}
                                                />
                                                <Tooltip content={<CustomChartTooltipContent />} />
                                                <Bar dataKey="value" barSize={25} radius={6}>
                                                    {platform.PerformanceData.topEngagementDrivers.map((entry: any, index: any) => (<Cell key={`cell-${index}`} stroke={'none'} fill={entry.value >= 0 ? "#84cc16" : "#f97316"} />))}
                                                    <LabelList dataKey="value" position="right" offset={10} formatter={(value: any) => `${value >= 0 ? '(+' : '('}${value}${value >= 0 ? '%)' : ')'}`} fill={tickColor} fontSize={12} fontWeight="bold" />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                        {/* <ChartContainer config={chartConfig}>
                                            <BarChart
                                                accessibilityLayer
                                                data={chartData}
                                                layout="vertical"
                                                margin={{
                                                    left: -20,
                                                }}
                                            >
                                                <XAxis type="number" dataKey="desktop" hide />
                                                <YAxis
                                                    dataKey="month"
                                                    type="category"
                                                    tickLine={false}
                                                    tickMargin={10}
                                                    axisLine={false}
                                                    tickFormatter={(value) => value.slice(0, 3)}
                                                />
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={<ChartTooltipContent hideLabel />}
                                                />
                                                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={5} />
                                            </BarChart>
                                        </ChartContainer> */}
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="flex flex-col gap-6">
                                <StrategicInitiativeTracker data={platform.PerformanceData.strategicInitiatives} />
                                <Card>
                                    <CardHeader><CardTitle>Key Performance Indicators</CardTitle></CardHeader>
                                    <CardContent className="grid grid-cols-3 gap-6">
                                        <KpiCard title="Metrics Mentions / 100 Posts" value={platform.PerformanceData.kpis.metricsMentions} />
                                        <KpiCard title="Third-Party Citations" value={platform.PerformanceData.kpis.thirdPartyCitations} />
                                        <KpiCard title="Overall Positive Sentiment" value={`${platform.PerformanceData.kpis.positiveSentiment}%`} />
                                    </CardContent>
                                </Card>
                            </div>
                            <AudienceEngagementProfile data={platform.PerformanceData.audienceEngagement} />
                            <PrimaryContentThemes data={platform.PerformanceData.primaryContentThemes} />
                            <HomepageVsFeed data={platform.PerformanceData.homepageVsFeed} />
                            <BrandVoiceTone data={platform.PerformanceData.brandVoice} />
                            <ContentStrategyGap data={platform.PerformanceData.contentStrategyGap} />
                            <WhiteSpaceOpportunities data={platform.PerformanceData.whiteSpaceOpportunities} />
                            <div className="gap-6 grid md:grid-cols-2 grid-cols-1">
                                <CompetitorPositioningMatrix data={platform.PerformanceData.competitorPositioning} magnaPosition={platform.PerformanceData.magnaPosition} />
                                <StrategySnapshotTable data={platform.PerformanceData.strategySnapshot} />
                            </div>
                        </TabsContent>
                    );
                })}
            </div>
        </Tabs>
    );
}