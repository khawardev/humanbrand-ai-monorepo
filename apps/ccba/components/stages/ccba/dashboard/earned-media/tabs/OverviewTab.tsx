'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CustomChartTooltipContent from '@/components/stages/ccba/dashboard/shared/CustomChartTooltipContent';

export default function OverviewTab({ data }: any) {
    const { auditFoundation, productCoverage, colors } = data;

    const getToneBadgeVariant = (tone: string): "default" | "secondary" | "destructive" | "outline" => {
        switch (tone.toLowerCase()) {
            case 'positive': return 'default';
            case 'challenging': return 'destructive';
            default: return 'secondary';
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Audit Foundation - Source Distribution</CardTitle>
                    <CardDescription>Articles by source type and top publications</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={290}>
                        <BarChart
                            data={auditFoundation}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                            <XAxis type="number" />
                            <YAxis
                                type="category"
                                dataKey="sourceType"
                                axisLine={false}
                                tickLine={false}
                                width={120}
                            />
                            <Tooltip content={<CustomChartTooltipContent />} />
                            <Bar
                                dataKey="percentage"
                                fill={colors.primary}
                                radius={6}
                            />
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="mt-6 space-y-4">
                        {auditFoundation.map((source: any, idx: number) => (
                            <div key={idx} className="border rounded-lg p-3">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-semibold">{source.sourceType}</h4>
                                        <p className="text-sm text-muted-foreground">{source.count} articles ({source.percentage}%)</p>
                                    </div>
                                    {source.sourceType === "Non-independent" && (<Badge variant="secondary">Down-weighted</Badge>)}
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {source.topPublications.map((pub: string, pidx: number) => (
                                        <Badge key={pidx} variant="outline" className="text-xs">{pub}</Badge>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Product Category Coverage</CardTitle>
                    <CardDescription>Dual view: Brand-native and Universal categories</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="native">
                        <TabsList>
                            <TabsTrigger value="native">Brand-Native Categories</TabsTrigger>
                            <TabsTrigger value="universal">Universal Buckets</TabsTrigger>
                        </TabsList>

                        <TabsContent value="native" className="space-y-4">
                            <ResponsiveContainer width="100%" height={290}>
                                <BarChart
                                    data={productCoverage.brandNative}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                                    <XAxis type="number" />
                                    <YAxis
                                        type="category"
                                        dataKey="category"
                                        axisLine={false}
                                        tickLine={false}
                                        width={150}
                                    />
                                    <Tooltip content={<CustomChartTooltipContent />} />
                                    <Bar
                                        dataKey="share"
                                        fill={colors.secondary}
                                        radius={6}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                            {productCoverage.brandNative.map((item: any, idx: number) => (
                                <div key={idx} className="border rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-sm">{item.category}</h4>
                                        <div className="flex gap-2">
                                            <Badge variant={getToneBadgeVariant(item.tone)}>{item.tone}</Badge>
                                            <Badge variant="outline">{item.share}%</Badge>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{item.signal}</p>
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="universal" className="space-y-4">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart
                                    data={productCoverage.universal}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
                                    <XAxis type="number" />
                                    <YAxis
                                        type="category"
                                        dataKey="category"
                                        axisLine={false}
                                        tickLine={false}
                                        width={150}
                                    />
                                    <Tooltip content={<CustomChartTooltipContent />} />
                                    <Bar
                                        dataKey="share"
                                        fill={colors.accent}
                                        radius={6}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                            {productCoverage.universal.map((item: any, idx: number) => (
                                <div key={idx} className="border rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-sm">{item.category}</h4>
                                        <div className="flex gap-2">
                                            <Badge variant={getToneBadgeVariant(item.tone)}>{item.tone}</Badge>
                                            <Badge variant="outline">{item.share}%</Badge>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{item.signal}</p>
                                </div>
                            ))}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </>
    );
}