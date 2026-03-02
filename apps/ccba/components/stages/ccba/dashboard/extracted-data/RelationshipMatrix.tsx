import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function RelationshipMatrix({ data, themes }: any) {
    if (!data || Object.keys(data).length === 0) return null;

    const themeNames = themes.map((t: any) => t.theme);
    const productGroups = Object.keys(data);

    const getColor = (value: number) => {
        if (value === 0) return "bg-transparent";
        if (value === 1) return "bg-primary/10 dark:bg-primary/40";
        if (value === 2) return "bg-primary/20 dark:bg-primary/50";
        if (value >= 3) return "bg-primary/30 dark:bg-primary/60";
        return "bg-transparent";
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Product & Theme Relationship Matrix</CardTitle>
                <CardDescription>
                    Co-occurrence count between discovered product groups and strategic themes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-semibold">Product Group</TableHead>
                                {themeNames.map((theme: string) => (
                                    <TableHead key={theme} className="text-center whitespace-pre-wrap">{theme}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {productGroups.map((group: string) => (
                                <TableRow key={group}>
                                    <TableCell className="font-medium  whitespace-pre-wrap">{group}</TableCell>
                                    {themeNames.map((theme: string) => (
                                        <TableCell key={theme} className="text-center">
                                            <div className={cn("rounded-md p-2  w-full", getColor(data[group][theme]))}>
                                                {data[group][theme]}
                                            </div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}