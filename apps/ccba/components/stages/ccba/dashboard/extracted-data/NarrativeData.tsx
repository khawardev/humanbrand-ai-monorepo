import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NarrativeData({ data }: any) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Narrative Data Points</CardTitle>
                <CardDescription>Key verbs and future-facing statements.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="verbs">
                    <TabsList>
                        <TabsTrigger value="verbs">Action Verbs</TabsTrigger>
                        <TabsTrigger value="statements">Future Statements</TabsTrigger>
                    </TabsList>
                    <ScrollArea className="h-72">
                        <TabsContent value="verbs">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Verb</TableHead>
                                        <TableHead>Example Quote</TableHead>
                                        <TableHead className="text-right">Count</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.action_verbs.map((item: any, index: number) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.verb}</TableCell>
                                            <TableCell className="text-muted-foreground  whitespace-pre-wrap text-sm italic">"{item.quotes[0]}"</TableCell>
                                            <TableCell className="text-right">{item.count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                        <TabsContent value="statements">
                            <div className="space-y-4 p-1">
                                {data.future_statements.map((item: any, index: number) => (
                                    <blockquote key={index} className="border-l-2  whitespace-pre-wrap pl-4 wrap-break-word italic text-sm text-muted-foreground">
                                        "{item.quote}"
                                    </blockquote>
                                ))}
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </CardContent>
        </Card>
    );
}