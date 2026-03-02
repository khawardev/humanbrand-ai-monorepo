'use client'

import LedgerVisualizer from "./LedgerVisualizer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { appConfig } from "@/config/site";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";
import { Separator } from "../ui/separator";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ContentActions } from "./ContentActions";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { cleanAndFlattenBullets } from "@/lib/cleanMarkdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateQuestionnairePdf } from "@/lib/genrate-pdfs/questionare-pdf";
import { generateQuestionnaireDocx } from "@/lib/genrate-pdfs/questionnaire-docx";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import StructuredAuditReport from "./StructuredAuditReport";

interface AuditResultsProps {
    audit: any;
    user: any;
    generateQuestionnaire: (auditId: string, auditContent: string) => Promise<{ generatedText: string | null; errorReason?: string | null; error?: string }>;
}

export default function AuditResults({ audit, user, generateQuestionnaire }: AuditResultsProps) {
    const hasCredits = user?.auditCredits > 0;
    const hasReachedLimit = user?.auditCredits <= 0 && user?.auditCredits !== appConfig.audits.freeTierLimit;
    const [isDownloadingReport, setIsDownloadingReport] = useState(false);
    const [isDownloadingQuestionnairePdf, setIsDownloadingQuestionnairePdf] = useState(false);
    const [isDownloadingQuestionnaireDocx, setIsDownloadingQuestionnaireDocx] = useState(false);
    const [isGeneratingQuestionnaire, setIsGeneratingQuestionnaire] = useState(false);
    const [questionnaire, setQuestionnaire] = useState<string | null>(audit.questionnaireContent || null);
    const [questionnaireError, setQuestionnaireError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(audit.comparisonReport ? "comparison" : "report");
    const currentDate = new Date().toISOString().split("T")[0];

    // Try to parse structured report
    const structuredReport = useMemo(() => {
        try {
            if (!audit.auditGenratedContent) return null;
            const parsed = JSON.parse(audit.auditGenratedContent);
            if (parsed && typeof parsed === 'object' && parsed.executiveSummary) {
                return parsed;
            }
            return null;
        } catch (e) {
            return null;
        }
    }, [audit.auditGenratedContent]);

    const getDisplayName = (url: string) => {
        try {
            // Ensure there's a protocol for the URL constructor
            const validUrl = url.startsWith('http') ? url : `https://${url}`;
            const hostname = new URL(validUrl).hostname;
            // Only strip 'www.' if it's at the start
            return hostname.startsWith('www.') ? hostname.slice(4) : hostname;
        } catch {
            // Fallback: strip common prefixes manually if URL parsing fails
            return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
        }
    };

    const brandDisplayName = getDisplayName(audit.url);

    if (audit.status === 'failed') {
        return (
            <div className="container max-w-4xl mx-auto md:py-30 py-28 px-4">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Analysis Failed</AlertTitle>
                    <AlertDescription>
                        An error occurred during analysis for {audit.url}. Your free audit credit was not used. Please try again later or with a different URL.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (hasReachedLimit && audit.status !== 'completed') {
        return (
            <div className="container max-w-4xl mx-auto md:py-30 py-28 px-4 text-center">
                <Card>
                    <CardHeader><CardTitle className="text-2xl">You've Used All Your Free Audits!</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <p>Thank you for using our service. You have reached the limit of {appConfig.audits.freeTierLimit} free reports.</p>
                        <Button size="lg">Upgrade to Pro for More Audits</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const handleDownloadReportPdf = async (content: string, fileName: string) => {
        setIsDownloadingReport(true);
        if (!content) {
            toast.error("No content available to download.");
            setIsDownloadingReport(false);
            return;
        }
        try {
            const { generateReportPdfFromMarkdown } = await import('@/lib/genrate-pdfs/report');
            generateReportPdfFromMarkdown(content, fileName);
            toast.info("Report PDF Generated");
        } catch (error) {
            console.error("PDF generation failed:", error);
            toast.error("Failed to generate PDF report.");
        } finally {
            setIsDownloadingReport(false);
        }
    };

    const handleGenerateQuestionnaire = async () => {
        setIsGeneratingQuestionnaire(true);
        setQuestionnaire(null);
        setQuestionnaireError(null);
        try {
            toast.info("Generating your questionnaire...");
            const result = await generateQuestionnaire(audit.id, audit.auditGenratedContent);
            if (result.generatedText) {
                setQuestionnaire(result.generatedText);
                toast.success("Questionnaire generated and saved.");
                setActiveTab("questionnaire");
            } else {
                const errorMsg = result.errorReason || result.error || "An unknown error occurred.";
                setQuestionnaireError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
            setQuestionnaireError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsGeneratingQuestionnaire(false);
        }
    };

    const handleDownloadQuestionnairePdf = async () => {
        if (!questionnaire) {
            toast.error("Questionnaire content is not available.");
            return;
        }

        setIsDownloadingQuestionnairePdf(true);
        try {
            const fileName = `${brandDisplayName} Questionaires.pdf`;
            await generateQuestionnairePdf({ markdownContent: questionnaire }, fileName);
            toast.success("Questionnaire PDF Generated");
        } catch (error) {
            console.error("Questionnaire PDF generation failed:", error);
            toast.error("Failed to generate questionnaire PDF.");
        } finally {
            setIsDownloadingQuestionnairePdf(false);
        }
    };

    const handleDownloadQuestionnaireDocx = async () => {
        if (!questionnaire) {
            toast.error("Questionnaire content is not available.");
            return;
        }
        setIsDownloadingQuestionnaireDocx(true);
        try {
            const fileName = `${brandDisplayName} Questionaires.docx`;
            await generateQuestionnaireDocx(questionnaire, fileName);
            toast.success("Questionnaire DOCX Generated");
        } catch (error) {
            console.error("Questionnaire DOCX generation failed:", error);
            toast.error("Failed to generate questionnaire DOCX.");
        } finally {
            setIsDownloadingQuestionnaireDocx(false);
        }
    };

    return (
        <div className="container flex flex-col space-y-6 max-w-5xl mx-auto md:py-30 py-28 px-4">
            {hasCredits && (
                <Alert className="mb-8 border-lime-green/50 text-lime-green">
                    <CheckCircle2 className="h-4 w-4 text-lime-green" />
                    <AlertTitle className="font-semibold">You're on the free plan</AlertTitle>
                    <AlertDescription className=" flex gap-1">
                        You have <span className="font-bold">{user?.auditCredits}</span> free reports remaining.
                    </AlertDescription>
                </Alert>
            )}
            {!hasCredits && user?.auditCredits !== appConfig.audits.freeTierLimit && (
                <Alert variant="destructive" className="mb-8">
                    <MdOutlineRemoveCircleOutline className="h-4 w-4" />
                    <AlertTitle className="font-semibold">Usage Limit Reached</AlertTitle>
                    <AlertDescription>You have used all your free reports.</AlertDescription>
                </Alert>
            )}

            <Button className="w-fit rounded-full" variant="outline" asChild>
                <Link href="/audit"><IoArrowBackOutline /> back</Link>
            </Button>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-4 mb-8">
                <div className="flex-1">
                    <h1 className="text-3xl mb-2 tracking-tight font-bold font-heading">
                        Website <span className=" text-primary">Brand Health Audit </span> is ready
                    </h1>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold py-0.5 px-2 rounded-full bg-primary/10 text-primary">Brand</span>
                            <Link href={audit.url} target='_blank' className="text-sm text-muted-foreground hover:underline break-all">
                                {audit.url}
                            </Link>
                        </div>
                        {audit.competitorUrls && audit.competitorUrls.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {audit.competitorUrls.map((comp: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <span className="text-[10px] font-semibold py-0.5 px-2 rounded-full bg-muted text-muted-foreground">Comp {idx + 1}</span>
                                        <Link href={comp} target='_blank' className="text-xs text-muted-foreground hover:underline">
                                            {comp}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <Button size={'sm'} onClick={handleGenerateQuestionnaire} disabled={isGeneratingQuestionnaire} className="shrink-0" >
                    {isGeneratingQuestionnaire ? (<><Loader2 className="size-3 animate-spin mr-2" /> Generating...</>) : ('Generate Questionnaire')}
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className={`grid w-full ${audit.comparisonReport ? 'grid-cols-4' : (audit.results ? 'grid-cols-3' : 'grid-cols-2')}`}>
                    <TabsTrigger value="report">Brand Report</TabsTrigger>
                    {audit.comparisonReport && <TabsTrigger value="comparison">Comparison Report</TabsTrigger>}
                    <TabsTrigger value="questionnaire" disabled={!questionnaire}>Questionnaire</TabsTrigger>
                    {audit.results && <TabsTrigger value="analysis-data">Analysis Data</TabsTrigger>}
                </TabsList>

                <TabsContent value="report">
                    {audit.auditGenratedContent &&
                        <section className="mt-6">
                            <div className={"flex flex-col md:flex-row md:items-center items-end justify-between mb-4 gap-4"}>
                                <div className="flex justify-end w-full gap-3 mt-1">
                                    <ContentActions
                                        content={audit.auditGenratedContent}
                                        auditURL={audit.url}
                                        handleDownloadPdf={() => handleDownloadReportPdf(audit.auditGenratedContent, `${brandDisplayName} Brand Report.pdf`)}
                                        isDownloadingPdf={isDownloadingReport}
                                        notdocx={false}
                                    />
                                </div>
                            </div>
                            <Separator className="mb-4" />
                            {structuredReport ? (
                                <StructuredAuditReport report={structuredReport} />
                            ) : (
                                <div className="prose prose-neutral max-w-none markdown-body space-y-6 dark:prose-invert ">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanAndFlattenBullets(audit.auditGenratedContent)}</ReactMarkdown>
                                </div>
                            )}
                        </section>
                    }
                </TabsContent>

                {audit.comparisonReport && (
                    <TabsContent value="comparison">
                        <section className="mt-6">
                            <div className={"flex flex-col md:flex-row md:items-center items-end justify-between mb-4 gap-4"}>
                                <div className="flex justify-end w-full gap-3 mt-1">
                                    <ContentActions
                                        content={audit.comparisonReport}
                                        auditURL={audit.url}
                                        handleDownloadPdf={() => handleDownloadReportPdf(audit.comparisonReport, `${brandDisplayName} Comparison Report.pdf`)}
                                        isDownloadingPdf={isDownloadingReport}
                                        notdocx={false}
                                    />
                                </div>
                            </div>
                            <Separator className="mb-4" />
                            <div className="prose prose-neutral max-w-none markdown-body space-y-6 dark:prose-invert ">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanAndFlattenBullets(audit.comparisonReport)}</ReactMarkdown>
                            </div>
                        </section>
                    </TabsContent>
                )}

                <TabsContent value="questionnaire">
                    {questionnaireError && (
                        <div className="mt-6 text-center py-10">
                            <Alert variant="destructive" className="max-w-md mx-auto">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Error Generating Questionnaire</AlertTitle>
                                <AlertDescription>{questionnaireError}</AlertDescription>
                            </Alert>
                            <Button variant="outline" className="mt-4" onClick={handleGenerateQuestionnaire}>Try Again</Button>
                        </div>
                    )}
                    {questionnaire && (
                        <section className="mt-6">
                            <div className="flex justify-end mb-4 mt-1">
                                <ContentActions
                                    content={questionnaire}
                                    auditURL={audit.url}
                                    handleDownloadPdf={handleDownloadQuestionnairePdf}
                                    handleDownloadDocx={handleDownloadQuestionnaireDocx}
                                    isDownloadingPdf={isDownloadingQuestionnairePdf}
                                    isDownloadingDocx={isDownloadingQuestionnaireDocx}
                                    notdocx={true}
                                />
                            </div>
                            <Separator className="mb-4" />
                            <div className="prose prose-neutral max-w-none markdown-body space-y-6 dark:prose-invert ">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{questionnaire}</ReactMarkdown>
                            </div>
                        </section>
                    )}
                </TabsContent>

                {audit.results && (
                    <TabsContent value="analysis-data">
                        <section className="mt-6">
                            <LedgerVisualizer data={audit.results} />
                        </section>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}