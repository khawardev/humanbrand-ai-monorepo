import BrandTable from "./brand-table";



export default function DeliverableSection({
    title,
    attributes,
    searchQuery,
    allExpanded,
    brandPerceptionReport
}: any) {
    return (
        <div className="space-y-4">
            <h3 className=" text-lg font-semibold tracking-tight">
                {title}
            </h3>
            <BrandTable
                attributes={attributes}
                searchQuery={searchQuery}
                allExpanded={allExpanded}
                brandPerceptionReport={brandPerceptionReport}
            />
        </div>
    );
}