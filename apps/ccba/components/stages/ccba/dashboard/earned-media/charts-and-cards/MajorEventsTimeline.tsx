import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MajorEventsTimeline({ data }: any) {
    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader><CardTitle>Major Events Timeline</CardTitle></CardHeader>
            <CardContent>
                <div className="relative w-full h-[350px] px-8">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted-foreground/30"></div>
                  <span className="absolute top-1/2 left-0 -translate-y-1/2 text-sm">June 2024</span>
                    <span className="absolute top-1/2 right-0 -translate-y-1/2 text-sm">August 2025</span> 
                    {data.events.map((event: any) => (
                        <div key={event.label} className="group absolute -translate-x-1/2" style={{ left: `${event.position}%`, top: event.side === "top" ? "auto" : "50%", bottom: event.side === "top" ? "50%" : "auto" }}>
                            <div className={`absolute left-1/2 w-0.5 bg-muted -translate-x-1/2 ${event.side === "top" ? "top-full h-8" : "bottom-full h-8"}`} />
                            <div className="w-5 h-5 rounded-sm border-2 mx-auto transition-all duration-200 group-hover:scale-125" style={{ backgroundColor: data.legend[event.type], borderColor: data.legend[event.type] }}></div>
                            <div className={`absolute z-50 w-36 text-center bg-card border rounded-md p-1.5 text-sm text-foreground shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${event.side === "top" ? "bottom-[130%] left-1/2 -translate-x-1/2" : "top-[130%] left-1/2 -translate-x-1/2"}`}>
                                <p className="font-bold text-xs" style={{ color: data.legend[event.type] }}>{event.date}</p>
                                <p className="text-xs">{event.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
                    {Object.entries(data.legend).map(([name, color]) => (
                        <div key={name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded" style={{ backgroundColor: color as string }}></div>
                            <span className="text-xs">{name === "Dual" ? "Dual Narrative Success" : name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}