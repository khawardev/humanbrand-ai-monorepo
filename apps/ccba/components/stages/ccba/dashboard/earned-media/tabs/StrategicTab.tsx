import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, ChevronRight, Shield} from 'lucide-react';

export default function StrategicTab({ data }: any) {
    const { strategic, recommendations, brandPositioning, conclusion } = data;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-destructive" />Strategic Risks</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {strategic.risks.map((risk: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-2">
                                    <ChevronRight className="h-4 w-4 mt-0.5 text-destructive" />
                                    <p className="text-sm">{risk}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Check className="h-5 w-5 text-primary" />Opportunities</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {strategic.opportunities.map((opp: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-2">
                                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                                    <p className="text-sm">{opp}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-orange-600" />Blind Spots</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {strategic.blindSpots.map((spot: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-2">
                                    <ChevronRight className="h-4 w-4 mt-0.5 text-orange-600" />
                                    <p className="text-sm">{spot}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Brand Positioning (Media-Ascribed)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="border-l-4 border-primary pl-4">
                            <h4 className="font-semibold mb-1">Ascribed Positioning</h4>
                            <p className="text-sm">{brandPositioning.ascribedPositioning}</p>
                        </div>
                        <div className="border-l-4 border-secondary pl-4">
                            <h4 className="font-semibold mb-1">Third-party Brand Promise</h4>
                            <p className="text-sm">{brandPositioning.thirdPartyBrandPromise}</p>
                        </div>
                        <div className="border-l-4 border-accent pl-4">
                            <h4 className="font-semibold mb-1">Narrative Frames</h4>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {brandPositioning.narrativeFrames.map((frame: any, index: any) => (
                                    <Badge key={index} variant={frame.includes("Contested") ? "secondary" : "default"}>
                                        {frame}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Actionable Recommendations</CardTitle>
                    <CardDescription>Strategic initiatives to improve media positioning</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recommendations.map((rec: any) => (
                            <div key={rec.id} className="border rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold">{rec.id}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold mb-1">{rec.action}</h4>
                                        <p className="text-sm text-muted-foreground">{rec.detail}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Conclusion</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm leading-relaxed">
                        {conclusion}
                    </p>
                </CardContent>
            </Card>
        </>
    );
}