'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { 
    ChevronDown, 
    ChevronRight, 
    FileText, 
    Quote, 
    TrendingUp, 
    Users, 
    BarChart3, 
    Target, 
    MessageSquare,
    Link as LinkIcon,
    Hash,
    Zap,
    Layers,
    Sparkles,
    Activity,
    Grid3X3
} from "lucide-react";
import { cn } from "@/lib/utils";

type ExtractionOutputViewerProps = {
    output: string | object | null;
};

function safeParseJSON(input: string | object | null): any {
    if (!input) return null;
    if (typeof input === 'object') return input;
    if (typeof input !== 'string') return null;
    
    let jsonString = input.trim();
    
    if (jsonString.startsWith('```json')) {
        jsonString = jsonString.slice(7);
    } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.slice(3);
    }
    
    if (jsonString.endsWith('```')) {
        jsonString = jsonString.slice(0, -3);
    }
    
    jsonString = jsonString.trim();
    
    try {
        return JSON.parse(jsonString);
    } catch {
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch {
                return null;
            }
        }
        return null;
    }
}

function safeGet(obj: any, path: string, defaultValue: any = null): any {
    if (!obj) return defaultValue;
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
        if (result === null || result === undefined) return defaultValue;
        result = result[key];
    }
    return result ?? defaultValue;
}

function formatNumber(num: any): string {
    if (typeof num === 'number') return num.toLocaleString();
    if (typeof num === 'string') {
        const parsed = parseFloat(num);
        return isNaN(parsed) ? num : parsed.toLocaleString();
    }
    return String(num ?? 'N/A');
}

function MetricCard({ label, value, icon: Icon }: { label: string; value: any; icon?: any }) {
    return (
        <div className="bg-muted/40 rounded-lg p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
            </div>
            <div className="text-xl font-bold">{formatNumber(value)}</div>
        </div>
    );
}

function SectionHeader({ title, icon: Icon, count }: { title: string; icon?: any; count?: number }) {
    return (
        <div className="flex items-center justify-between my-4">
            <h4 className=" font-medium flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
                {title}
            </h4>
            {count !== undefined && (
                <Badge variant="secondary" className="text-xs">{count} items</Badge>
            )}
        </div>
    );
}

function QuoteItem({ quote, url, verb }: { quote: string; url?: string; verb?: string }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLong = quote.length > 150;

    return (
        <div className="border-l-2 border-muted-foreground/20 pl-3 py-2 hover:border-primary/50 transition-colors">
            <p className=" text-muted-foreground leading-relaxed">
                {isLong && !isExpanded ? `${quote.slice(0, 150)}...` : quote}
            </p>
            <div className="flex items-center gap-2 mt-1">
                {isLong && (
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs text-primary hover:underline"
                    >
                        {isExpanded ? 'Show less' : 'Show more'}
                    </button>
                )}
                {url && (
                    <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                        <LinkIcon className="w-3 h-3" />
                        Source
                    </a>
                )}
            </div>
        </div>
    );
}

