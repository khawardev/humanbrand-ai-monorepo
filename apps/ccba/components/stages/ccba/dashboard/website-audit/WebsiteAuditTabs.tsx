'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExtractedDataDashboard from "../extracted-data/ExtractedDataDashboard";
import SynthesizedReportsDashboard from "../synthesized-reports/SynthesizedReportsDashboard";

export default function WebsiteAuditTabs({ extractorReport, synthesizerReport, title }: any) {
  return (
    <Tabs defaultValue="extracted_data">
      <TabsList>
        <TabsTrigger value="extracted_data">Extracted Data</TabsTrigger>
        <TabsTrigger value="synthesized_reports">Synthesized Report</TabsTrigger>
      </TabsList>

      <TabsContent value="extracted_data">
        <ExtractedDataDashboard extractorReport={extractorReport} title={title} />
      </TabsContent>

      <TabsContent value="synthesized_reports">
        <SynthesizedReportsDashboard synthesizerReport={synthesizerReport} title={title} />
      </TabsContent>
    </Tabs>
  )
}
