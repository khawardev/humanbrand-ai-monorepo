import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function AudienceAndSignals({ audience, signals }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Audience & Nuanced Signals</CardTitle>
                <CardDescription>Audience-oriented language and other subtle linguistic markers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold text-sm mb-2">Audience Cues</h4>
                    <ScrollArea className="text-sm h-42">
                        <div className="flex flex-col space-y-2">
                            {audience.audience_cues.map((cue: any) => (
                                <div key={cue.term} className="flex justify-between items-center">
                                    <span className="text-muted-foreground capitalize">{cue.term}</span>
                                    <span>{cue.count}</span>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
                <Separator />
                <h4 className="font-semibold text-sm mb-2">Value-Laden Words</h4>
                <ScrollArea className="text-sm h-42">
                    <div className="flex flex-col space-y-2">
                        {signals.value_laden_words.map((item: any) => (
                            <div key={item.word} className="flex justify-between items-center">
                                <span className="text-muted-foreground capitalize">{item.word}</span>
                                <span>{item.count}</span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}