function VerbCard({ verb, count, quotes }: { verb: string; count: number; quotes?: string[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const hasQuotes = quotes && quotes.length > 0;

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
                <div className={cn(
                    "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                    "hover:bg-muted/50",
                    isOpen && "bg-muted/50"
                )}>
                    <div className="flex items-center gap-3">
                        {hasQuotes ? (
                            isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        ) : (
                            <div className="w-4 h-4" />
                        )}
                        <span className="font-medium capitalize">{verb}</span>
                    </div>
                    <Badge variant="outline">{count}</Badge>
                </div>
            </CollapsibleTrigger>
            {hasQuotes && (
                <CollapsibleContent>
                    <div className="pr-3 py-3 space-y-3 max-h-[300px] overflow-y-auto">
                        {quotes.slice(0, 10).map((quote, idx) => (
                            <QuoteItem key={idx} quote={quote} />
                        ))}
                        {quotes.length > 10 && (
                            <p className="text-xs text-muted-foreground">
                                + {quotes.length - 10} more quotes
                            </p>
                        )}
                    </div>
                </CollapsibleContent>
            )}
        </Collapsible>
    );
}

function FrequencyBar({ label, count, maxCount }: { label: string; count: number; maxCount: number }) {
    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
    return (
        <div className="flex items-center gap-3 py-1.5">
            <span className=" font-medium w-28 truncate capitalize" title={label}>{label}</span>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                    className="h-full bg-primary/70 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="text-xs text-muted-foreground w-12 text-right">{count}</span>
        </div>
    );
}

function RelationshipMatrix({ matrix }: any) {
    const products:any = Object.keys(matrix);
    const themes = products.length > 0 ? Object.keys(matrix[products[0]]) : [];
    
    if (products.length === 0 || themes.length === 0) return null;

    const maxValue = Math.max(...products.flatMap((p: any) => Object.values(matrix[p])));

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-xs">
                <thead>
                    <tr>
                        <th className="text-left p-2 font-medium text-muted-foreground"></th>
                        {themes.map(theme => (
                            <th key={theme} className="text-center p-2 font-medium text-muted-foreground whitespace-nowrap">
                                {theme}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {products.map((product:any) => (
                        <tr key={product} className="border-t border-muted/50">
                            <td className="p-2 font-medium whitespace-nowrap">{product}</td>
                            {themes.map(theme => {
                                const value = matrix[product]?.[theme] || 0;
                                const intensity = maxValue > 0 ? value / maxValue : 0;
                                return (
                                    <td key={theme} className="text-center p-2">
                                        <div 
                                            className={cn(
                                                "w-8 h-8 mx-auto rounded flex items-center justify-center text-xs font-medium",
                                                intensity > 0.7 ? "bg-primary text-primary-foreground" :
                                                intensity > 0.4 ? "bg-primary/60 text-primary-foreground" :
                                                intensity > 0.1 ? "bg-primary/30" :
                                                "bg-muted/50"
                                            )}
                                        >
                                            {value}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function AuditMetadataSection({ data }: { data: any }) {
    if (!data) return null;
    const date = safeGet(data, 'audit_date', 'N/A');
    const agentName = safeGet(data, 'agent_name', 'N/A');
    const persona = safeGet(data, 'persona', null);

    return (
        <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-xl border">
            <div className="flex items-center gap-2">
                <Badge variant="outline">Audit Date</Badge>
                <span className="">{date}</span>
            </div>
            <div className="flex items-center gap-2">
                <Badge variant="outline">Agent</Badge>
                <span className="">{agentName}</span>
            </div>
            {persona && (
                <div className="flex items-center gap-2">
                    <Badge variant="outline">Persona</Badge>
                    <span className=" ">{persona}</span>
                </div>
            )}
        </div>
    );
}

function CorpusBaselineSection({ data }: { data: any }) {
    if (!data) return null;
    
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {safeGet(data, 'total_pages_analyzed') !== null && (
                <MetricCard label="Pages Analyzed" value={safeGet(data, 'total_pages_analyzed', 0)} icon={FileText} />
            )}
            {safeGet(data, 'total_pages_excluded') !== null && (
                <MetricCard label="Pages Excluded" value={safeGet(data, 'total_pages_excluded', 0)} icon={FileText} />
            )}
            {safeGet(data, 'total_words_analyzed') !== null && (
                <MetricCard label="Words Analyzed" value={safeGet(data, 'total_words_analyzed', 0)} icon={Hash} />
            )}
        </div>
    );
}

function ActionVerbsSection({ verbs }: { verbs: any[] }) {
    if (!verbs || verbs.length === 0) return null;

    return (
        <div className="space-y-3">
            <SectionHeader title="Action Verbs" icon={Zap} count={verbs.length} />
            <div className="space-y-2">
                {verbs.map((item, idx) => (
                    <VerbCard 
                        key={idx} 
                        verb={item.verb || item.word || 'Unknown'} 
                        count={item.count || 0} 
                        quotes={item.quotes} 
                    />
                ))}
            </div>
        </div>
    );
}

function FutureStatementsSection({ statements }: { statements: any[] }) {
    if (!statements || statements.length === 0) return null;

    return (
        <div className="space-y-3">
            <SectionHeader title="Future Statements" icon={Target} count={statements.length} />
            <div className="space-y-2">
                {statements.map((item, idx) => (
                    <QuoteItem 
                        key={idx} 
                        quote={item.quote || item.statement || ''} 
                        url={item.url} 
                    />
                ))}
            </div>
        </div>
    );
}

function LinguisticMetricsSection({ data }: { data: any }) {
    if (!data) return null;

    const metrics = [
        { label: 'Avg Sentence Length', value: safeGet(data, 'avg_sentence_length', 'N/A') },
        { label: 'Active Voice', value: safeGet(data, 'active_voice_percent') !== null ? `${safeGet(data, 'active_voice_percent')}%` : 'N/A' },
        { label: 'Passive Voice', value: safeGet(data, 'passive_voice_percent') !== null ? `${safeGet(data, 'passive_voice_percent')}%` : 'N/A' },
        { label: 'Confidence/Hedging Ratio', value: safeGet(data, 'confidence_to_hedging_ratio', 'N/A') },
    ].filter(m => m.value !== 'N/A' && m.value !== null);

    if (metrics.length === 0) return null;

    return (
        <div className="space-y-3">
            <SectionHeader title="Linguistic Metrics" icon={BarChart3} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {metrics.map((metric, idx) => (
                    <div key={idx} className="bg-muted/40 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold">{metric.value}</div>
                        <div className="text-xs text-muted-foreground">{metric.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function LexicalFrequencySection({ data }: { data: any }) {
    if (!data) return null;

    const nouns = safeGet(data, 'top_100_nouns', []);
    const verbs = safeGet(data, 'top_100_verbs', []);
    const proprietaryTerms = safeGet(data, 'proprietary_terms', []);
    
    const maxNounCount = nouns.length > 0 ? Math.max(...nouns.map((n: any) => n.count || 0)) : 0;
    const maxVerbCount = verbs.length > 0 ? Math.max(...verbs.map((v: any) => v.count || 0)) : 0;

    const hasContent = nouns.length > 0 || verbs.length > 0;
    if (!hasContent) return null;

    return (
        <div className="space-y-4">
            <SectionHeader title="Lexical Frequency" icon={TrendingUp} />
            <div className="grid md:grid-cols-2 gap-6">
                {nouns.length > 0 && (
                    <div>
                        <h5 className="text-xs font-medium text-muted-foreground uppercase mb-3">Top Nouns</h5>
                        <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2">
                            {nouns.slice(0, 20).map((item: any, idx: number) => (
                                <FrequencyBar 
                                    key={idx} 
                                    label={item.noun || item.word || 'Unknown'} 
                                    count={item.count || 0} 
                                    maxCount={maxNounCount} 
                                />
                            ))}
                        </div>
                    </div>
                )}
                {verbs.length > 0 && (
                    <div>
                        <h5 className="text-xs font-medium text-muted-foreground uppercase mb-3">Top Verbs</h5>
                        <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2">
                            {verbs.slice(0, 20).map((item: any, idx: number) => (
                                <FrequencyBar 
                                    key={idx} 
                                    label={item.verb || item.word || 'Unknown'} 
                                    count={item.count || 0} 
                                    maxCount={maxVerbCount} 
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {proprietaryTerms.length > 0 && (
                <div className="mt-4">
                    <h5 className="text-xs font-medium text-muted-foreground uppercase mb-2">Proprietary Terms</h5>
                    <div className="flex flex-wrap gap-2">
                        {proprietaryTerms.map((term: string, idx: number) => (
                            <Badge key={idx} variant="secondary">{term}</Badge>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function AudienceDataSection({ data }: { data: any }) {
    if (!data) return null;
    
    const cues = safeGet(data, 'audience_cues', []);
    if (cues.length === 0) return null;
    
    const maxCount = Math.max(...cues.map((c: any) => c.count || 0));

    return (
        <div className="space-y-3">
            <SectionHeader title="Audience Cues" icon={Users} count={cues.length} />
            <div className="space-y-1 max-h-[250px] overflow-y-auto pr-2">
                {cues.map((item: any, idx: number) => (
                    <FrequencyBar 
                        key={idx} 
                        label={item.term || 'Unknown'} 
                        count={item.count || 0} 
                        maxCount={maxCount} 
                    />
                ))}
            </div>
        </div>
    );
}

function ProductGroupsSection({ groups }: { groups: any[] }) {
    if (!groups || groups.length === 0) return null;
    
    const maxCount = Math.max(...groups.map((g: any) => g.count || 0));

    return (
        <div className="space-y-3">
            <SectionHeader title="Discovered Product Groups" icon={Layers} count={groups.length} />
            <div className="space-y-1 max-h-[250px] overflow-y-auto pr-2">
                {groups.map((item: any, idx: number) => (
                    <FrequencyBar 
                        key={idx} 
                        label={item.product_group || item.name || 'Unknown'} 
                        count={item.count || 0} 
                        maxCount={maxCount} 
                    />
                ))}
            </div>
        </div>
    );
}

function StrategicThemesSection({ themes }: { themes: any[] }) {
    if (!themes || themes.length === 0) return null;

    return (
        <div className="space-y-3">
            <SectionHeader title="Strategic Themes" icon={Sparkles} count={themes.length} />
            <div className="space-y-3">
                {themes.map((theme: any, idx: number) => (
                    <div key={idx} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{theme.theme || 'Unknown Theme'}</h5>
                            <Badge variant="outline">{theme.instance_count || 0} instances</Badge>
                        </div>
                        {theme.phrases && theme.phrases.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {theme.phrases.map((phrase: string, pIdx: number) => (
                                    <Badge key={pIdx} variant="secondary" className="text-xs font-normal">
                                        {phrase}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function NuancedSignalsSection({ data }: { data: any }) {
    if (!data) return null;

    const valueWords = safeGet(data, 'value_laden_words', []);
    const diffMarkers = safeGet(data, 'differentiation_markers', []);
    const emotionalScore = safeGet(data, 'emotional_language_score', null);

    const hasContent = valueWords.length > 0 || diffMarkers.length > 0 || emotionalScore;
    if (!hasContent) return null;

    const positiveCount = safeGet(emotionalScore, 'positive_sentiment_word_count', 0);
    const negativeCount = safeGet(emotionalScore, 'negative_sentiment_word_count', 0);
    const totalSentiment = positiveCount + negativeCount;
    const positivePercent = totalSentiment > 0 ? (positiveCount / totalSentiment) * 100 : 0;

    return (
        <div className="space-y-4">
            <SectionHeader title="Nuanced Signals" icon={Activity} />
            
            {emotionalScore && (
                <div className="bg-muted/40 rounded-lg p-4">
                    <h5 className="text-xs font-medium text-muted-foreground uppercase mb-3">Emotional Language Score</h5>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-green-600">Positive: {positiveCount}</span>
                                <span className="text-red-600">Negative: {negativeCount}</span>
                            </div>
                            <div className="h-2 bg-red-200 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-green-500 rounded-full"
                                    style={{ width: `${positivePercent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {valueWords.length > 0 && (
                    <div>
                        <h5 className="text-xs font-medium text-muted-foreground uppercase mb-3">Value-Laden Words</h5>
                        <div className="flex flex-wrap gap-2">
                            {valueWords.map((item: any, idx: number) => (
                                <Badge key={idx} variant="secondary" className="gap-1">
                                    {item.word || 'Unknown'}
                                    <span className="text-muted-foreground">({item.count || 0})</span>
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
                {diffMarkers.length > 0 && (
                    <div>
                        <h5 className="text-xs font-medium text-muted-foreground uppercase mb-3">Differentiation Markers</h5>
                        <div className="flex flex-wrap gap-2">
                            {diffMarkers.filter((item: any) => (item.count || 0) > 0).map((item: any, idx: number) => (
                                <Badge key={idx} variant="outline" className="gap-1">
                                    {item.marker || 'Unknown'}
                                    <span className="text-muted-foreground">({item.count || 0})</span>
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function RelationshipMatrixSection({ matrix }: { matrix: any }) {
    if (!matrix || Object.keys(matrix).length === 0) return null;

    return (
        <div className="space-y-3">
            <SectionHeader title="Relationship Matrix" icon={Grid3X3} />
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <ScrollArea className="w-full">
                        <div className="min-w-[600px] p-4">
                            <RelationshipMatrix matrix={matrix} />
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}

export function ExtractionOutputViewer({ output }: ExtractionOutputViewerProps) {
    const parsedData = useMemo(() => safeParseJSON(output), [output]);

    if (!output) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No extraction data available</p>
            </div>
        );
    }

    if (!parsedData) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2  text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>Raw Output (could not parse as structured data)</span>
                </div>
                <ScrollArea className="h-[500px] border rounded-lg">
                    <div className="p-4">
                        <pre className=" whitespace-pre-wrap break-all">
                            {typeof output === 'string' ? output : JSON.stringify(output, null, 2)}
                        </pre>
                    </div>
                </ScrollArea>
            </div>
        );
    }

    const auditMetadata = safeGet(parsedData, 'audit_metadata', null);
    const corpusBaseline = safeGet(parsedData, 'corpus_baseline', null);
    const narrativeData = safeGet(parsedData, 'narrative_data_points', null);
    const verbalIdentity = safeGet(parsedData, 'verbal_identity_data_points', null);
    const audienceData = safeGet(parsedData, 'audience_data', null);
    const businessStructures = safeGet(parsedData, 'emergent_business_structures', null);
    const relationshipMatrix = safeGet(parsedData, 'relationship_matrix', null);
    const nuancedSignals = safeGet(parsedData, 'nuanced_signals', null);

    const actionVerbs = safeGet(narrativeData, 'action_verbs', []);
    const futureStatements = safeGet(narrativeData, 'future_statements', []);
    const linguisticMetrics = safeGet(verbalIdentity, 'linguistic_metrics', null);
    const lexicalFrequency = safeGet(verbalIdentity, 'lexical_frequency', null);
    const productGroups = safeGet(businessStructures, 'discovered_product_groups', []);
    const strategicThemes = safeGet(businessStructures, 'discovered_strategic_themes', []);

    const hasNarrative = actionVerbs.length > 0 || futureStatements.length > 0;
    const hasVerbal = linguisticMetrics || lexicalFrequency;
    const hasAudience = audienceData && safeGet(audienceData, 'audience_cues', []).length > 0;
    const hasBusiness = productGroups.length > 0 || strategicThemes.length > 0;
    const hasMatrix = relationshipMatrix && Object.keys(relationshipMatrix).length > 0;
    const hasSignals = nuancedSignals;

    const getDefaultTab = () => {
        if (hasNarrative) return 'narrative';
        if (hasVerbal) return 'verbal';
        if (hasAudience) return 'audience';
        if (hasBusiness) return 'business';
        if (hasMatrix) return 'matrix';
        if (hasSignals) return 'signals';
        return 'narrative';
    };

    const hasTabs = hasNarrative || hasVerbal || hasAudience || hasBusiness || hasMatrix || hasSignals;

    return (
        <div className="space-y-6">
            {auditMetadata && <AuditMetadataSection data={auditMetadata} />}
            
            {corpusBaseline && <CorpusBaselineSection data={corpusBaseline} />}

            {hasTabs ? (
                <Tabs defaultValue={getDefaultTab()} className="w-full">
                    <TabsList className="w-full justify-start flex-wrap h-auto gap-1 p-1">
                        {hasNarrative && (
                            <TabsTrigger value="narrative" >
                                <Quote className="w-3.5 h-3.5" />
                                Narrative
                            </TabsTrigger>
                        )}
                        {hasVerbal && (
                            <TabsTrigger value="verbal" >
                                <MessageSquare className="w-3.5 h-3.5" />
                                Verbal Identity
                            </TabsTrigger>
                        )}
                        {hasAudience && (
                            <TabsTrigger value="audience" >
                                <Users className="w-3.5 h-3.5" />
                                Audience
                            </TabsTrigger>
                        )}
                        {hasBusiness && (
                            <TabsTrigger value="business" >
                                <Layers className="w-3.5 h-3.5" />
                                Business Structure
                            </TabsTrigger>
                        )}
                        {hasMatrix && (
                            <TabsTrigger value="matrix" >
                                <Grid3X3 className="w-3.5 h-3.5" />
                                Relationships
                            </TabsTrigger>
                        )}
                        {hasSignals && (
                            <TabsTrigger value="signals" >
                                <Activity className="w-3.5 h-3.5" />
                                Signals
                            </TabsTrigger>
                        )}
                    </TabsList>

                    <div className="mt-6">
                        <TabsContent value="narrative" className="space-y-6 mt-0">
                            <ActionVerbsSection verbs={actionVerbs} />
                            <FutureStatementsSection statements={futureStatements} />
                        </TabsContent>

                        <TabsContent value="verbal" className="space-y-6 mt-0">
                            <LinguisticMetricsSection data={linguisticMetrics} />
                            <LexicalFrequencySection data={lexicalFrequency} />
                        </TabsContent>

                        <TabsContent value="audience" className="space-y-6 mt-0">
                            <AudienceDataSection data={audienceData} />
                        </TabsContent>

                        <TabsContent value="business" className="space-y-6 mt-0">
                            <ProductGroupsSection groups={productGroups} />
                            <StrategicThemesSection themes={strategicThemes} />
                        </TabsContent>

                        <TabsContent value="matrix" className="space-y-6 mt-0">
                            <RelationshipMatrixSection matrix={relationshipMatrix} />
                        </TabsContent>

                        <TabsContent value="signals" className="space-y-6 mt-0">
                            <NuancedSignalsSection data={nuancedSignals} />
                        </TabsContent>
                    </div>
                </Tabs>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-2  text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        <span>Parsed Data (no recognized sections found)</span>
                    </div>
                    <ScrollArea className="h-[400px] border rounded-lg">
                        <div className="p-4">
                            <pre className=" whitespace-pre-wrap break-all">
                                {JSON.stringify(parsedData, null, 2)}
                            </pre>
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    );
}
