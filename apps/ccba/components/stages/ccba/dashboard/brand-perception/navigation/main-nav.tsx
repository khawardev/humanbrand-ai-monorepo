"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Expand, Shrink, Search } from "lucide-react";
import { DashboardHeader } from "../../shared/DashboardComponents";



export default function MainNav({
    currentView,
    setCurrentView,
    searchQuery,
    setSearchQuery,
    allExpanded,
    toggleAllSections,
    handleExport,
    primaryBrandName,
}: any) {
    return (
        <header>
            <DashboardHeader
                title={`${primaryBrandName} - Brand Perception Report`}
                description="Analysis of brand narrative, identity, and strategic foundation against key competitors."
            />
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as any)}>
                    <TabsList>
                        <TabsTrigger value="platforms">Platforms View</TabsTrigger>
                        <TabsTrigger value="implications">Implications View</TabsTrigger>
                    </TabsList>
                </Tabs>
                <div className="flex w-full sm:w-auto items-center gap-2">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-2.5 top-[9px] h-4 w-3 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search content..."
                            className="pl-7 h-8  sm:w-[200px] md:w-[300px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" onClick={toggleAllSections} title={allExpanded ? "Collapse All" : "Expand All"}>
                        {allExpanded ? <Shrink /> : <Expand />}
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleExport} title="Export to CSV">
                        <Download />
                    </Button>
                </div>
            </div>
        </header>
    );
}