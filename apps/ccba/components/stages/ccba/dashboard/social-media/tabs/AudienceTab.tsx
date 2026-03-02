'use client'

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomChartTooltipContent from "@/components/stages/ccba/dashboard/shared/CustomChartTooltipContent";
import CustomLegend from "../../shared/Legend";
import { BRAND_SOCIAL_COLOR } from "@/lib/static/dashboardColor";

export default function AudienceTab({ data }: any) {
    const { platforms } = data;
    const { PLATFORM_COLORS } = BRAND_SOCIAL_COLOR;
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
                    const chartData = platform.audienceSegments.map((s: any) => ({ name: s.segment, value: Number(s.share) }));
                    return (
                        <TabsContent key={key} value={key} className="flex flex-col gap-8">
                            <Card>
                                <CardHeader><CardTitle>{platform.name} Audience Segments</CardTitle></CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Segment</TableHead>
                                                <TableHead>Share</TableHead>
                                                <TableHead>Confidence</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {platform.audienceSegments.map((segment: any, idx: any) => (
                                                <TableRow key={idx}>
                                                    <TableCell className="font-medium">{segment.segment}</TableCell>
                                                    <TableCell>{segment.share}%</TableCell>
                                                    <TableCell>
                                                        <Badge variant={segment.confidence === 'H' ? 'default' : segment.confidence === 'M' ? 'secondary' : 'outline'}>
                                                            {segment.confidence === 'H' ? 'High' : segment.confidence === 'M' ? 'Medium' : 'Low'}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Audience Share</CardTitle></CardHeader>
                                <CardContent className="h-[400px] w-full p-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} labelLine={false}>
                                                {chartData.map((entry: any, index: any) => {
                                                    const allColors = Object.values(PLATFORM_COLORS);
                                                    return <Cell key={`cell-${index}`} stroke={'none'} fill={allColors[index % allColors.length] as string} />;
                                                })}
                                            </Pie>
                                            <Tooltip content={<CustomChartTooltipContent />} />
                                            <Legend content={<CustomLegend colors={Object.values(PLATFORM_COLORS)} />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    );
                })}
            </div>
        </Tabs>
    );
}