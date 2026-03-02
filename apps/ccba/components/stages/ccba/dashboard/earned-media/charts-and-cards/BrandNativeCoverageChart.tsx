'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import CustomChartTooltipContent from '@/components/stages/ccba/dashboard/shared/CustomChartTooltipContent';

export default function BrandNativeCoverageChart({ data }: any) {
    return (
        <Card>
            <CardHeader><CardTitle>Brand-Native Category Coverage</CardTitle></CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/2 relative">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={data.data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2}>
                                {data.data.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} stroke={'none'} />)}
                            </Pie>
                            <Tooltip content={<CustomChartTooltipContent />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 space-y-3">
                    {data.data.map((item: any) => (
                        <div key={item.name} className="flex items-center">
                            <div className="w-3 h-3 rounded mr-3" style={{ backgroundColor: item.color }}></div>
                            <span className="text-sm">{item.name}: {item.value}%</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}