import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VerbalIdentity({ data }: any) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Verbal Identity</CardTitle>
                <CardDescription>Linguistic metrics and lexical frequency.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="nouns">
                    <TabsList >
                        <TabsTrigger value="nouns">Top Nouns</TabsTrigger>
                        <TabsTrigger value="verbs">Top Verbs</TabsTrigger>
                        <TabsTrigger value="terms">Proprietary</TabsTrigger>
                    </TabsList>
                    <ScrollArea className="h-72 ">
                        <TabsContent value="nouns">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Noun</TableHead>
                                        <TableHead className="text-right">Count</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.lexical_frequency.top_100_nouns.map((item: any) => (
                                        <TableRow key={item.noun}>
                                            <TableCell className="font-medium">{item.noun}</TableCell>
                                            <TableCell className="text-right">{item.count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                        <TabsContent value="verbs">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Verb</TableHead>
                                        <TableHead className="text-right">Count</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.lexical_frequency.top_100_verbs.map((item: any) => (
                                        <TableRow key={item.verb}>
                                            <TableCell className="font-medium">{item.verb}</TableCell>
                                            <TableCell className="text-right">{item.count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TabsContent>
                        <TabsContent value="terms">
                            <div className="py-4 flex flex-wrap gap-2">
                                {data.lexical_frequency.proprietary_terms.map((term: string) => (
                                    <Badge key={term} variant="secondary">{term}</Badge>
                                ))}
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </CardContent>
        </Card>
    );
}