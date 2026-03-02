'use client'

import CustomChartTooltipContent from '@/components/stages/ccba/dashboard/shared/CustomChartTooltipContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function MandatedDriversChart({ data }: any) {
    return (
        <Card>
            <CardHeader><CardTitle>Mandated Business Drivers</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-5">
                    {data.data.map((driver: any) => (
                        <div key={driver.name} className="relative">
                            <div className="flex justify-between items-center text-sm mb-1">
                                <span>{driver.name}</span>
                                <span className="font-bold">{driver.total}%</span>
                            </div>
                            <ResponsiveContainer width="100%" height={4}>
                                <BarChart layout="vertical" data={[driver]} barCategoryGap={0} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                    <XAxis type="number" hide domain={[0, 100]} />
                                    <YAxis type="category" dataKey="name" hide />
                                    <Tooltip content={<CustomChartTooltipContent />} />
                                    <Bar dataKey="positive" stackId="a" fill={data.legend.positive} radius={6} />
                                    <Bar dataKey="challenging" stackId="a" fill={data.legend.challenging} radius={6} />
                                    <Bar dataKey="neutral" stackId="a" fill={data.legend.neutral} radius={6} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-4 mt-6">
                    {Object.entries(data.legend).map(([name, color]) => (
                        <div key={name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: color as string }}></div>
                            <span className="capitalize text-xs">{name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}