'use client'

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomChartTooltipContent from "@/components/stages/ccba/dashboard/shared/CustomChartTooltipContent";

export default function BrandVoiceTone({ data }: any) {
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? '#888888' : '#333333';
    return (
        <Card>
            <CardHeader><CardTitle>Brand Voice & Tone</CardTitle></CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                        accessibilityLayer
                        data={data}
                        layout="vertical"
                        margin={{ left: 140 }}
                    >
                        <XAxis type="number" hide />
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
                            {data.map((entry: any, index: any) => (
                                <Cell key={`cell-${index}`} stroke={'none'} fill={entry.color} />
                            ))}
                            <LabelList
                                dataKey="value"
                                position="right"
                                offset={10}
                                formatter={(value: any) =>
                                    `${value >= 0 ? "(+" : "("}${value}${value >= 0 ? "%)" : ")"}`
                                }
                                fill={tickColor}
                                fontSize={12}
                                fontWeight="bold"
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <p className="text-center text-muted-foreground mt-4 text-sm">Share of Brand Voice Attributes (%)</p>
            </CardContent>
        </Card>
    );
}