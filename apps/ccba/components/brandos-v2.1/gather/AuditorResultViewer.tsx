'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { RefreshCw, Lightbulb, Target, Users, Megaphone, CheckCircle, FileText, BarChart3, Check, Terminal, ExternalLink, ArrowRight, Layout, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface AuditorResultViewerProps {
    data: any; // Auditor Output JSON
    onReRun?: () => void;
    isReRunning?: boolean;
}

export function AuditorResultViewer({ data, onReRun, isReRunning = false }: AuditorResultViewerProps) {
    if (!data || !data.verbal_bedrock) return null;

    const { verbal_bedrock } = data;

    // Destructuring based on new schema
    const metadata = verbal_bedrock.verbal_audit_metadata || {};
    const narrative = verbal_bedrock.narrative_data_points || {};
    const themes = verbal_bedrock.emergent_themes || {};
    const positioning = verbal_bedrock.positioning_markers || {};
    const proof = verbal_bedrock.proof_points || {};
    const audience = verbal_bedrock.audience_markers || {};
    const baseline = verbal_bedrock.corpus_baseline || {};
    const ctas = verbal_bedrock.calls_to_action || {};

    return (
        <div className="space-y-6 w-full max-w-full overflow-x-hidden animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex justify-between items-center pb-2 border-b">
                <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-brand-lime" />
                        Verbal Identity Audit
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Analyzed {metadata.source_url ? new URL(metadata.source_url).hostname : 'Website Content'} • {new Date(metadata.audit_date || Date.now()).toLocaleDateString()}
                    </p>
                </div>
                {onReRun && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onReRun}
                        disabled={isReRunning}
                        className="gap-2"
                    >
                        <RefreshCw className={cn("w-4 h-4", isReRunning && "animate-spin")} />
                        {isReRunning ? "Running..." : "Re-run Analysis"}
                    </Button>
                )}
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card >
                    <CardHeader >
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <FileText className="h-3.5 w-3.5" /> Pages
                        </CardTitle>
                    </CardHeader>
                    <CardContent >
                        <div className="text-2xl font-bold">{data.scraped_urls_count || 'N/A'}</div>
                    </CardContent>
                </Card>
                <Card >
                    <CardHeader >
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <BarChart3 className="h-3.5 w-3.5" /> Words
                        </CardTitle>
                    </CardHeader>
                    <CardContent >
                        <div className="text-2xl font-bold">{parseInt(baseline.total_words_analyzed || '0').toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card >
                    <CardHeader >
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Lightbulb className="h-3.5 w-3.5" /> Themes
                        </CardTitle>
                    </CardHeader>
                    <CardContent >
                        <div className="text-2xl font-bold">{themes.theme_clusters?.length || 0}</div>
                    </CardContent>
                </Card>
                <Card >
                    <CardHeader >
                        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Users className="h-3.5 w-3.5" /> Segments
                        </CardTitle>
                    </CardHeader>
                    <CardContent >
                        <div className="text-2xl font-bold">{audience.industry_sector_focus?.length || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <Accordion type="multiple" defaultValue={["positioning", "narrative", "themes", "audience"]} className="w-full space-y-4">

                {/* Visual Section: Positioning */}
                <AccordionItem value="positioning" className="border rounded-xl px-4 bg-card overflow-hidden shadow-sm">
                    <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500/10 p-2.5 rounded-full text-blue-600 dark:text-blue-400 shrink-0">
                                <Target className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-semibold text-lg">Positioning & Strategy</h4>
                                <p className="text-sm text-muted-foreground font-normal">Brand core statements and value propositions</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 space-y-8">
                        {/* Taglines */}
                        {positioning.taglines_slogans?.length > 0 && (
                            <div className="space-y-3">
                                <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Taglines & Slogans</h5>
                                <div className="flex flex-wrap gap-2">
                                    {positioning.taglines_slogans.map((tag: any, i: number) => (
                                        <div key={i} className="group relative">
                                            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors">
                                                {tag.phrase}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Mission / Vision */}
                        {positioning.mission_vision_statements?.length > 0 && (
                            <div className="space-y-3">
                                <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                    Mission & Vision
                                </h5>
                                <div className="grid gap-3">
                                    {positioning.mission_vision_statements.map((item: any, i: number) => (
                                        <div key={i} className="bg-muted/30 p-4 rounded-lg border text-sm relative group hover:bg-muted/50 transition-colors">
                                            {item.context && <Badge variant="outline" className="mb-2 text-[10px] uppercase tracking-wider">{item.context}</Badge>}
                                            <p className="text-foreground/90 italic font-medium leading-relaxed">"{item.statement}"</p>
                                            {item.source_url && (
                                                <div className="mt-3 pt-3 border-t border-dashed border-border/50">
                                                    <Link href={item.source_url.startsWith('http') ? item.source_url : `https://${item.source_url}`} target="_blank" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors w-fit">
                                                        <ExternalLink className="w-3 h-3" /> Source
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Value Props */}
                        {positioning.value_propositions?.length > 0 && (
                            <div className="space-y-3">
                                <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Value Propositions</h5>
                                <div className="grid gap-2">
                                    {positioning.value_propositions.map((vp: any, i: number) => (
                                        <div key={i} className="text-sm flex gap-3 items-start bg-green-50/50 dark:bg-green-950/10 p-3 rounded-lg border border-green-100 dark:border-green-900/30">
                                            <Check className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                                            <span className="text-foreground/80 leading-snug">{vp.statement}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* Visual Section: Narrative (Words) */}
                <AccordionItem value="narrative" className="border rounded-xl px-4 bg-card overflow-hidden shadow-sm">
                    <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-purple-500/10 p-2.5 rounded-full text-purple-600 dark:text-purple-400 shrink-0">
                                <Megaphone className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-semibold text-lg">Linguistic DNA</h4>
                                <p className="text-sm text-muted-foreground font-normal">Vocabulary, tone, and lexical choices</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 space-y-8">
                        {/* Word Clouds */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Top Adjectives */}
                            <div className="space-y-3">
                                <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                                    Top Adjectives
                                    <span className="text-[10px] font-normal normal-case bg-muted px-2 py-0.5 rounded-full">Count</span>
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                    {(narrative.top_adjectives || []).slice(0, 15).map((item: any, i: number) => (
                                        <Badge key={i} variant="outline" className="text-sm font-normal py-1 pr-1 pl-3 gap-2 hover:bg-muted/50 transition-colors">
                                            {item.word}
                                            <span className="flex items-center justify-center bg-muted text-[10px] font-mono h-5 min-w-5 px-1 rounded-sm text-muted-foreground">{item.frequency || item.count}</span>
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Top Verbs */}
                            <div className="space-y-3">
                                <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                                    Top Verbs
                                    <span className="text-[10px] font-normal normal-case bg-muted px-2 py-0.5 rounded-full">Count</span>
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                    {(narrative.top_verbs || []).slice(0, 15).map((item: any, i: number) => (
                                        <Badge key={i} variant="outline" className="text-sm font-normal py-1 pr-1 pl-3 gap-2 hover:bg-muted/50 transition-colors">
                                            {item.word}
                                            <span className="flex items-center justify-center bg-muted text-[10px] font-mono h-5 min-w-5 px-1 rounded-sm text-muted-foreground">{item.frequency || item.count}</span>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Value Laden Words */}
                        {narrative.value_laden_words?.length > 0 && (
                            <div className="space-y-3 pt-6 border-t border-dashed">
                                <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Value-Laden Vocabulary</h5>
                                <div className="flex flex-wrap gap-2">
                                    {(narrative.value_laden_words || []).slice(0, 20).map((item: any, i: number) => (
                                        <Badge key={i} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 border-0 px-3 py-1">
                                            {item.word}
                                            {(item.frequency || item.count) && <span className="ml-1.5 opacity-60 text-[10px] border-l border-current/20 pl-1.5">x{item.frequency || item.count}</span>}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* Visual Section: Emergent Themes */}
                <AccordionItem value="themes" className="border rounded-xl px-4 bg-card overflow-hidden shadow-sm">
                    <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-500/10 p-2.5 rounded-full text-amber-600 dark:text-amber-500 shrink-0">
                                <Lightbulb className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-semibold text-lg">Emergent Themes</h4>
                                <p className="text-sm text-muted-foreground font-normal">Content pillars and topic distribution</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 space-y-8">
                        {/* Theme Clusters with Progress Bars */}
                        {themes.theme_clusters?.length > 0 && (
                            <div className="grid gap-6">
                                {themes.theme_clusters.map((cluster: any, idx: number) => {
                                    const percentage = Math.round(parseFloat(cluster.share_of_voice || '0') * 100);
                                    return (
                                        <div key={idx} className="space-y-3">
                                            <div className="flex justify-between items-end">
                                                <h5 className="text-sm font-medium flex items-center gap-2">
                                                    {cluster.theme_name}
                                                </h5>
                                                <span className="text-xs font-bold font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{percentage}% SOV</span>
                                            </div>
                                            <Progress value={percentage} className="h-2.5 bg-muted" />
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {cluster.constituent_phrases?.map((phrase: string, pIdx: number) => (
                                                    <span key={pIdx} className="text-[11px] text-muted-foreground bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30 px-2 py-0.5 rounded-full">
                                                        {phrase}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Page Level Concentration */}
                        {themes.page_level_theme_concentration && Object.keys(themes.page_level_theme_concentration).length > 0 && (
                            <div className="pt-6 border-t border-dashed">
                                <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Theme Concentration by Page</h5>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {Object.entries(themes.page_level_theme_concentration).map(([page, pageThemes]: [string, any], i) => (
                                        <div key={i} className="bg-muted/30 p-3 rounded-lg border">
                                            <h6 className="text-xs font-semibold capitalize mb-2 flex items-center gap-2">
                                                <Layout className="w-3 h-3 text-muted-foreground" />
                                                {page.replace(/_/g, ' ')}
                                            </h6>
                                            <div className="flex flex-wrap gap-1">
                                                {Array.isArray(pageThemes) && pageThemes.map((t: string, ti: number) => (
                                                    <span key={ti} className="text-[10px] bg-background border px-1.5 py-0.5 rounded text-muted-foreground">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Frequent Noun Phrases */}
                        {themes.frequent_noun_phrases?.length > 0 && (
                            <div className="pt-6 border-t border-dashed">
                                <h5 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Most Frequent Topics</h5>
                                <div className="flex flex-wrap gap-2">
                                    {themes.frequent_noun_phrases.slice(0, 30).map((phrase: any, i: number) => {
                                        const text = typeof phrase === 'string' ? phrase : phrase.phrase;
                                        const count = typeof phrase === 'string' ? null : phrase.count || phrase.frequency;
                                        return (
                                            <Badge key={i} variant="secondary" className="text-xs font-normal">
                                                {text} {count && <span className="ml-1 opacity-50">({count})</span>}
                                            </Badge>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>

                {/* Visual Section: Audience */}
                <AccordionItem value="audience" className="border rounded-xl px-4 bg-card overflow-hidden shadow-sm">
                    <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-pink-500/10 p-2.5 rounded-full text-pink-600 dark:text-pink-400 shrink-0">
                                <Users className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-semibold text-lg">Audience & Proof</h4>
                                <p className="text-sm text-muted-foreground font-normal">Target segments and credibility markers</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6 space-y-8">
                        {/* Target Audience & Industry Focus */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {audience.target_audience_mentions?.length > 0 && (
                                <div className="space-y-3">
                                    <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Target Segments</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {audience.target_audience_mentions.map((mention: any, i: number) => (
                                            <Badge key={i} variant="outline" className="pl-1 pr-2 py-1 flex gap-1.5 items-center">
                                                <div className="bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 rounded-full p-0.5">
                                                    <Users className="w-3 h-3" />
                                                </div>
                                                <span>{mention.phrase}</span>
                                                {mention.frequency && <span className="text-[10px] text-muted-foreground ml-0.5 font-mono">x{mention.frequency}</span>}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {audience.industry_sector_focus?.length > 0 && (
                                <div className="space-y-3">
                                    <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Sector Focus</h5>
                                    <div className="space-y-2">
                                        {audience.industry_sector_focus.slice(0, 5).map((sector: any, i: number) => (
                                            <div key={i} className="flex items-center justify-between text-sm">
                                                <span className="capitalize">{sector.sector}</span>
                                                {sector.count && (
                                                    <div className="flex items-center gap-2 w-1/2">
                                                        <Progress value={Math.min(parseInt(sector.count) * 2, 100)} className="h-1.5" />
                                                        <span className="text-xs text-muted-foreground w-6 text-right">{sector.count}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {ctas.top_ctas?.length > 0 && (
                            <div className="space-y-3 pt-6 border-t border-dashed">
                                <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Calls to Action (CTAs)</h5>
                                <div className="flex flex-wrap gap-2">
                                    {ctas.top_ctas.map((cta: any, i: number) => (
                                        <Badge key={i} className="bg-pink-600 hover:bg-pink-700 text-white border-0 py-1.5 px-3">
                                            {cta.cta_text || cta.text}
                                            {(cta.frequency && parseInt(cta.frequency) > 1) &&
                                                <span className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded-sm">{cta.frequency}</span>
                                            }
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(proof.statistics_data?.length > 0 || proof.testimonials?.length > 0) && (
                            <div className="space-y-4 pt-6 border-t border-dashed">
                                {proof.statistics_data?.length > 0 && (
                                    <div className="space-y-3">
                                        <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Statistical Proof Points</h5>
                                        <div className="grid gap-2">
                                            {proof.statistics_data.map((stat: any, i: number) => (
                                                <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-green-50/50 p-3 rounded-lg border border-green-100 dark:bg-green-900/10 dark:border-green-900/30 gap-1">
                                                    <div className="flex gap-2 items-start">
                                                        <PieChart className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                                        <span className="text-sm font-medium text-green-800 dark:text-green-300">{stat.claim || stat.statement}</span>
                                                    </div>
                                                    {stat.context && <Badge variant="outline" className="w-fit text-[10px] text-muted-foreground border-green-200">{stat.context}</Badge>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {proof.testimonials?.length > 0 && (
                                    <div className="space-y-3 mt-4">
                                        <h5 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Testimonials</h5>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {proof.testimonials.map((item: any, i: number) => (
                                                <div key={i} className="bg-muted/30 p-4 rounded-lg border text-sm flex flex-col justify-between h-full hover:shadow-sm transition-shadow">
                                                    <p className="italic text-muted-foreground mb-3 leading-relaxed">"{item.quote || item.text || item.statement}"</p>
                                                    {item.attribution && (
                                                        <div className="font-semibold text-xs flex items-center gap-1.5 mt-auto pt-3 border-t border-dashed border-border/50 text-foreground">
                                                            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                                                <Users className="w-3 h-3 text-muted-foreground" />
                                                            </div>
                                                            {item.attribution}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div className="mt-8 pt-4 border-t">
                <details className="group">
                    <summary className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors w-fit p-2 rounded-md hover:bg-muted/50">
                        <Terminal className="h-4 w-4" />
                        <span className="font-medium">View Raw JSON</span>
                    </summary>
                    <div className="mt-2 bg-muted/50 rounded-lg overflow-hidden border">
                        <ScrollArea className="h-[300px] w-full">
                            <div className="p-4">
                                <pre className="text-[10px] font-mono whitespace-pre-wrap break-all text-muted-foreground">
                                    {JSON.stringify(data, null, 2)}
                                </pre>
                            </div>
                        </ScrollArea>
                    </div>
                </details>
            </div>
        </div>
    );
}
