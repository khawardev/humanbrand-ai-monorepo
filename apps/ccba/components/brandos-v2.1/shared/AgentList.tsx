import { AgentState } from '@/lib/brandos-v2.1/types';
import { BRAND_OS_AGENTS } from '@/lib/brandos-v2.1/agent-metadata';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, FileInput, FileOutput, Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AgentList({ agents }: { agents: AgentState[] }) {
    if (!agents || agents.length === 0) return null;

    return (
        <div className="grid gap-6 md:grid-cols-2">
            {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
            ))}
        </div>
    );
}

function AgentCard({ agent }: { agent: AgentState }) {
    const metadata = BRAND_OS_AGENTS[agent.id.toLowerCase()];

    // Fallback if metadata is missing (though we should ensure it exists)
    if (!metadata) {
        return (
            <div className="p-4 border rounded-xl bg-muted/20">
                <p className="text-red-500">Missing metadata for agent: {agent.id}</p>
            </div>
        );
    }

    return (
        <Collapsible className="group bg-muted/20 p-4 rounded-xl border transition-all hover:bg-muted/30">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-0 h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground">
                                <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            </Button>
                        </CollapsibleTrigger>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg  leading-none">{metadata.name}</span>
                                <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-mono bg-background/50">
                                    {metadata.id}
                                </Badge>
                            </div>
                            <span className="text-xs font-medium text-muted-foreground mt-1 block">{metadata.role}</span>
                        </div>
                    </div>
                    <StatusBadge status={agent.status} />
                </div>

                <div className="space-y-1.5 pl-9">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{agent.progress}%</span>
                    </div>
                    <Progress value={agent.progress} className="h-2" />
                </div>

                <CollapsibleContent className="pl-9 space-y-4 pt-2">
                    <div className="text-sm space-y-4 animate-in slide-in-from-top-2">
                        <p className="text-muted-foreground leading-relaxed">
                            {metadata.description}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded items-center">
                            <span className="font-semibold text-foreground mr-1">Dependencies:</span>
                            {metadata.dependencies.length > 0 ? (
                                metadata.dependencies.map((dep: string, i: number) => (
                                    <Badge key={i} variant="secondary" className="text-[10px] h-5 px-1.5 font-mono uppercase">
                                        {dep}
                                    </Badge>
                                ))
                            ) : (
                                <span>None (Entry point)</span>
                            )}
                        </div>
                        <div className="grid grid-cols-1 gap-3 p-3 bg-background/50 rounded-lg border">
                            <div className="space-y-1.5">
                                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                    <FileInput className="w-3 h-3" /> Inputs
                                </span>
                                <ul className="grid gap-1">
                                    {metadata.inputs.map((input: string, i: number) => (
                                        <li key={i} className="text-xs text-muted-foreground bg-background px-2 py-1 rounded border truncate" title={input}>
                                            {input}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-1.5 pt-2 border-t">
                                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-600 dark:text-green-400">
                                    <FileOutput className="w-3 h-3" /> Outputs
                                </span>
                                <ul className="grid gap-1">
                                    {metadata.outputs.map((output: string, i: number) => (
                                        <li key={i} className="text-xs text-muted-foreground bg-background px-2 py-1 rounded border truncate" title={output}>
                                            {output}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </CollapsibleContent>
            </div>
        </Collapsible>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'running': return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Running</span>;
        case 'completed': return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"><CheckCircle2 className="w-4 h-4 mr-2" /> Completed</span>;
        case 'failed': return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"><AlertCircle className="w-4 h-4 mr-2" /> Failed</span>;
        default: return <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"><Clock className="w-4 h-4 mr-2" /> Pending</span>;
    }
}
