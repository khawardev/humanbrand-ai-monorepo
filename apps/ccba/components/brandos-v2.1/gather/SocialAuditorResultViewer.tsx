'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
    Eye, MessageSquare, Heart, Hash, Globe, Activity, TrendingUp, Target, 
    Star, Users, Lightbulb, Zap, Calendar, MapPin, Briefcase, Info, 
    Megaphone, CheckCircle2, Quote, Share2, ChartBar, Timer,
    Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialAuditorResultViewerProps {
    data: any; 
}

export function SocialAuditorResultViewer({ data }: SocialAuditorResultViewerProps) {
    if (!data || !data.social_audit_report) return null;

    const { social_audit_report } = data;
    const { 
        profile_snapshot = {}, 
        emergent_brand_attributes = {}, 
        channel_specific_insights = {}, 
        engagement_analysis = {},
        audit_metadata = {}
    } = social_audit_report;

    // Helper to format keys like "best_posting_times" -> "Best Posting Times"
    const formatKey = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <div className="space-y-6 animate-in fade-in duration-500 w-full max-w-full overflow-x-hidden">
            
            {/* 1. Header & Profile Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-2 border-l-4 border-l-primary">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                             <div className="space-y-1">
                                <CardTitle className="text-xl flex items-center gap-2">
                                    {audit_metadata.channel_name || data.channel_name || 'Social Audit Report'}
                                </CardTitle>
                                <CardDescription>
                                    Analysis Window: {audit_metadata.analysis_window || 'N/A'}
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="flex gap-1 items-center px-3 py-1 bg-background">
                                    <Activity className="w-3.5 h-3.5 text-primary" />
                                    {audit_metadata.posts_analyzed || '0'} Posts
                                </Badge>
                                {profile_snapshot.follower_count && (
                                    <Badge variant="outline" className="flex gap-1 items-center px-3 py-1 bg-background">
                                        <Users className="w-3.5 h-3.5 text-primary" />
                                        {parseInt(profile_snapshot.follower_count).toLocaleString()} Followers
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {profile_snapshot.bio_description && (
                            <div className="relative mt-2">
                                <Quote className="w-6 h-6 text-muted-foreground/20 absolute -top-1 -left-1" />
                                <p className="text-sm text-foreground/80 pl-6 leading-relaxed italic">
                                    {profile_snapshot.bio_description}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* KPI / Quick Stats Card */}
                 <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                         <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Audit Metadata</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center border-b border-border/50 pb-2">
                            <span className="text-sm font-medium">Agent</span>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{audit_metadata.agent_name || 'Social Auditor'}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-border/50 pb-2">
                            <span className="text-sm font-medium">Analyzed On</span>
                            <span className="text-sm text-muted-foreground">
                                {new Date(audit_metadata.analysis_date || Date.now()).toLocaleDateString()}
                            </span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Last Updated</span>
                            <span className="text-sm text-muted-foreground">{new Date(profile_snapshot.last_updated || Date.now()).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 2. Top Performing Content */}
            {engagement_analysis.top_performing_posts?.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Top Performing Content
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {engagement_analysis.top_performing_posts.map((post: any, idx: number) => (
                            <Card key={idx} className="flex flex-col h-full hover:shadow-md transition-shadow group overflow-hidden">
                                <CardContent className="pt-5 flex-1 space-y-4">
                                    <div className="relative">
                                        <span className="text-6xl absolute -top-4 -left-3 text-muted/30 font-serif leading-none">"</span>
                                        <p className="text-sm text-foreground/90 italic line-clamp-4 relative z-10 pl-2">
                                            {post.text_preview}
                                        </p>
                                    </div>
                                    
                                     {/* Handle both engagement_note and text-based engagement_rate */}
                                     {(post.engagement_note || (post.engagement_rate && isNaN(parseFloat(post.engagement_rate)))) && (
                                        <div className="bg-green-50 dark:bg-green-950/20 p-2.5 rounded-lg text-xs text-green-800 dark:text-green-200 mt-2 border border-green-100 dark:border-green-900/40">
                                            <strong>Why it worked:</strong> {post.engagement_note || post.engagement_rate}
                                        </div>
                                    )}
                                </CardContent>
                                <div className="p-3 bg-muted/40 border-t flex justify-between items-center text-xs text-muted-foreground group-hover:bg-muted/60 transition-colors">
                                     <div className="flex gap-3">
                                        {(post.likes !== "0" && post.likes) && <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {post.likes}</span>}
                                        {(post.comments !== "0" && post.comments) && <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {post.comments}</span>}
                                        {(post.shares !== "0" && post.shares) && <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> {post.shares}</span>}
                                     </div>
                                     {post.engagement_rate && !isNaN(parseFloat(post.engagement_rate)) && (
                                         <Badge variant="secondary" className="font-mono text-[10px] h-5">
                                             {(parseFloat(post.engagement_rate) * 100).toFixed(1)}% ER
                                         </Badge>
                                     )}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {/* 3. Strategic Insights & Patterns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Engagement Patterns */}
                <div className="space-y-4">
                     <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        Engagement Patterns
                    </h3>
                    <Card >
                        <CardContent className="space-y-6">
                             {/* Quality Indicators (Object or String) */}
                             {(engagement_analysis.engagement_patterns?.engagement_quality_indicators || engagement_analysis.engagement_patterns?.engagement_quality) && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground/80">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        Quality Signals
                                    </h4>
                                    {typeof engagement_analysis.engagement_patterns.engagement_quality_indicators === 'object' ? (
                                        <div className="grid gap-2">
                                            {Object.entries(engagement_analysis.engagement_patterns.engagement_quality_indicators).map(([key, value]: [string, any]) => (
                                                <div key={key} className="text-xs bg-muted/30 p-2 rounded border border-border/40">
                                                    <span className="font-semibold block mb-0.5 text-foreground">{formatKey(key)}</span>
                                                    <span className="text-muted-foreground">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            {engagement_analysis.engagement_patterns.engagement_quality}
                                        </p>
                                    )}
                                </div>
                             )}


                             {/* Best Posting Times */}
                             {engagement_analysis.engagement_patterns?.best_posting_times && (
                                 <div className="space-y-1 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                     <h4 className="text-xs uppercase font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                                         <Timer className="w-3.5 h-3.5" /> 
                                         Timing
                                     </h4>
                                     <p className="text-sm text-blue-900 dark:text-blue-100">
                                         {engagement_analysis.engagement_patterns.best_posting_times}
                                     </p>
                                 </div>
                             )}

                             {/* Content Type Performance */}
                             {engagement_analysis.engagement_patterns?.content_type_performance && (
                                 <div className="space-y-2">
                                     <h4 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                                        <ChartBar className="w-4 h-4" />
                                        Performance by Type
                                     </h4>
                                     <div className="grid gap-2">
                                         {Object.entries(engagement_analysis.engagement_patterns.content_type_performance).map(([k, v]: [string, any]) => (
                                             <div key={k} className="flex items-start gap-2 text-xs">
                                                 <Badge variant="outline" className="shrink-0 mt-0.5">{formatKey(k)}</Badge>
                                                 <span className="text-muted-foreground py-0.5">{v}</span>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             )}

                             {/* Sentiment Distribution */}
                             {(engagement_analysis.engagement_patterns?.comment_sentiment_distribution || engagement_analysis.engagement_patterns?.comment_sentiment_patterns) && (
                                 <div className="space-y-2 mt-4">
                                     <h4 className="text-sm font-semibold text-foreground/80">Sentiment Drivers</h4>
                                      <div className="grid gap-2">
                                         {Object.entries(engagement_analysis.engagement_patterns.comment_sentiment_distribution || engagement_analysis.engagement_patterns.comment_sentiment_patterns).map(([k, v]: [string, any]) => (
                                             <div key={k} className="bg-muted p-2.5 rounded-lg text-xs border">
                                                 <span className="font-semibold text-foreground capitalize">{formatKey(k)}</span> 
                                                 <span className="text-muted-foreground block mt-1 leading-relaxed">{v}</span>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             )}
                        </CardContent>
                    </Card>
                </div>

                {/* Channel Insights */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                        <Lightbulb className="w-5 h-5 text-orange-600" />
                        Channel Strategy
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(channel_specific_insights).map(([category, insights]: [string, any]) => {
                             // Handle updated structure { finding: string, evidence: string[] }
                             const finding = insights.finding || (typeof insights === 'string' ? insights : null);
                             const evidence = insights.evidence || [];
                             const isLegacySimpleObject = !finding && typeof insights === 'object' && !Array.isArray(insights);
                             
                             if (isLegacySimpleObject) {
                                 // Fallback for older simpler object structure
                                 return (
                                    <Card key={category}>
                                        <CardHeader className="py-3 px-4 bg-muted/20 border-b">
                                            <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                                <Zap className="w-3.5 h-3.5 text-orange-500" />
                                                {formatKey(category)}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 space-y-2">
                                             {Object.entries(insights).map(([k, v]: [string, any]) => (
                                                <div key={k} className="text-xs">
                                                    <span className="font-semibold text-foreground">{formatKey(k)}:</span> <span className="text-muted-foreground">{String(v)}</span>
                                                </div>
                                             ))}
                                        </CardContent>
                                    </Card>
                                 )
                             }

                             return (
                                <Card key={category} className="overflow-hidden">
                                    <CardHeader className="py-3 px-4 bg-orange-50/50 dark:bg-orange-950/20 border-b border-orange-100 dark:border-orange-900/30">
                                         <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-orange-800 dark:text-orange-300">
                                            <Zap className="w-3.5 h-3.5" />
                                            {formatKey(category)}
                                         </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-3">
                                        {finding && <p className="text-sm text-foreground/90 leading-relaxed font-medium">{finding}</p>}
                                        
                                        {evidence.length > 0 && (
                                            <div className="bg-muted/30 rounded p-2.5 space-y-2">
                                                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Evidence</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {evidence.map((ev: string, i: number) => (
                                                        <span key={i} className="text-[11px] text-muted-foreground bg-background border px-2 py-0.5 rounded-full inline-block">
                                                            {ev.length > 60 ? ev.substring(0, 60) + '...' : ev}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 4. Emergent Brand Attributes */}
            <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Emergent Brand DNA
                </h3>
                <div className="grid grid-cols-1 gap-4">
                     <Accordion type="multiple" defaultValue={['VoiceTone', 'Positioning']} className="w-full space-y-3">
                        {Object.entries(emergent_brand_attributes).map(([key, attr]: [string, any]) => {
                             if (!attr || (!attr.finding && (!attr.evidence || attr.evidence.length === 0))) return null;
                             
                             const Icon = getAttributeIcon(key);
                             const label = formatKey(key);

                             return (
                                <AccordionItem key={key} value={key} className="border rounded-xl bg-card px-2 shadow-sm">
                                    <AccordionTrigger className="hover:no-underline py-4 px-2">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2.5 rounded-full hidden sm:block shrink-0">
                                                <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-base">{label}</h4>
                                                {attr.finding && (
                                                    <p className="text-xs text-muted-foreground line-clamp-1 font-normal text-left pr-4 mt-0.5">
                                                        {attr.finding.substring(0, 100)}...
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-2 pb-4">
                                        <div className="space-y-4 pt-2 pl-2 sm:pl-[4.5rem] pr-2">
                                            {attr.finding && (
                                                <div className="relative">
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500/20 rounded-full"></div>
                                                    <p className="text-sm leading-relaxed text-foreground/90 pl-4 py-1">
                                                        {attr.finding}
                                                    </p>
                                                </div>
                                            )}
                                            {attr.evidence && attr.evidence.length > 0 && (
                                                <div className="space-y-2">
                                                    <h5 className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                                                        <Quote className="w-3 h-3" /> Supporting Evidence
                                                    </h5>
                                                    <div className="grid gap-2">
                                                        {attr.evidence.map((ev: string, i: number) => (
                                                            <div key={i} className="text-xs bg-muted/40 p-2.5 rounded text-muted-foreground border border-transparent hover:border-border transition-colors">
                                                                "{ev}"
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                             )
                        })}
                     </Accordion>
                </div>
            </div>

            {/* Zero Engagement Anomaly / Warnings */}
            {engagement_analysis.zero_engagement_anomaly && (
                 <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-4 flex gap-3 text-sm">
                     <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                     <div className="space-y-1 text-amber-900 dark:text-amber-100">
                         <p className="font-medium">Analysis Note: {engagement_analysis.zero_engagement_anomaly.observation}</p>
                         <p className="text-amber-700 dark:text-amber-300/80 text-xs">
                             {engagement_analysis.zero_engagement_anomaly.impact_on_analysis}
                         </p>
                     </div>
                 </div>
            )}

            {/* Raw Data (Collapsed) */}
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
                                    {JSON.stringify(data, (key, value) => {
                                        if (key === 'model_used') return undefined; // Hide model used
                                        return value;
                                    }, 2)}
                                </pre>
                             </div>
                         </ScrollArea>
                    </div>
                </details>
            </div>
        </div>
    );
}


// Helper for Icons
const getAttributeIcon = (key: string) => {
    const map: Record<string, any> = {
        'VoiceTone': MessageSquare,
        'Positioning': Target,
        'RhetoricalStyle': Eye,
        'BusinessDrivers': Activity,
        'Personas': Users,
        'Lexicon': Hash,
        'Values': Heart,
        'BrandPromise': Star,
        'KeyThemes': Lightbulb,
        'ProductNarratives': Megaphone,
        'CommunityEngagement': Globe,
        'LeadershipVoice': Briefcase,
        'EmployerBrand': Users,
    };
    return map[key] || CheckCircle2;
}
