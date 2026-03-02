import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function HomepageVsFeed({ data }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Homepage Promise vs. Feed Reality</CardTitle>
                <CardDescription>How well the brand's strategic claims are reflected in its social content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
                <div className="flex justify-between items-center text-muted-foreground">
                    <span className="text-sm">Homepage Claim</span>
                    <span className="text-sm">Share of Posts</span>
                </div>
                <Separator />
                {data.map((item: any, index:number) => (
                    <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{item.claim}</span>
                            <span className="font-bold">{item.value}%</span>
                        </div>
                        <div className="w-full bg-border h-1 rounded-full">
                            <div className="h-1 rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }}></div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}