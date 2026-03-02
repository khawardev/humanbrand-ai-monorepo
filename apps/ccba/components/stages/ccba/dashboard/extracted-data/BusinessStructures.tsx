import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function BusinessStructures({ data }: any) {
    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Emergent Business Structures</CardTitle>
                <CardDescription>Automatically discovered product groups and strategic themes from the corpus.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-sm mb-2">Discovered Product Groups</h4>
                    <ScrollArea className="h-full">
                        <Table>
                            <TableBody>
                                {data.discovered_product_groups.map((item: any) => (
                                    <TableRow key={item.product_group}>
                                        <TableCell>{item.product_group}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">{item.count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
                <div>
                    <h4 className="font-semibold text-sm mb-2">Discovered Strategic Themes</h4>
                    <ScrollArea className="h-full">
                        <Table>
                            <TableBody>
                                {data.discovered_strategic_themes.map((item: any) => (
                                    <TableRow key={item.theme}>
                                        <TableCell>{item.theme}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">{item.instance_count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );
}