import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function StrategicInitiativeTracker({ data }: any) {
    return (
        <Card>
            <CardHeader><CardTitle>Strategic Initiative Tracker</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {data.map((item: any) => (
                    <div key={item.name}>
                        <div className="flex justify-between  mb-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.current}% of {item.target}%</p>
                        </div>
                        <Progress className="h-1" value={(item.current / item.target) * 100} />
                        <p className="text-xs  text-muted-foreground mt-1">{item.goal}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}