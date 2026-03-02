"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FILTER_CONFIG } from "@/config/brandPerception-config";

interface SubNavProps {
    currentFilter: any
    setCurrentFilter: (filter: any) => void
}

export default function SubNav({ currentFilter, setCurrentFilter }: SubNavProps) {
    const filters = [
        { value: "all", label: "All Deliverables" },
        ...Object.entries(FILTER_CONFIG).map(([key, value]: any) => ({
            value: key as any,
            label: value.label
        }))
    ];

    return (
        <Tabs
            value={currentFilter}
            onValueChange={(value) => setCurrentFilter(value as any)}
        >
            <TabsList>
                {filters.map((filter) => (
                    <TabsTrigger
                        key={filter.value}
                        value={filter.value}
                    >
                        {filter.label}
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    )
}