import { MiniAuditReport } from "@/lib/schemas/miniAuditSchema";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertTriangle, XCircle, ExternalLink, Activity, Target, Shield, MousePointer, Cpu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  report: MiniAuditReport;
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <Badge variant="outline">N/A</Badge>;
  let color = "bg-red-500";
  if (score >= 8) color = "bg-green-500";
  else if (score >= 5) color = "bg-yellow-500";
  
  return (
    <div className={cn("px-2 py-1 rounded text-white font-bold text-xs inline-flex items-center gap-1", color)}>
        {score.toFixed(1)}/10
    </div>
  );
}

function ConfidenceBadge({ level }: { level: "High" | "Medium" | "Low" }) {
    const colors = {
        High: "bg-green-100 text-green-800",
        Medium: "bg-yellow-100 text-yellow-800",
        Low: "bg-red-100 text-red-800"
    }
    return <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", colors[level] || "bg-gray-100")}>{level} Confidence</span>
}

export default function StructuredAuditReport({ report }: Props) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 0. Scope & Method */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground"><span className="font-semibold">Methodology:</span> {report.scopeAndMethod.scopeMethod}</p>
        </CardContent>
      </Card>

      {/* 1. Executive Summary */}
      <section>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Activity className="w-6 h-6 text-primary" /> Executive Summary</h2>
        <div className="grid md:grid-cols-2 gap-4">
             <Card className="md:col-span-2 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                    <CardTitle className="text-lg">Category Framing</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg font-medium">{report.executiveSummary?.categoryFraming}</p>
                </CardContent>
             </Card>
             <Card>
                <CardHeader><CardTitle className="text-sm text-muted-foreground">Core Strength</CardTitle></CardHeader>
                <CardContent><p className="font-medium text-green-700 dark:text-green-400">{report.executiveSummary?.coreStrength}</p></CardContent>
             </Card>
             <Card>
                <CardHeader><CardTitle className="text-sm text-muted-foreground">Core Risk</CardTitle></CardHeader>
                <CardContent><p className="font-medium text-red-700 dark:text-red-400">{report.executiveSummary?.coreRisk}</p></CardContent>
             </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm text-muted-foreground">Human-Machine Gap</CardTitle></CardHeader>
                <CardContent><p className="font-medium">{report.executiveSummary?.humanMachineMisalignment}</p></CardContent>
             </Card>
              <Card>
                <CardHeader><CardTitle className="text-sm text-muted-foreground">Highest Leverage Action</CardTitle></CardHeader>
                <CardContent><p className="font-medium text-blue-700 dark:text-blue-400">{report.executiveSummary?.highestLeverageAction}</p></CardContent>
             </Card>
        </div>
      </section>

      {/* 2. Outside-In Entry Test */}
      <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Target className="w-6 h-6 text-primary" /> Outside-In Entry Test</h2>
          <Card>
              <CardContent className="pt-6 grid gap-6">
                  <div className="grid md:grid-cols-2 gap-6">
                      <div>
                          <h3 className="font-semibold mb-2">10-Second Clarity</h3>
                          <p className="text-muted-foreground">{report.outsideInEntryTest?.clarity10s || "N/A"}</p>
                      </div>
                      <div>
                          <h3 className="font-semibold mb-2">Who It's For</h3>
                          <p className="text-muted-foreground">{report.outsideInEntryTest?.whoItsFor || "N/A"}</p>
                      </div>
                  </div>
                  <Separator />
                   <div>
                      <h3 className="font-semibold mb-2">Top Confusions</h3>
                      <ul className="list-disc list-inside text-muted-foreground">
                          {report.outsideInEntryTest?.confusions?.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                  </div>
              </CardContent>
          </Card>
      </section>

      {/* 3. Emergent Brand Profile */}
      <section>
           <h2 className="text-2xl font-bold mb-4">Emergent Brand Profile (Human View)</h2>
           <Card>
               <Table>
                   <TableHeader>
                       <TableRow>
                           <TableHead>Signal</TableHead>
                           <TableHead>Stated (Verbatim)</TableHead>
                           <TableHead>Reinforced (Synthesis)</TableHead>
                           <TableHead className="w-[100px]">Confidence</TableHead>
                       </TableRow>
                   </TableHeader>
                   <TableBody>
                       {report.emergentBrandProfile?.signals?.map((s, i) => (
                           <TableRow key={i}>
                               <TableCell className="font-medium">{s.signal}</TableCell>
                               <TableCell className="text-muted-foreground italic">"{s.stated}"</TableCell>
                               <TableCell>{s.reinforced}</TableCell>
                               <TableCell><ConfidenceBadge level={s.confidence as any} /></TableCell>
                           </TableRow>
                       ))}
                   </TableBody>
               </Table>
           </Card>
      </section>

      {/* 4. Clarity & Audience */}
      <section className="grid md:grid-cols-2 gap-8">
            <div>
                <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
                    Audience Clarity
                    <ScoreBadge score={report.audienceAndOfferClarity?.audienceClarityScore} />
                </h2>
                <div className="space-y-4">
                    {report.audienceAndOfferClarity?.audiences?.map((aud, i) => (
                        <Card key={i}>
                            <CardHeader className="py-4">
                                <CardTitle className="text-base">{aud.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="py-4 pt-0">
                                <p className="text-sm text-muted-foreground">{aud.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
             <div>
                <h2 className="text-xl font-bold mb-4 flex justify-between items-center">
                    Portfolio Clarity
                    <ScoreBadge score={report.audienceAndOfferClarity?.portfolioClarityScore} />
                </h2>
                 <div className="space-y-4">
                    {report.audienceAndOfferClarity?.offers?.map((offer, i) => (
                        <Card key={i}>
                             <CardHeader className="py-4">
                                <CardTitle className="text-base flex items-center justify-between">
                                    {offer.name}
                                    {offer.category && <Badge variant="secondary">{offer.category}</Badge>}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="py-4 pt-0">
                                <p className="text-sm text-muted-foreground">{offer.notes}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
      </section>

      {/* 5. Trust Stack */}
      <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" /> 
            Trust Stack & Proof 
            <ScoreBadge score={report.trustStackAndProof?.trustReadinessScore} />
          </h2>
           <Card className="mb-6">
                <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Key Observations</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {report.trustStackAndProof?.trustPoints?.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {report.trustStackAndProof?.proofInventory?.map((proof, i) => (
                    <Card key={i} className="bg-muted/20">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline">{proof.proofType}</Badge>
                                {proof.nearPrimaryCta && <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Near CTA</Badge>}
                            </div>
                            <p className="font-medium text-sm mb-2">"{proof.example}"</p>
                            <Link href={proof.url} target="_blank" className="text-xs text-primary hover:underline flex items-center gap-1">
                                Source <ExternalLink className="w-3 h-3" />
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
      </section>

      {/* 6. Conversion Path */}
      <section>
           <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <MousePointer className="w-6 h-6 text-primary" />
            Conversion Path 
            <ScoreBadge score={report.conversionPath?.conversionReadinessScore} />
           </h2>
           <div className="grid md:grid-cols-3 gap-6">
               <Card className="md:col-span-2">
                   <CardHeader><CardTitle>Frictions & Quick Fixes</CardTitle></CardHeader>
                   <CardContent>
                       <Table>
                           <TableHeader><TableRow><TableHead>Fix</TableHead><TableHead>Evidence</TableHead></TableRow></TableHeader>
                           <TableBody>
                               {report.conversionPath?.quickFixes?.map((fix, i) => (
                                   <TableRow key={i}>
                                       <TableCell>{fix.fix}</TableCell>
                                       <TableCell>
                                           <div className="flex flex-wrap gap-1">
                                             {fix.evidenceUrls?.map((url, j) => (
                                                  <Link key={j} href={url} target="_blank" className="text-xs text-primary hover:underline block max-w-[150px] truncate">
                                                    {url}
                                                </Link>
                                             ))}
                                           </div>
                                       </TableCell>
                                   </TableRow>
                               ))}
                           </TableBody>
                       </Table>
                   </CardContent>
               </Card>
                <div className="space-y-4">
                     <Card>
                        <CardHeader className="py-4"><CardTitle className="text-sm">Primary Goal</CardTitle></CardHeader>
                        <CardContent className="py-4 pt-0"><p className="font-medium">{report.conversionPath?.primaryConversionGoal || "Unclear"}</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="py-4"><CardTitle className="text-sm">Top CTA Labels</CardTitle></CardHeader>
                        <CardContent className="py-4 pt-0">
                            <div className="flex flex-wrap gap-2">
                                {report.conversionPath?.topCtaLabels?.map((label, i) => (
                                    <Badge key={i} variant="secondary">{label}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
           </div>
      </section>

       {/* 7. Machine View */}
      <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-primary" />
            Machine View
             <ScoreBadge score={report.machineView?.machineViewClarityScore} />
          </h2>
           <Card>
               <Table>
                   <TableHeader>
                       <TableRow>
                           <TableHead>Signal Type</TableHead>
                           <TableHead>Example</TableHead>
                           <TableHead>What it tells Machines</TableHead>
                           <TableHead>Alignment Gap</TableHead>
                       </TableRow>
                   </TableHeader>
                   <TableBody>
                       {report.machineView?.signals?.map((s, i) => (
                           <TableRow key={i}>
                               <TableCell className="font-medium">{s.signalType}</TableCell>
                               <TableCell className="text-xs text-muted-foreground break-all max-w-[200px]">{s.example}</TableCell>
                               <TableCell>{s.whatItTellsMachines}</TableCell>
                               <TableCell className="text-orange-600 dark:text-orange-400">{s.alignmentWithHumanView}</TableCell>
                           </TableRow>
                       ))}
                   </TableBody>
               </Table>
           </Card>
      </section>

      {/* 9. Decision Journey */}
      <section>
          <h2 className="text-2xl font-bold mb-4">Decision Journey Coverage</h2>
          <div className="grid gap-4">
              {report.decisionJourney?.stages?.map((stage, i) => (
                  <Card key={i}>
                      <CardHeader className="py-3 bg-muted/20">
                          <CardTitle className="text-base">{stage.stage}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4 grid md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-xs font-bold uppercase text-muted-foreground">Provides</span>
                                <p>{stage.whatSiteProvides}</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold uppercase text-red-500/80">Gaps</span>
                                <p className="text-muted-foreground">{stage.gaps}</p>
                            </div>
                      </CardContent>
                  </Card>
              ))}
          </div>
      </section>

      {/* 11. Competitive Benchmark */}
      <section>
          <h2 className="text-2xl font-bold mb-4">Competitive Benchmark</h2>
           <Card className="mb-8">
               <CardHeader><CardTitle>First-Impression Comparison</CardTitle></CardHeader>
               <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Brand</TableHead>
                                <TableHead>10s Clarity</TableHead>
                                <TableHead>Primary CTA</TableHead>
                                <TableHead>Trust Posture</TableHead>
                                <TableHead>Differentiation</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {report.competitiveBenchmark?.firstImpressionTable?.map((row, i) => (
                                <TableRow key={i} className={i === 0 ? "bg-primary/5 font-medium" : ""}>
                                    <TableCell>{row.brand}</TableCell>
                                    <TableCell>{row.clarity10s}</TableCell>
                                    <TableCell>{row.primaryCta}</TableCell>
                                    <TableCell>{row.trustPosture}</TableCell>
                                    <TableCell>{row.differentiationCue}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
               </CardContent>
           </Card>
           
           <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Whitespace Analysis</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        {report.competitiveBenchmark?.whiteSpaceAnalysis?.map((space, i) => (
                            <div key={i}>
                                <h4 className="font-bold text-lg mb-1">{space.territoryName}</h4>
                                <p className="text-sm text-muted-foreground mb-2">{space.whyWhitespace}</p>
                                <div className="bg-muted p-3 rounded text-sm">
                                    <span className="font-semibold block mb-1">How to claim:</span>
                                    {space.howClientClaimsIt}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Effectiveness Scorecard</CardTitle></CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Metric</TableHead>
                                    <TableHead>Client</TableHead>
                                    <TableHead>Competitors</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {report.comparativeBrandEffectiveness?.scores?.map((score, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">{score.metric}</TableCell>
                                        <TableCell><ScoreBadge score={score.clientScore} /></TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {score.competitors?.map(c => `${c.name}: ${c.score}`).join(', ')}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
           </div>
      </section>

       {/* 13. Action Framework */}
       <section>
            <h2 className="text-2xl font-bold mb-4">Action Framework</h2>
            <Card className="bg-slate-900 text-slate-50 dark:bg-slate-950">
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-700 hover:bg-slate-900/50">
                                <TableHead className="text-slate-300">Horizon</TableHead>
                                <TableHead className="text-slate-300">Type</TableHead>
                                <TableHead className="text-slate-300">Action Detail</TableHead>
                                <TableHead className="text-slate-300">Metric</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {report.actionFramework?.actions?.map((action, i) => (
                                <TableRow key={i} className="border-slate-700 hover:bg-slate-800/50">
                                    <TableCell className="font-medium text-slate-200">{action.horizon}</TableCell>
                                    <TableCell className="text-slate-400">{action.actionType}</TableCell>
                                    <TableCell className="text-slate-300">
                                        <ul className="list-disc list-inside">
                                            {action.detail?.map((d, k) => <li key={k}>{d}</li>)}
                                        </ul>
                                    </TableCell>
                                    <TableCell className="text-slate-400 font-mono text-xs">{action.metricToWatch}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
       </section>

    </div>
  );
}
