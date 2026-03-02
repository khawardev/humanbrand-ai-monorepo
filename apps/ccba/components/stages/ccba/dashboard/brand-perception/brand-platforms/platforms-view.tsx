import { FILTER_CONFIG } from "@/config/brandPerception-config";
import DeliverableSection from "./deliverable-section";
import { useMemo } from "react";
import SubNav from "../navigation/sub-nav";

interface PlatformsViewProps {
    brandPerceptionReport: any;
    filter: any;
    searchQuery: string;
    allExpanded: boolean;
}

export default function PlatformsView({ brandPerceptionReport, filter, searchQuery, allExpanded, currentFilter, setCurrentFilter }: any) {
    const visibleSections = useMemo(() => {
        if (filter === 'all') {
            return Object.entries(FILTER_CONFIG).map(([key, value]:any) => ({
                id: key,
                title: value.label,
                attributes: value.attributes
            }));
        }
        const config = FILTER_CONFIG[filter as Exclude<any, 'all'>];
        return config ? [{ id: filter, title: config.label, attributes: config.attributes }] : [];
    }, [filter]);

    return (
        <div className="space-y-8">
            <SubNav
                currentFilter={currentFilter}
                setCurrentFilter={setCurrentFilter}
            />
            {visibleSections.map((section) => (
                <DeliverableSection
                    key={section.id}
                    title={section.title}
                    attributes={section.attributes}
                    searchQuery={searchQuery}
                    allExpanded={allExpanded}
                    brandPerceptionReport={brandPerceptionReport}
                />
            ))}
        </div>
    );
}