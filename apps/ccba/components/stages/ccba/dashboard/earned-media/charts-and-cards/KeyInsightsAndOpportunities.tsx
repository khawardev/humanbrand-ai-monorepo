import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function KeyInsightsAndOpportunities({ insights, opportunities }: any) {
    return (
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader><CardTitle>Key Insights</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {insights.map((item: any, index: number) => (
                        <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-accent border">
                            <div className={`flex-shrink-0 w-7 h-7 rounded-full bg-muted-foreground/20 flex items-center justify-center font-semibold `}>{index + 1}</div>
                            <div>
                                <h4 className={`font-semibold text-sm `}>{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Primary Opportunities</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    {opportunities.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-accent border">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                            <p className="font-semibold text-sm">{item.text}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}