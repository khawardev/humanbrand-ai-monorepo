import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StrategicInsightsTab({ platforms, strategicRecommendations }: any) {
    // const { platforms, strategicRecommendations } = data;
    const platformKeys = Object.keys(platforms);

    return (
        <Tabs defaultValue={platformKeys[0]}>
            <div className="w-full overflow-x-auto">
                <TabsList>
                    {platformKeys.map(key => <TabsTrigger key={key} value={key}>{platforms[key].name}</TabsTrigger>)}
                </TabsList>
            </div>
            <div className="mt-4">
                {platformKeys.map(key => {
                    const platform = platforms[key];
                    const recommendations = strategicRecommendations[key];
                    return (
                        <TabsContent key={key} value={key}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{platform.name} Strategic Recommendations</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {recommendations.map((rec: any, idx: any) => (
                                        <div key={idx} className="border-l-4 p-4 rounded-md border bg-muted/50" >
                                            <h4 className="font-semibold">{rec.recommendation}</h4>
                                            <p className="text-sm text-muted-foreground mt-1">{rec.action}</p>
                                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                                <Badge variant="secondary">Target: {rec.audience}</Badge>
                                                <Badge variant="secondary">Driver: {rec.driver}</Badge>
                                            </div>
                                            <p className="mt-2 text-sm font-medium text-primary">{rec.expectedEffect}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )
                })}
            </div>
        </Tabs>
    );
}