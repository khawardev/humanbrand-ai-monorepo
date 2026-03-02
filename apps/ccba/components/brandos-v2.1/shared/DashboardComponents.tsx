import { useMemo } from 'react';
import { Separator } from "@/components/ui/separator";
import { GateOutputs } from '@/lib/brandos-v2.1/types';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, FileJson } from 'lucide-react';

export function DashboardInnerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col md:p-10 p-6 w-full animate-in fade-in duration-500">
            {children}
        </div>
    )
}

export function DashboardLayoutHeading({ title, subtitle }: { title: string, subtitle: string }) {
    return (
        <>
            <DashboardInnerLayout>
                <h1 className="text-3xl font-medium mb-2 tracking-tight">{title}</h1>
                <p className="text-muted-foreground text-xl leading-relaxed">{subtitle}</p>
            </DashboardInnerLayout>
            <Separator className="mb-6" />
        </>
    )
}

const STATUS_STYLES = {
    pass: 'bg-green-50 text-green-900 border-green-200 dark:bg-green-900/10 dark:text-green-100 dark:border-green-900',
    warn: 'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/10 dark:text-yellow-100 dark:border-yellow-900',
    fail: 'bg-red-50 text-red-900 border-red-200 dark:bg-red-900/10 dark:text-red-100 dark:border-red-900'
} as const;

export function GateResultDisplay({ results }: { results: GateOutputs }) {
    const isPass = results.overall_status === 'pass';
    
    const colorClass = useMemo(() => {
        if (results.overall_status === 'pass') return STATUS_STYLES.pass;
        if (results.overall_status === 'warn') return STATUS_STYLES.warn;
        return STATUS_STYLES.fail;
    }, [results.overall_status]);

    return (
        <div className={`p-8 rounded-xl border ${colorClass} space-y-4`}>
             <div className="flex items-center gap-4">
                {isPass ? <CheckCircle2 className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
                <div>
                    <h4 className="text-xl font-bold uppercase tracking-tight">Status: {results.overall_status}</h4>
                </div>
            </div>
             <div className="space-y-4">
                {results.gates.map((g, i) => (
                    <div key={i} className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 first:border-0 first:pt-0 first:mt-2">
                        <p className="font-semibold text-lg flex items-center gap-2">
                            {g.name}
                            {g.status !== 'pass' && <Badge variant="outline" className="text-xs uppercase bg-white/20 border-current">{g.status}</Badge>}
                        </p>
                        {g.messages ? (
                            <ul className="mt-2 space-y-1">
                                {g.messages.map((m, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                        <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-current opacity-60" />
                                        <span>{m}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function JsonViewer({ data, title }: { data: any, title: string }) {
    const formattedJson = useMemo(() => JSON.stringify(data, null, 2), [data]);
    
    return (
        <div className="relative group">
            <div className="absolute top-3 right-4 flex items-center gap-2 text-xs text-muted-foreground bg-background/80 backdrop-blur px-2 py-1 rounded-md border">
                <FileJson className="w-3 h-3" />
                {title}
            </div>
            <div className="bg-muted dark:text-slate-50  p-6 rounded-xl overflow-auto max-h-[600px] border shadow-sm">
                <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed">
                    {formattedJson}
                </pre>
            </div>
        </div>
    )
}

