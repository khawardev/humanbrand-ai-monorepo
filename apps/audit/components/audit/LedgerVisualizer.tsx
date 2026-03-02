"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExternalLink, CheckCircle2, AlertTriangle, Lightbulb, LinkIcon, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LedgerVisualizerProps {
  data: any;
}

export default function LedgerVisualizer({ data }: LedgerVisualizerProps) {
  if (!data) return null;

  // Handle both single ledger and full audit result structures
  const clientLedger = data.clientLedger || (data.schemaVersion ? data : null);
  const competitorLedgers = data.competitorLedgers || [];
  
  if (!clientLedger) {
    return (
       <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Invalid Data</AlertTitle>
          <AlertDescription>
             The analysis data format is not recognized.
          </AlertDescription>
       </Alert>
    );
 }


  return (
    <div className="space-y-6">
      <Tabs defaultValue="visual" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Ledger Analysis</h2>
          <TabsList>
            <TabsTrigger value="visual">Visual View</TabsTrigger>
            <TabsTrigger value="json">Raw JSON</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="visual" className="space-y-8 animate-in fade-in-0 duration-300">
           {/* Summary Stats */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Pages Analyzed" value={clientLedger.input?.pagesCaptured} sub={`Limit: ${clientLedger.input?.pageLimit}`} />
               <StatCard 
                  title="Brand Confidence" 
                  value={clientLedger.inference?.brandName || "Unknown"} 
                  sub={clientLedger.inference?.businessModel || "N/A"}
               />
               <StatCard 
                  title="Readability" 
                  value={clientLedger.stats?.computed?.readabilityGrade ? `Grade ${clientLedger.stats.computed.readabilityGrade}` : "N/A"} 
                  sub="Flesch-Kincaid" 
               />
               <StatCard 
                  title="Tech Density" 
                  value={clientLedger.stats?.computed?.technicalDensityPct ? `${clientLedger.stats.computed.technicalDensityPct}%` : "N/A"} 
                  sub="Specialized Terms" 
               />
           </div>

           {/* Brand Narrative */}
           <SectionCard title="Brand Narrative Signals" icon={<Lightbulb className="w-5 h-5 text-yellow-500"/>}>
              <div className="grid gap-4 md:grid-cols-2">
                 {clientLedger.brandNarrativeSignals?.map((signal: any, idx: number) => (
                    <Card key={idx} className="bg-muted/30 border-dashed">
                       <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                             <CardTitle className="text-sm font-medium uppercase text-muted-foreground">{signal.signal}</CardTitle>
                             <ConfidenceBadge level={signal.confidence} />
                          </div>
                       </CardHeader>
                       <CardContent className="space-y-3 text-sm">
                          {signal.stated?.length > 0 && (
                             <div>
                                <span className="font-semibold text-primary block mb-1">Stated:</span>
                                <p className="italic text-muted-foreground">"{signal.stated[0].text}"</p>
                             </div>
                          )}
                          {signal.emergent?.synthesis && (
                             <div>
                                <span className="font-semibold text-primary block mb-1">Emergent (Synthesized):</span>
                                <p>{signal.emergent.synthesis}</p>
                                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                   <Badge variant="outline" className="text-[10px] h-5">{signal.emergent.recurrenceTag}</Badge>
                                   <span>Found on {signal.emergent.pageCount} pages</span>
                                </div>
                             </div>
                          )}
                       </CardContent>
                    </Card>
                 ))}
              </div>
           </SectionCard>

           {/* Audiences */}
           <SectionCard title="Target Audiences" icon={<CheckCircle2 className="w-5 h-5 text-green-500"/>}>
            <div className="space-y-4">
               {clientLedger.audiences?.map((audience: any, idx: number) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                     <div className="min-w-[200px]">
                        <h4 className="font-semibold text-lg">{audience.name}</h4>
                        <ConfidenceBadge level={audience.confidence} className="mt-2" />
                     </div>
                     <div className="flex-1 space-y-2">
                        <p className="text-sm text-muted-foreground">{audience.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                           {audience.keyPatterns?.map((pattern: string, pIdx: number) => (
                              <Badge key={pIdx} variant="secondary">{pattern}</Badge>
                           ))}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
           </SectionCard>

            {/* Content & Linguistic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <SectionCard title="Content Distribution" icon={<FileText className="w-5 h-5 text-blue-500"/>}>
                  <div className="space-y-3">
                     {clientLedger.contentTypeDistribution?.types?.map((type: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-start text-sm border-b last:border-0 pb-2 last:pb-0">
                           <div>
                              <span className="font-medium">{type.type}</span>
                              <p className="text-xs text-muted-foreground mt-0.5">{type.notes}</p>
                           </div>
                           <Badge variant={type.pages > 0 ? "default" : "outline"}>{type.pages} pages</Badge>
                        </div>
                     ))}
                  </div>
               </SectionCard>
               
               <SectionCard title="Linguistic Profile" icon={<AlertTriangle className="w-5 h-5 text-orange-500"/>}>
                  <div className="space-y-4">
                      {Object.entries(clientLedger.dominantLinguisticCategories || {}).map(([key, value]: [string, any]) => {
                         if (key === 'distributionNarrative') return null;
                         return (
                            <div key={key} className="flex items-center justify-between text-sm">
                               <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                               <div className="flex items-center gap-2">
                                  {value.count !== undefined && <span className="text-muted-foreground">{value.count ?? 0}</span>}
                                  {value.recurrenceTag && <Badge variant="outline">{value.recurrenceTag}</Badge>}
                               </div>
                            </div>
                         )
                      })}
                      {clientLedger.dominantLinguisticCategories?.distributionNarrative && (
                         <div className="mt-4 p-3 bg-muted rounded-md text-xs italic">
                            {clientLedger.dominantLinguisticCategories.distributionNarrative}
                         </div>
                      )}
                  </div>
               </SectionCard>
            </div>

            {/* Machine View (SEO/Meta) */}
             <SectionCard title="Machine View (SEO Signals)" icon={<LinkIcon className="w-5 h-5 text-purple-500"/>}>
                <Accordion type="single" collapsible className="w-full">
                     <AccordionItem value="meta-titles">
                        <AccordionTrigger>Meta Titles Examples</AccordionTrigger>
                        <AccordionContent>
                           <ul className="space-y-2">
                              {clientLedger.machineView?.metaTitleExamples?.map((item: any, idx: number) => (
                                 <NavItem key={idx} item={item} />
                              ))}
                           </ul>
                        </AccordionContent>
                     </AccordionItem>
                     <AccordionItem value="meta-desc">
                        <AccordionTrigger>Meta Descriptions Examples</AccordionTrigger>
                        <AccordionContent>
                           <ul className="space-y-2">
                              {clientLedger.machineView?.metaDescriptionExamples?.map((item: any, idx: number) => (
                                 <NavItem key={idx} item={item} />
                              ))}
                           </ul>
                        </AccordionContent>
                     </AccordionItem>
                     <AccordionItem value="gaps">
                        <AccordionTrigger>Human-Machine Gaps</AccordionTrigger>
                        <AccordionContent>
                           <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                              {clientLedger.machineView?.humanMachineGaps?.map((gap: string, idx: number) => (
                                 <li key={idx}>{gap}</li>
                              ))}
                           </ul>
                        </AccordionContent>
                     </AccordionItem>
                </Accordion>
             </SectionCard>

             {/* Competitors Preview */}
             {competitorLedgers.length > 0 && (
                <div className="pt-8 border-t">
                   <h3 className="text-xl font-bold mb-4">Competitor Intelligence</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {competitorLedgers.map((comp: any, idx: number) => (
                         <Card key={idx}>
                            <CardHeader className="pb-2">
                               <CardTitle className="text-base truncate" title={comp.input?.websiteUrl}>{new URL(comp.input?.websiteUrl).hostname}</CardTitle>
                               <CardDescription className="text-xs">{comp.inference?.categoryHypothesis || "Competitor"}</CardDescription>
                            </CardHeader>
                            <CardContent className="text-xs space-y-2">
                               <div className="flex justify-between">
                                  <span>Stats:</span>
                                  <span>{comp.input?.pagesCaptured} pages</span>
                               </div>
                               <div className="bg-muted p-2 rounded line-clamp-3">
                                  {comp.brandNarrativeSignals?.[0]?.emergent?.synthesis || "No narrative synthesis available."}
                               </div>
                            </CardContent>
                         </Card>
                      ))}
                   </div>
                </div>
             )}

        </TabsContent>

        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle>Raw Ledger Data</CardTitle>
              <CardDescription>Full JSON output from the audit pipeline.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md overflow-x-auto max-h-[800px]">
                <pre className="text-xs font-mono whitespace-pre-wrap text-foreground/80">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- Subcomponents ---

function StatCard({ title, value, sub }: { title: string, value: string | number, sub?: string }) {
   return (
      <Card>
         <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="text-2xl font-bold mt-1">{value}</div>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
         </CardContent>
      </Card>
   )
}

function SectionCard({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
   return (
      <Card>
         <CardHeader>
            <div className="flex items-center gap-2">
               {icon}
               <CardTitle className="text-lg">{title}</CardTitle>
            </div>
         </CardHeader>
         <CardContent>
            {children}
         </CardContent>
      </Card>
   )
}

function ConfidenceBadge({ level, className }: { level: string, className?: string }) {
   const colors: Record<string, string> = {
      "High": "bg-green-100 text-green-800 border-green-200",
      "Medium": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Low": "bg-red-100 text-red-800 border-red-200",
   };
   const colorClass = colors[level] || "bg-gray-100 text-gray-800";
   
   return (
      <Badge variant="outline" className={cn("font-normal border", colorClass, className)}>
         {level} Confidence
      </Badge>
   )
}

function NavItem({ item }: { item: { text: string, url: string } }) {
   return (
      <li className="text-sm border-b last:border-0 pb-2 last:pb-0">
         <div className="font-medium text-foreground/90">{item.text}</div>
         <Link href={item.url} target="_blank" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mt-0.5 truncate">
            <ExternalLink className="w-3 h-3" />
            {item.url}
         </Link>
      </li>
   )
}
