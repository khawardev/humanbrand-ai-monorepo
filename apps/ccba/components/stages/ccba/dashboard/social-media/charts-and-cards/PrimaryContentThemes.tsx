import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrimaryContentThemes({ data }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Primary Content Themes</CardTitle>
                <CardDescription>Share of Posts (%)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap justify-center mb-4 text-muted-foreground gap-x-4">
                    {data.map((theme: any) => (
                        <div key={theme.name} className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: theme.color }} />
                            <span className="text-sm">{theme.name} ({theme.value}%)</span>
                        </div>
                    ))}
                </div>
                <div className="w-full">
                    <div className="flex h-20">
                        <div style={{ width: `${data[0].value}%`, backgroundColor: data[0].color }} className="border-2 flex items-center justify-center font-bold text-center p-1 text-sm">{data[0].name} ({data[0].value}%)</div>
                        <div style={{ width: `${data[1].value}%`, backgroundColor: data[1].color }} className="border-2 flex items-center justify-center font-bold text-center p-1 text-sm text-black">{data[1].name} ({data[1].value}%)</div>
                    </div>
                    <div className="h-20" style={{ backgroundColor: data[2].color }}>
                        <div className="border-2 h-full flex items-center justify-center font-bold text-center p-1 text-sm">{data[2].name} ({data[2].value}%)</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}