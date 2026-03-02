"use client";

import { useState, useEffect, useMemo } from "react";
import { getAttributeLabel, cn } from "../utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";


export default function BrandTable({ brandPerceptionReport, attributes, searchQuery, allExpanded }: any) {
    const [expandedCells, setExpandedCells] = useState<Set<string>>(new Set());

    const brands = useMemo(() => Object.keys(brandPerceptionReport), [brandPerceptionReport]);
    const primaryBrand = brands[0];

    useEffect(() => {
        if (allExpanded) {
            const allCells = new Set<string>();
            attributes.forEach((attr:any) => {
                brands.forEach(brand => {
                    allCells.add(`${attr}-${brand}`);
                });
            });
            setExpandedCells(allCells);
        } else {
            setExpandedCells(new Set());
        }
    }, [allExpanded, attributes, brands]);

    const toggleCell = (cellId: string) => {
        setExpandedCells(prevExpanded => {
            const newExpanded = new Set(prevExpanded);
            if (newExpanded.has(cellId)) {
                newExpanded.delete(cellId);
            } else {
                newExpanded.add(cellId);
            }
            return newExpanded;
        });
    };

    const highlightText = (text: string) => {
        if (!searchQuery) return text;
        const regex = new RegExp(`(${searchQuery})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, index) =>
            regex.test(part) ? <span key={index} className="bg-primary/30 font-semibold">{part}</span> : part
        );
    };

    const renderCellContent = (data: any, attr: any, brand: string) => {
        const cellId = `${attr}-${brand}`;
        const isExpanded = expandedCells.has(cellId);
        const content = data?.text;

        if (!content) return <span className="text-muted-foreground">Data not available</span>;

        if (Array.isArray(content)) {
            return (
                <div>
                    <button onClick={() => toggleCell(cellId)} className="flex items-center gap-1 mb-2 text-left">
                        {isExpanded ? <ChevronDown className="h-4 w-4 flex-shrink-0" /> : <ChevronRight className="h-4 w-4 flex-shrink-0" />}
                        <span className="text-sm font-medium">View {content.length} items</span>
                    </button>
                    {isExpanded && (
                        <ul className="space-y-2 mt-2">
                            {content.map((item, index) => (
                                <li key={index} className="pl-4 relative before:content-['•'] before:absolute before:left-0">
                                    <span className="text-sm">{highlightText(item)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            );
        }

        return (
            <div className={cn("cursor-pointer transition-all", isExpanded ? "" : "line-clamp-3")} onClick={() => toggleCell(cellId)}>
                <span className="text-sm">{highlightText(content)}</span>
            </div>
        );
    };

    return (
        <Card className="p-0 overflow-x-auto">
            <Table className="w-full border-collapse" >
                <TableHeader>
                    <TableRow>
                        <TableHead className="sticky left-0 bg-background z-10">Attribute</TableHead>
                        {brands.map((brand) => (
                            <TableHead key={brand} className={cn("font-semibold min-w-[200px]", brand === primaryBrand && "text-primary bg-primary/5")}>
                                {brand}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {attributes.map((attr: any) => (
                        <TableRow key={attr}>
                            <TableCell className="sticky left-0 bg-background z-10 font-medium">
                                {getAttributeLabel(attr)}
                            </TableCell>
                            {brands.map((brand) => (
                                <TableCell key={`${attr}-${brand}`} className={cn("align-top whitespace-normal ", brand === primaryBrand && "bg-primary/5")}>
                                    {renderCellContent(brandPerceptionReport[brand]?.[attr], attr, brand)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}