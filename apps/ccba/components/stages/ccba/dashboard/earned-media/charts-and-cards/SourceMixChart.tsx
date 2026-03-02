'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import CustomChartTooltipContent from '@/components/stages/ccba/dashboard/shared/CustomChartTooltipContent';

export default function SourceMixChart({ data }: any) {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader><CardTitle>Earned Media Source Mix & Coverage</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={data.data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120}>
                                {data.data.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} stroke={'none'} />)}
                            </Pie>
                            <Tooltip content={<CustomChartTooltipContent />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <h3 className="font-semibold mb-4">Top Media-Ascribed Pillars</h3>
                    <div className="space-y-4">
                        {data.data.map((item: any) => (
                            <div key={item.name}>
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 " style={{ backgroundColor: item.color, border: item.color === '#FAFAFA' ? '1px solid #555' : 'none' }}></div>
                                        <span>{item.name}</span>
                                    </div>
                                    <span className="font-bold">{item.value}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-1">
                                    <div className="h-1 rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}