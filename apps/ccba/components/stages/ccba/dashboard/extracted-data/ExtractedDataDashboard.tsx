'use client'

import { useMemo } from "react";
import AuditAndCorpusSummary from "./AuditAndCorpusSummary";
import VerbalIdentity from "./VerbalIdentity";
import NarrativeData from "./NarrativeData";
import BusinessStructures from "./BusinessStructures";
import RelationshipMatrix from "./RelationshipMatrix";
import AudienceAndSignals from "./AudienceAndSignals";
import { EmptyStateCard } from "@/components/shared/CardsUI";

export default function ExtractedDataDashboard({ extractorReport, title }: any) {

    if (!extractorReport) {
        return <EmptyStateCard message="No valid extracted data to display." />
    }

    return (
        <div className="space-y-6 w-full ">
            <h2 className="text-xl  font-semibold">
                {title.charAt(0).toUpperCase() + title.slice(1)} Extractor Report
            </h2>
            <AuditAndCorpusSummary
                audit={extractorReport.audit_metadata}
                corpus={extractorReport.corpus_baseline}
            />
            <VerbalIdentity data={extractorReport.verbal_identity_data_points} />
            <NarrativeData data={extractorReport.narrative_data_points} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <BusinessStructures data={extractorReport.emergent_business_structures} />
                <AudienceAndSignals
                    audience={extractorReport.audience_data}
                    signals={extractorReport.nuanced_signals}
                />
            </div>
            <RelationshipMatrix data={extractorReport.relationship_matrix} themes={extractorReport.emergent_business_structures.discovered_strategic_themes} />
        </div>
    );
}