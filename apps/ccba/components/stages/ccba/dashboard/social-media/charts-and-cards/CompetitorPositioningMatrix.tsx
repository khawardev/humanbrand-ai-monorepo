'use client'

import { CartesianGrid, Label, LabelList, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomChartTooltipContent from "@/components/stages/ccba/dashboard/shared/CustomChartTooltipContent";

export default function CompetitorPositioningMatrix({ data, magnaPosition }: any) {
    const { theme } = useTheme();
    const gridColor = theme === 'dark' ? '#444444' : '#dddddd';
    const brightGreen = "#7CFC00";
    const points = Array.isArray(data) ? data : [];
    const hasMagna = Boolean(magnaPosition && typeof magnaPosition === 'object');

    return (
        <Card>
            <CardHeader><CardTitle>Competitor Positioning Matrix</CardTitle></CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
                        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                        <XAxis type="number" dataKey="x" domain={[-5, 5]} hide />
                        <YAxis type="number" dataKey="y" domain={[-5, 5]} hide />
                        <Tooltip content={<CustomChartTooltipContent />} />
                        <ReferenceLine x={0} stroke={brightGreen} strokeWidth={2} />
                        <ReferenceLine y={0} stroke={brightGreen} strokeWidth={2} />
                        <Label value="Third-Party Validation" position="top" offset={10}  />
                        <Label value="Internal Showcase" position="bottom" offset={10}  />
                        <Label value="People-First" position="left" angle={-90} offset={20}  />
                        <Label value="Technical Authority" position="right" angle={90} offset={20}  />
                        <Scatter name="Competitors" data={points} fill="#ccc" shape="circle" >
                            <LabelList dataKey="name" position="bottom" fill="#ccc" fontSize="12" offset={8} />
                        </Scatter>
                        <Scatter name="Magna" data={hasMagna ? [magnaPosition] : []} fill={brightGreen} shape='square' >
                            <LabelList dataKey="name" content={({ x, y }: any) => {
                                if (!hasMagna) return null;
                                return (
                                    <foreignObject x={x - 60} y={y - 70} width={120} height={100}>
                                        <div className="bg-accent border rounded-md p-1 text-center shadow-lg">
                                            <p className="text-sm font-bold">{magnaPosition?.name ?? ''}</p>
                                            <p className="text-muted-foreground text-xs">{magnaPosition?.strategy ?? ''}</p>
                                        </div>
                                    </foreignObject>
                                );
                            }} />
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}