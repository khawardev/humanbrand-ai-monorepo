"use client";

import { useState } from "react";
import { exportToCSV } from "./utils";
import MainNav from "./navigation/main-nav";
import SubNav from "./navigation/sub-nav";
import PlatformsView from "./brand-platforms/platforms-view";
import ImplicationsView from "./strategic-implications/implications-view";
import { EmptyStateCard } from "@/components/shared/CardsUI";



export default function BrandPerceptionDashboard({ brandPerceptionReport }: any) {
    const [currentView, setCurrentView] = useState<any>("platforms");
    const [currentFilter, setCurrentFilter] = useState<any>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [allExpanded, setAllExpanded] = useState(false);

    if (!brandPerceptionReport || Object.keys(brandPerceptionReport).length === 0) {
        return <EmptyStateCard message="Loading report data or no data available." />;
    }

    const primaryBrandName = Object.keys(brandPerceptionReport)[0] || 'Brand';

    const handleExport = () => {
        exportToCSV(brandPerceptionReport, `${primaryBrandName.toLowerCase()}-perception-report.csv`);
    };

    const toggleAllSections = () => {
        setAllExpanded(!allExpanded);
    };

    return (
        <div className="flex flex-col space-y-6">
            <MainNav
                currentView={currentView}
                setCurrentView={setCurrentView}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                allExpanded={allExpanded}
                toggleAllSections={toggleAllSections}
                handleExport={handleExport}
                primaryBrandName={primaryBrandName}
            />
            
            <main>
                {currentView === "platforms" ? (
                    <PlatformsView
                        currentFilter={currentFilter}
                        setCurrentFilter={setCurrentFilter}
                        brandPerceptionReport={brandPerceptionReport}
                        filter={currentFilter}
                        searchQuery={searchQuery}
                        allExpanded={allExpanded}
                    />
                ) : (
                    <ImplicationsView
                        brandPerceptionReport={brandPerceptionReport}
                        filter={currentFilter}
                        searchQuery={searchQuery}
                        allExpanded={allExpanded}
                    />
                )}
            </main>
        </div>
    );
}