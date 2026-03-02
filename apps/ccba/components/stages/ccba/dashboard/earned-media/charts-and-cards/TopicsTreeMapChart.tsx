'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, Treemap } from 'recharts';

export default function TopicsTreeMapChart({ data }: any) {
    const CustomTreemap = (props: any) => {
        const { x, y, width, height, color, name } = props;
        if (width < 50 || height < 30) return null;
        return (
            <g>
                <rect x={x} y={y} width={width} height={height} style={{ fill: color, stroke: '#121212', strokeWidth: 2 }} />
                <foreignObject x={x + 5} y={y + 5} width={width - 10} height={height - 10}>
                    <div className="text-black text-center flex flex-col justify-center items-center h-full p-1">
                        <p className="font-bold text-sm leading-tight">{name}</p>
                    </div>
                </foreignObject>
            </g>
        );
    };
    const coloredData = data.data.map((item: any) => ({ ...item, color: data.legend[item.sentiment] }));

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Earned Media Topics & Sentiment Tree Map</CardTitle>
                <CardDescription className="text-muted-foreground">Rectangle size represents value hierarchy. Sentiment color shows Positive, Neutral & Challenging.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center gap-4 mb-4">
                    {Object.entries(data.legend).map(([name, color]) => (
                        <div key={name} className="flex items-center gap-2">
                            <div className="w-3 h-3" style={{ backgroundColor: color as string }}></div>
                            <span className="capitalize text-sm">{name}</span>
                        </div>
                    ))}
                </div>
                <ResponsiveContainer width="100%" height={400}>
                    <Treemap data={coloredData} dataKey="size" aspectRatio={4 / 3} stroke="#fff" content={<CustomTreemap />} />
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}