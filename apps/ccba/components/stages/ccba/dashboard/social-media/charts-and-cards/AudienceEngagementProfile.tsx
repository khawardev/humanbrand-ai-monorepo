'use client'

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomChartTooltipContent from "@/components/stages/ccba/dashboard/shared/CustomChartTooltipContent";

export default function AudienceEngagementProfile({ data }: any) {
    const chartData = [data.reduce((obj: any, item: any) => {
        obj[item.name] = item.value;
        return obj;
    }, { name: 'engagement' })];

    return (
        <Card>
            <CardHeader><CardTitle>Audience Engagement Profile</CardTitle></CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={80}>
                    <BarChart
                        layout="vertical"
                        data={chartData}
                        stackOffset="expand"
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip content={<CustomChartTooltipContent />} />
                        {data.map((item: any,index:any) => (
                            <Bar
                                key={index}
                                dataKey={item.name}
                                name={`${item.name} (${item.value}%)`}
                                stackId="a"
                                fill={item.color}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
                <p className="text-center text-muted-foreground mt-4 mb-4 text-sm">Share of Engagement (%)</p>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                    {data.map((item: any, index:number) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                            <span>{item.name} ({item.value}%)</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};