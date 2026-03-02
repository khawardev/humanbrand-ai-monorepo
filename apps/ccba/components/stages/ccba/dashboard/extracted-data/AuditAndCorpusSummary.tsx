import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AuditAndCorpusSummary({ audit, corpus }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Audit Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Audit Date</span>
                        <span>{new Date(audit.audit_date).toLocaleDateString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Agent Name</span>
                        <span>{audit.agent_name}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Persona</span>
                        <span>{audit.persona}</span>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold">Corpus Baseline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Pages Analyzed</span>
                        <span>{corpus.total_pages_analyzed.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Pages Excluded</span>
                        <span>{corpus.total_pages_excluded.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Words Analyzed</span>
                        <span>{corpus.total_words_analyzed.toLocaleString()}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}