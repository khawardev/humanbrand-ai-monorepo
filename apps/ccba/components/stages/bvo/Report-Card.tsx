"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText, Users } from "lucide-react";

import ExtractedDataDashboard from "../ccba/dashboard/extracted-data/ExtractedDataDashboard";
import { parseJsonFromMarkdown } from "@/lib/static/jsonParser";
import { EmptyStateCard } from "@/components/shared/CardsUI";
import { MarkdownViewer } from "@/components/shared/MarkdownViewer";



interface ReportCardProps {
    report: any;
    reportType: "website" | "social";
    isSelected: boolean;
    onSelect: () => void;
}

export function ReportCard({
    report,
    reportType,
    isSelected,
    onSelect,
}: ReportCardProps) {
    const isWebsiteReport = reportType === "website";

    const getTitle = () => {
        if (isWebsiteReport) {
            return report.batch_name || "Website Analysis Report";
        }
        return `${report.brand_reports[0]?.entity_name} - ${report.brand_reports[0]?.platform} Report`;
    };

    const getFormattedDate = () => {
        const date = new Date(report.created_at);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const renderWebsiteReportContent = (data: any, isCompetitor = false) => {
        const extractionData = parseJsonFromMarkdown(isCompetitor ? data.extraction_report?.response : data.brand_extraction?.response || '{}');
        const synthesisData = isCompetitor ? data.synthesizer_report?.response : data.brand_synthesizer?.response || 'No synthesis data available.';


        return (
            <Tabs defaultValue="synthesis" className="w-full">
                <TabsList>
                    <TabsTrigger value="synthesis">Synthesizer Report</TabsTrigger>
                    <TabsTrigger value="extraction">Extraction Report</TabsTrigger>
                </TabsList>
                <TabsContent value="synthesis" className="mt-4">
                    <MarkdownViewer content={synthesisData} />
                </TabsContent>
                <TabsContent value="extraction" className="mt-4">
                    <ExtractedDataDashboard extractorReport={extractionData} title={''} />
                </TabsContent>
            </Tabs>
        );
    };

    const renderSocialReportContent = (data: any, isCompetitor = false) => {
        const reports = isCompetitor ? data.reports : data.brand_reports;

        if (!reports || reports.length === 0) {
            return <EmptyStateCard message="No social media analysis available." />;
        }

        return (
            <Accordion type="single" collapsible className="w-full" defaultValue={reports[0]?.platform}>
                {reports.map((platformReport: any, index: number) => (
                    <AccordionItem value={platformReport.platform || `item-${index}`} key={index}>
                        <AccordionTrigger className="capitalize">
                            {platformReport.platform} ({platformReport.entity_name})
                        </AccordionTrigger>
                        <AccordionContent>
                            <MarkdownViewer content={platformReport.analysis} />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        );
    };

    const renderDialogContent = () => {
        const competitorReports = report.competitor_reports || [];
        const hasCompetitors = competitorReports.length > 0;

        return (
            <Tabs defaultValue="brand-report" className="w-full">
                {hasCompetitors && (
                    <TabsList>
                        <TabsTrigger value="brand-report">Brand Report</TabsTrigger>
                        {competitorReports.map((comp: any) => (
                            <TabsTrigger key={comp.competitor_id || comp.competitor_name} value={comp.competitor_id || comp.competitor_name}>
                                {isWebsiteReport ? `Competitor Report` : comp.competitor_name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                )}

                <TabsContent value="brand-report">
                    {isWebsiteReport
                        ? renderWebsiteReportContent(report)
                        : renderSocialReportContent(report)}
                </TabsContent>

                {competitorReports.map((comp: any) => (
                    <TabsContent key={comp.competitor_id || comp.competitor_name} value={comp.competitor_id || comp.competitor_name}>
                        {isWebsiteReport
                            ? renderWebsiteReportContent(comp, true)
                            : renderSocialReportContent(comp, true)}
                    </TabsContent>
                ))}
            </Tabs>
        );
    };

    return (
        <Dialog>
            <Card
                className={`flex flex-col h-full cursor-pointer transition-colors  ${isSelected ? 'border-primary  bg-primary/20 border-2 ' : 'border-border '}`}
                onClick={onSelect}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium pr-4 truncate">{getTitle()}</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex flex-col justify-between">
                    <div>
                        <div className="text-xs ">
                            {getFormattedDate()}
                        </div>
                        <p className="text-xs   mt-2 truncate">
                            ID: {report.report_batch_id}
                        </p>
                    </div>
                    <div className="flex items-center justify-end mt-4">
                        <DialogTrigger asChild>
                            <button
                                className="text-sm text-primary hover:underline"
                                onClick={(e) => e.stopPropagation()}
                            >
                                View Details
                            </button>
                        </DialogTrigger>
                    </div>
                </CardContent>
            </Card>
            <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>
                        {isWebsiteReport ? 'Website Report Details' : 'Social Media Report Details'}
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[55vh] overflow-x-auto relative">
                    {renderDialogContent()}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}