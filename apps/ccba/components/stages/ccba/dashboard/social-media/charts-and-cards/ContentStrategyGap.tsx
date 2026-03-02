'use client'

import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomChartTooltipContent from "@/components/stages/ccba/dashboard/shared/CustomChartTooltipContent";
import CustomLegend from "../../shared/Legend";

export default function ContentStrategyGap({ data }: any) {
    const { theme } = useTheme();
    const tickColor = theme === 'dark' ? '#888888' : '#333333';
    const gridColor = theme === 'dark' ? '#444444' : '#dddddd';
    const brightGreen = "#7CFC00";

    return (
        <Card>
            <CardHeader><CardTitle>Content Strategy Gap Analysis</CardTitle></CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
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
                        <Legend content={<CustomLegend />} />
                        {/* <Legend
                            verticalAlign="top"
                            wrapperStyle={{ paddingBottom: "20px" }}
                            formatter={(value: any, entry: any) => (
                                <span style={{ color: entry.color }}>{value}</span>
                            )}
                        /> */}
                        <Bar dataKey="Emergent" fill={brightGreen} unit="%" barSize={25} radius={6}>
                            <LabelList
                                dataKey="Emergent"
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
                        <Bar dataKey="Mandated" fill="#3b82f6" unit="%" barSize={25} radius={6}>
                            <LabelList
                                dataKey="Mandated"
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
            </CardContent>
        </Card>
    );
}