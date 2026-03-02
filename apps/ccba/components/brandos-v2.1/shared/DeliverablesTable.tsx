import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface DeliverableItem {
    name: string;
    filename: string;
    schema: string;
    owner: string;
}

export function DeliverablesTable({ items }: { items: DeliverableItem[] }) {
    return (
        <div className="rounded-md border bg-muted">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Artifact</TableHead>
                        <TableHead>Filename</TableHead>
                        <TableHead>Schema</TableHead>
                        <TableHead>Owner</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item, i) => (
                        <TableRow key={i}>
                            <TableCell className="font-medium text-brandos-green">{item.name}</TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">{item.filename}</TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">{item.schema}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className="bg-muted/50">
                                    {item.owner}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
