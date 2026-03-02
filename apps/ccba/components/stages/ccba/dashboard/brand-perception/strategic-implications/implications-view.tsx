"use client"

import { useEffect, useMemo, useState } from "react";
import { getAttributesByFilter, getAttributeLabel } from "../utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ImplicationCard from "./implication-card";


export default function ImplicationsView({ brandPerceptionReport, filter, searchQuery, allExpanded }: any) {
    const [expandedValues, setExpandedValues] = useState<string[]>([]);

    const attributes:any = useMemo(() => getAttributesByFilter(filter), [filter]);

    useEffect(() => {
        if (allExpanded) {
            setExpandedValues(attributes);
        } else {
            setExpandedValues(attributes.length > 0 ? [attributes[0]] : []);
        }
    }, [allExpanded, attributes]);

    if (!attributes.length) {
        return (
            <div className="text-center text-muted-foreground py-10">
                Please select a deliverable category to view implications.
            </div>
        );
    }

    return (
        <Accordion type="multiple" value={expandedValues} onValueChange={setExpandedValues} className="w-full space-y-4">
            {attributes.map((attr: any) => (
                <AccordionItem key={attr} value={attr} className="shadow-sm rounded-xl bg-linear-to-t to-background/30 from-muted dark:from-muted/50 dark:border-border border border-zinc-300 shadow-zinc-950/10 duration-200">
                    <AccordionTrigger className="px-5 py-3 font-semibold text-left">
                        {getAttributeLabel(attr)} - Strategic Implications
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 px-5 py-6">
                        <ImplicationCard
                            attribute={attr}
                            searchQuery={searchQuery}
                            brandPerceptionReport={brandPerceptionReport}
                        />
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}