import SourceMixChart from "../charts-and-cards/SourceMixChart";
import TopicsTreeMapChart from "../charts-and-cards/TopicsTreeMapChart";
import BrandNativeCoverageChart from "../charts-and-cards/BrandNativeCoverageChart";
import MandatedDriversChart from "../charts-and-cards/MandatedDriversChart";
import StrengthsAndRisks from "../charts-and-cards/StrengthsAndRisks";
import MajorEventsTimeline from "../charts-and-cards/MajorEventsTimeline";
import KeyInsightsAndOpportunities from "../charts-and-cards/KeyInsightsAndOpportunities";

export default function V4Tab({ data }: any) {
    return (
        <div className="flex flex-col gap-8">
            <SourceMixChart data={data.sourceMix} />
            <TopicsTreeMapChart data={data.topicsTreeMap} />
            <BrandNativeCoverageChart data={data.brandNativeCoverage} />
            <MandatedDriversChart data={data.mandatedBusinessDrivers} />
            <StrengthsAndRisks strengths={data.strengths} risks={data.risks} />
            <MajorEventsTimeline data={data.timeline} />
            <KeyInsightsAndOpportunities insights={data.keyInsights} opportunities={data.opportunities} />
        </div>
    );
}