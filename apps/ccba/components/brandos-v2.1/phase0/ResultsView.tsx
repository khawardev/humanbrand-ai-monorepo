"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, FileText, Globe, Image as ImageIcon, MessageSquare, Share2, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ResultsViewProps = {
  ledgerData: any;
};

export function Phase0ResultsView({ ledgerData }: ResultsViewProps) {
  const { evidence_ledger, corpus_manifest, gate_0_result } = ledgerData;
  const metrics = evidence_ledger?.evidence_by_type || {};
  const adequacy = corpus_manifest?.corpus_adequacy;
  const gate = gate_0_result;

  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
            title="Total Evidence" 
            value={parseInt(evidence_ledger?.evidence_count || 0)} 
            icon={<FileText className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatsCard 
            title="Webpages" 
            value={parseInt(metrics.webpage || 0)} 
            icon={<Globe className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatsCard 
            title="Social Posts" 
            value={parseInt(metrics.social_post || 0)} 
            icon={<Share2 className="h-4 w-4 text-muted-foreground" />} 
        />
        <StatsCard 
            title="Comments" 
            value={parseInt(metrics.comment || 0)} 
            icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />} 
        />
      </div>

      {/* Gate Result */}
      <GateStatusCard gate={gate} adequacy={adequacy} />

      {/* Detailed Views */}
      <Tabs defaultValue="evidence" className="space-y-4">
        <TabsList>
          <TabsTrigger value="evidence">Evidence Ledger</TabsTrigger>
          <TabsTrigger value="coverage">Coverage Analysis</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="evidence" className="space-y-4">
          <EvidenceList evidence={evidence_ledger?.evidence || []} />
        </TabsContent>
        
        <TabsContent value="coverage" className="space-y-4">
          <CoverageManifest manifest={corpus_manifest} />
        </TabsContent>

        <TabsContent value="raw" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Raw JSON Output</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-muted p-4 rounded-lg overflow-auto max-h-[600px]">
                        <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                            {JSON.stringify(ledgerData, null, 2)}
                        </pre>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatsCard({ title, value, icon }: { title: string, value: number, icon: any }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

function GateStatusCard({ gate, adequacy }: { gate: any, adequacy: any }) {
    const isPass = gate?.status === 'pass';
    const variant = isPass ? "default" : "destructive";

    return (
        <Card className={cn("border-l-4", isPass ? "border-l-green-500" : "border-l-red-500")}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        {isPass ? <CheckCircle className="text-green-500" /> : <AlertTriangle className="text-red-500" />}
                        Gate 0: Corpus Adequacy
                    </CardTitle>
                    <Badge variant={isPass ? "default" : "destructive"}>{gate?.status?.toUpperCase()}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {gate?.warnings?.length > 0 && (
                     <Alert variant="default" className="bg-amber-50 border-amber-200 text-amber-800">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertTitle>Warnings</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc pl-5 mt-2">
                                {gate.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}
                            </ul>
                        </AlertDescription>
                     </Alert>
                )}
                 {gate?.failures?.length > 0 && (
                     <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Critical Failures</AlertTitle>
                        <AlertDescription>
                            <ul className="list-disc pl-5 mt-2">
                                {gate.failures.map((w: string, i: number) => <li key={i}>{w}</li>)}
                            </ul>
                        </AlertDescription>
                     </Alert>
                )}
                {gate?.recommendation && (
                    <div className="bg-muted p-4 rounded-md">
                        <span className="font-semibold">Recommendation: </span> {gate.recommendation}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function AlertCircle({ className }: { className?: string }) {
    return <AlertTriangle className={className} />;
}


function EvidenceList({ evidence }: { evidence: any[] }) {
    return (
        <div className=" space-y-6">
            <div>
                <h2>Evidence Entries ({evidence.length})</h2>
            </div>
            <div>
                <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                        {evidence.map((item, index) => {
                            const isImage = item.content_type === 'image' || item.source_type === 'image';
                            return (
                                <div key={item.evidence_id || index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">{item.evidence_id}</Badge>
                                            <Badge variant={isImage ? "secondary" : "default"}>
                                                {isImage ? <ImageIcon className="w-3 h-3 mr-1 inline" /> : null}
                                                {item.content_type || item.source_type}
                                            </Badge>
                                            <span className="text-sm font-medium text-muted-foreground capitalize">{item.source_channel}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{new Date(item.source_timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="font-semibold mb-1 truncate">{item.source_entity}</h4>
                                    
                                    {isImage ? (
                                         <div className="flex flex-col gap-2 mt-2 mb-2 p-3 bg-muted/30 rounded-lg border border-dashed">
                                            <div className="flex gap-4">
                                                <div className="h-20 w-20 bg-muted rounded flex items-center justify-center shrink-0 border">
                                                     {/* Start: Simple heuristic for displayable images vs svg/other assets */}
                                                    {item.full_content_uri?.endsWith('.svg') || item.full_content_uri?.startsWith('s3://') ? (
                                                        <ImageIcon className="text-muted-foreground h-8 w-8" />
                                                    ) : (
                                                        <img 
                                                          src={item.full_content_uri} 
                                                          alt="Evidence Asset" 
                                                          className="h-full w-full object-cover rounded"
                                                          onError={(e) => {
                                                              (e.target as HTMLImageElement).style.display = 'none';
                                                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                          }}
                                                        />
                                                    )}
                                                     {/* Fallback Icon if image fails to load (managed via onError above or logic) */}
                                                    <ImageIcon className="text-muted-foreground h-8 w-8 hidden" />
                                                </div>
                                                <div className="space-y-1 overflow-hidden flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[10px] h-5">Asset</Badge>
                                                        <span className="text-xs font-mono text-muted-foreground truncate" title={item.full_content_uri}>
                                                            {item.full_content_uri}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground line-clamp-2">{item.excerpt}</p>
                                                    
                                                    {item.metadata && (
                                                        <div className="flex gap-2 mt-2">
                                                            {item.metadata.page_url && (
                                                                <a href={item.metadata.page_url} target="_blank" className="text-[10px] bg-background border px-1.5 py-0.5 rounded flex items-center gap-1 hover:underline">
                                                                     <Globe className="h-3 w-3" /> Page Context
                                                                </a>
                                                            )}
                                                            {item.metadata.parent_evidence_id && (
                                                                <span className="text-[10px] bg-background border px-1.5 py-0.5 rounded text-muted-foreground">
                                                                    Parent: {item.metadata.parent_evidence_id}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                         </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <p className="text-sm text-foreground/90 whitespace-pre-wrap line-clamp-3 mb-2">
                                                {item.excerpt}
                                            </p>
                                            {item.metadata && (
                                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                    {item.metadata.word_count && (
                                                        <span className="bg-muted px-1.5 py-0.5 rounded">Words: {item.metadata.word_count}</span>
                                                    )}
                                                     {item.metadata.image_count && (
                                                        <span className="bg-muted px-1.5 py-0.5 rounded">Images: {item.metadata.image_count}</span>
                                                    )}
                                                    {item.metadata.has_html && (
                                                        <span className="bg-muted px-1.5 py-0.5 rounded">HTML: Yes</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    
                                    <div className="mt-3 pt-3 border-t flex justify-between items-center text-xs text-muted-foreground">
                                        <div className="flex gap-4">
                                            <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary flex items-center gap-1">
                                                <LinkIcon className="h-3 w-3" /> Source URL
                                            </a>
                                            {item.full_content_uri && item.full_content_uri !== item.source_url && (
                                                 <a href={item.full_content_uri} target="_blank" rel="noopener noreferrer" className="hover:underline text-primary flex items-center gap-1">
                                                    <LinkIcon className="h-3 w-3" /> Full Content
                                                </a>
                                            )}
                                        </div>
                                        <span className="font-mono text-[10px] opacity-70">
                                            ID: {item.evidence_id}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}

function CoverageManifest({ manifest }: { manifest: any }) {
    if (!manifest) return <div>No manifest available</div>;
    const { coverage_summary } = manifest;

    return (
        <div className="grid gap-6 md:grid-cols-2">
             <Card>
                <CardHeader>
                    <CardTitle>Total Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Entities Collected</span>
                            <span className="font-semibold">{coverage_summary?.entities_collected?.length || 0}</span>
                        </div>
                         <div className="flex justify-between">
                            <span>Channels Collected</span>
                            <span className="font-semibold">{coverage_summary?.channels_collected?.length || 0}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Expand later with breakdown per brand if needed */}
        </div>
    );
}
