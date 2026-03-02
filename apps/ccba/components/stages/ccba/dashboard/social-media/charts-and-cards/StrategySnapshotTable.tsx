import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function StrategySnapshotTable({ data }: any) {
    return (
        <Card>
            <CardHeader><CardTitle>Strategy Snapshot Table</CardTitle></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Competitor</TableHead>
                            <TableHead>Primary Strategy</TableHead>
                            <TableHead>Key Supporting Data Point</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item: any,index:any) => (
                            <TableRow key={index}>
                                <TableCell className="font-semibold">{item.competitor}</TableCell>
                                <TableCell>{item.strategy}</TableCell>
                                <TableCell>{item.dataPoint}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}