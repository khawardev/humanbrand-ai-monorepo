import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StrengthsAndRisks({ strengths, risks }: any) {
    return (
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader><CardTitle>Strengths & Positive Narratives</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {strengths.map((item: any, index: number) => (
                        <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-accent border">
                            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-muted-foreground/10 flex items-center justify-center font-semibold">{index + 1}</div>
                            <div>
                                <h4 className="font-semibold text-sm">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Risks & Challenging Narratives</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {risks.map((item: any, index: number) => (
                        <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-accent border">
                            <div className={`flex-shrink-0 w-7 h-7 rounded-full bg-muted-foreground/10 flex items-center justify-center font-semibold `}>{index + 1}</div>
                            <div>
                                <h4 className={`font-semibold text-sm`}>{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}