'use client'

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "next-themes";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomChartTooltipContent from "@/components/stages/ccba/dashboard/shared/CustomChartTooltipContent";

export default function ContentDriversTab({ data }: any) {
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? '#888888' : '#333333';
    const gridColor = theme === 'dark' ? '#84cc16' : '#000000';

    const { platforms } = data;
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
                    const chartData = platform.topDrivers.map((d: any) => ({ name: d.driver, value: Number(d.lift) }));
                    return (
                        <TabsContent key={key} value={key} className="flex flex-col gap-8">
                            <Card>
                                <CardHeader><CardTitle>Top Content Drivers</CardTitle></CardHeader>
                                <CardContent>
                                    <ul className="space-y-4">
                                        {platform.topDrivers.map((driver: any, idx: any) => (
                                            <li key={idx} className="flex items-start justify-between p-3 bg-border/50 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{driver.driver}</p>
                                                    <p className="text-sm text-muted-foreground">{driver.example}</p>
                                                </div>
                                                <Badge variant="destructive">+{driver.lift}%</Badge>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Driver Lift Comparison</CardTitle></CardHeader>
                                <CardContent className="h-[400px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={chartData}
                                            layout="vertical"
                                            margin={{ left: 40 }}
                                        >
                                            <XAxis type="number" hide />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                tick={{ fontSize: 14, fill: tickColor }}
                                                width={150}
                                            />
                                            <Tooltip content={<CustomChartTooltipContent  />} />
                                            <Bar dataKey="value" name="Lift" unit="%" radius={8}>
                                                {chartData.map((entry: any, index: number) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.value >= 0 && gridColor as any }
                                                    />
                                                ))}
                                                <LabelList
                                                    dataKey="value"
                                                    position="right"
                                                    offset={10}
                                                    formatter={(value: any) => `${value >= 0 ? '(+' : '('}${value}${value >= 0 ? '%)' : ')'}`}
                                                    fill={tickColor}
                                                    fontSize={12}
                                                    fontWeight="bold"
                                                />
                                            </Bar>
                                        </BarChart>
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