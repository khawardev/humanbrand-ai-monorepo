'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomChartTooltipContent from '@/components/stages/ccba/dashboard/shared/CustomChartTooltipContent';
import CustomLegend from '../../shared/Legend';
import { SCRAPED } from '@/lib/constants';

export default function SentimentTab({ data }: any) {
    const { sentiment, colors } = data;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
                <CardDescription>{SCRAPED} vs Weighted sentiment distribution</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-sm font-semibold mb-3">{SCRAPED} Sentiment</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={sentiment.overall.raw.map((item: any) => ({ name: item.sentiment, value: item.percentage, fill: item.sentiment === 'Positive' ? colors.positive : item.sentiment === 'Neutral' ? colors.neutral : colors.challenging }))} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={80} dataKey="value">
                                    {sentiment.overall.raw.map((entry: any, index: number) => (<Cell key={`cell-${index}`} stroke={'none'} />))}
                                </Pie>
                                <Tooltip content={<CustomChartTooltipContent />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-3">Weighted Sentiment</h4>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={sentiment.overall.weighted.map((item: any) => ({ name: item.sentiment, value: item.percentage, fill: item.sentiment === 'Positive' ? colors.positive : item.sentiment === 'Neutral' ? colors.neutral : colors.challenging }))} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={80} dataKey="value">
                                    {sentiment.overall.weighted.map((entry: any, index: number) => (<Cell key={`cell-${index}`} stroke={'none'} />))}
                                </Pie>
                                <Tooltip content={<CustomChartTooltipContent />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <Separator className="my-6" />
                <div>
                    <h4 className="text-sm font-semibold mb-3">Sentiment by Region</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                            data={sentiment.byRegion}
                            layout="horizontal" 
                            margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                            <XAxis type="category" dataKey="region" axisLine={false} tickLine={false} />
                            <YAxis type="number" domain={[0, 50]} />
                            <Tooltip
                                formatter={(value: any) => `${value}%`}
                                content={<CustomChartTooltipContent />}
                            />
                            <Legend content={<CustomLegend colors={Object.values(colors)} />} />
                            <Bar
                                dataKey="positive"
                                fill={colors.positive}
                                name="Positive %"
                                radius={[6, 6, 6, 6]}
                            />
                            <Bar
                                dataKey="neutral"
                                fill={colors.neutral}
                                name="Neutral %"
                                radius={[6, 6, 6, 6]}
                            />
                            <Bar
                                dataKey="challenging"
                                fill={colors.challenging}
                                name="Challenging %"
                                radius={[6, 6, 6, 6]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <Separator className="my-6" />
                <div>
                    <h4 className="text-sm font-semibold mb-3">Sentiment by Outlet Class</h4>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                            data={sentiment.byOutlet}
                            layout="horizontal"
                            margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                            <XAxis type="category" dataKey="outlet" axisLine={false} tickLine={false} />
                            <YAxis type="number" domain={[0, 100]} />
                            <Tooltip
                                formatter={(value: any) => `${value}%`}
                                content={<CustomChartTooltipContent />}
                            />
                            <Legend content={<CustomLegend colors={Object.values(colors)} />} />
                            <Bar
                                dataKey="positive"
                                fill={colors.positive}
                                name="Positive"
                                radius={6}
                            />
                            <Bar
                                dataKey="neutral"
                                fill={colors.neutral}
                                name="Neutral"
                                radius={6}
                            />
                            <Bar
                                dataKey="challenging"
                                fill={colors.challenging}
                                name="Challenging"
                                radius={6}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        {sentiment.byOutlet.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <span className="font-medium w-32">{item.outlet}</span>
                                <div className="flex gap-4">
                                    <span className="text-primary">Pos: {item.positive}%</span>
                                    <span className="text-gray-600">Neu: {item.neutral}%</span>
                                    <span className="text-red-600">Chal: {item.challenging}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Separator className="my-6" />
                <div>
                    <h4 className="text-sm font-semibold mb-3">Representative Quotes</h4>
                    <div className="space-y-4">
                        {sentiment.quotes.map((quote: any, idx: number) => (
                            <div key={idx} className="border rounded-lg p-4">
                                <Badge variant={quote.type === 'Positive' ? 'default' : 'destructive'} className="mb-2">{quote.type}</Badge>
                                <blockquote className="italic text-sm mb-2">"{quote.quote}"</blockquote>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>— {quote.author}</span>
                                    <span>{quote.source}, {quote.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}