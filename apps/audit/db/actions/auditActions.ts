"use server";

import { db } from "@/db";
import { getSession } from "@/lib/auth/getSession";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { user as userSchema, audit as auditSchema } from "@/db/schema";
import { COMPARISON_AUDIT_PROMPT, INITIAL_AUDIT_PROMPT, companyReportQuestionnairePrompt, extractCompanyNamePrompt } from "@/lib/prompts";
import { spiderCrawlWebsite } from "./spider-crawl";
import { analyzeToken, splitContentByTokens } from "@/lib/tokenizer";
import { generateNewContent } from "./generateContent";

const MAX_TOKENS = 150000;

export async function generateAndSaveQuestionnaire(auditId: string, auditContent: string) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "You must be logged in." };

    try {
        const companyNamePrompt = extractCompanyNamePrompt({ company_report: auditContent });
        const companyNameResult = await generateNewContent(companyNamePrompt);
        const companyName = companyNameResult.generatedText || "Company";

        const questionnairePrompt = companyReportQuestionnairePrompt({ 
            company_report: auditContent, 
            company_name: companyName 
        });
        
        const result = await generateNewContent(questionnairePrompt);
        
        if (result.generatedText) {
            await db.update(auditSchema)
                .set({ 
                    questionnaireContent: result.generatedText,
                    updatedAt: new Date() 
                })
                .where(and(eq(auditSchema.id, auditId), eq(auditSchema.userId, session.user.id)));
            
            revalidatePath(`/audit/${auditId}`);
        }
        
        return result;
    } catch (error: any) {
        console.error("Error generating questionnaire:", error);
        return { generatedText: null, errorReason: error.message || "Failed to generate questionnaire." };
    }
}

export async function createAudit(url: string, competitorUrls: string[] = []) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "You must be logged in to start an audit." };

    const currentUser = await db.query.user.findFirst({
        where: eq(userSchema.id, session.user.id),
        columns: { auditCredits: true },
    });

    if (!currentUser) return { error: "User not found." };
    if (currentUser.auditCredits <= 0) return { error: "You have no free reports remaining." };

    const [newAudit] = await db
        .insert(auditSchema)
        .values({
            userId: session.user.id,
            url,
            competitorUrls: competitorUrls,
        })
        .returning({ id: auditSchema.id });

    if (!newAudit?.id) return { error: "Failed to create audit record." };

    try {
        // 1. Capture Brand Data
        let crawlLimit = 10;
        let brandCrawl: any = await spiderCrawlWebsite(url, crawlLimit);
        if (brandCrawl.error) throw new Error(brandCrawl.error);

        let brandContent = brandCrawl.content;
        const brandPageCount = brandCrawl.urls?.length || 0;

        // 2. Capture Competitor Data
        const competitorsData: { url: string; content: string }[] = [];
        const competitorsCrawledContent: Record<string, string> = {};

        if (competitorUrls.length > 0) {
            for (const compUrl of competitorUrls) {
                const compCrawl: any = await spiderCrawlWebsite(compUrl, 5); // Use 5 pages for competitors
                if (!compCrawl.error) {
                    competitorsData.push({ url: compUrl, content: compCrawl.content });
                    competitorsCrawledContent[compUrl] = compCrawl.content;
                }
            }
        }

        // 3. Generate Brand Audit Report
        const brandAuditResult = await generateSmartAudit({
            url: url,
            content: brandContent,
            limit: crawlLimit,
            pageCount: brandPageCount
        });

        if (!brandAuditResult || brandAuditResult.errorReason)
            throw new Error(brandAuditResult?.errorReason || "Failed to generate brand audit.");

        const finalBrandAuditContent = brandAuditResult.generatedText;

        // 4. Generate Comparison Report (if competitors exist)
        let comparisonReport = null;
        if (competitorsData.length > 0) {
            comparisonReport = await generateSmartComparison({
                url,
                brandContent,
                competitorsData
            });
        }

        // 5. Update Database
        await db.transaction(async (tx) => {
            await tx
                .update(auditSchema)
                .set({
                    status: "completed",
                    results: null,
                    crawledContent: brandContent.slice(0, 2000000),
                    auditGenratedContent: finalBrandAuditContent,
                    competitorsCrawledContent: competitorsCrawledContent,
                    comparisonReport: comparisonReport,
                    updatedAt: new Date(),
                })
                .where(eq(auditSchema.id, newAudit.id));

            await tx
                .update(userSchema)
                .set({ auditCredits: sql`${userSchema.auditCredits} - 1` })
                .where(and(eq(userSchema.id, session.user.id), sql`${userSchema.auditCredits} > 0`));
        }); 
        
        revalidatePath(`/audit/${newAudit.id}`);
        revalidatePath("/");

        return { auditId: newAudit.id };

    } catch (error: any) {
        console.error("Audit creation failed:", error);
        await db
            .update(auditSchema)
            .set({ status: "failed", updatedAt: new Date() })
            .where(eq(auditSchema.id, newAudit.id));

        revalidatePath(`/audit/${newAudit.id}`);
        return { error: error.message || "An error occurred, please try again." };
    }
}

export async function getAuditById(auditId: string) {
    const session = await getSession();
    if (!session?.user?.id) return null;
    
    // Retry logic for DB connection issues
    let retries = 3;
    while (retries > 0) {
        try {
            const result = await db.query.audit.findFirst({
                where: and(eq(auditSchema.id, auditId), eq(auditSchema.userId, session.user.id)),
            });
            return result ?? null;
        } catch (error: any) {
            retries--;
            if (retries === 0) {
                console.error("Error fetching audit after retries:", error);
                return null;
            }
            console.warn(`Database connection failed, retrying... (${3 - retries})`, error.message);
            await new Promise(res => setTimeout(res, 1000)); // Wait 1s before retry
        }
    }
    return null;
}

/**
 * Summarizes content for a specific model context
 */
async function summarizeForContext(content: string, contextDescription: string) {
    const summaryPrompt = `
        SYSTEM: You are an expert Brand Analyst. 
        TASK: Summarize the following ${contextDescription} into key "Brand Genetic Markers" for a comprehensive audit.
        Focus on:
        1. Narrative & Tone (Keywords, voice, complexity)
        2. Audience Signals (Who is being addressed?)
        3. Product/Service DNA (What is being sold and how?)
        4. Proof Points (Case studies, numbers, logos)
        
        Keep the summary factual and dense. Do NOT lose the "Essence" of the brand.
        
        ${contextDescription.toUpperCase()} TO SUMMARIZE:
        ${content}
    `;
    const result = await generateNewContent(summaryPrompt, "gemini-3-pro-preview");
    return result.generatedText || "Summary unavailable.";
}

/**
 * Handles generating an audit for potentially large content by using a Map-Reduce style summarization
 * if the content exceeds the safe token threshold.
 */
async function generateSmartAudit({ url, content, limit, pageCount }: { url: string; content: string; limit: number; pageCount: number }) {
    const tokenCount = analyzeToken(content);
    
    // If it's within a comfortable context window for Gemini
    if (tokenCount <= MAX_TOKENS) {
        const prompt = INITIAL_AUDIT_PROMPT({
            website_url: url,
            crawledContent: content,
            pagelimit: limit,
            actualPageCount: pageCount
        });
        return generateNewContent(prompt);
    }

    // --- LARGE CONTENT STRATEGY ---
    console.log(`[SmartAudit] Content too large (${tokenCount} tokens). Switching to chunked strategy.`);
    
    // Split into chunks that are about half of MAX_TOKENS to be safe for summary generation
    const chunks = splitContentByTokens(content, Math.floor(MAX_TOKENS / 2)); 
    const chunkSummaries: string[] = [];

    let i = 0;
    for (const chunk of chunks) {
        console.log(`[SmartAudit] Summarizing chunk ${i + 1}/${chunks.length}...`);
        // Add artificial delay to respect rate limits
        if (i > 0) await new Promise(r => setTimeout(r, 2000));
        
        const summary = await summarizeForContext(chunk, "website chunk");
        chunkSummaries.push(summary);
        i++;
    }

    // Combine summaries into the final report
    const combinedInsights = chunkSummaries.join("\n\n---\n\n");
    const finalPrompt = INITIAL_AUDIT_PROMPT({
        website_url: url,
        crawledContent: `[SUMMARY OF FULL CRAWL]:\n${combinedInsights}`,
        pagelimit: limit,
        actualPageCount: pageCount
    });

    console.log(`[SmartAudit] Generating final report...`);
    return generateNewContent(finalPrompt);
}

/**
 * Handles comparison reports for potentially large datasets
 */
async function generateSmartComparison({ url, brandContent, competitorsData }: { url: string; brandContent: string; competitorsData: { url: string; content: string }[] }) {
    // Check if total projected prompt size exceeds limit
    let totalEstimatedTokens = analyzeToken(brandContent);
    for (const comp of competitorsData) {
        totalEstimatedTokens += analyzeToken(comp.content);
    }

    // If total exceeds limit, we summarize each player first
    if (totalEstimatedTokens > MAX_TOKENS) {
        console.log(`[SmartComparison] Total content too large (${totalEstimatedTokens} tokens). Summarizing players...`);
        
        const summarizedBrand = await summarizeForContext(brandContent, `Primary Brand (${url})`);
        
        const summarizedCompetitors: { url: string; content: string }[] = [];
        for (const [index, comp] of competitorsData.entries()) {
            console.log(`[SmartComparison] Summarizing competitor (${comp.url})...`);
            // Add delay between competitor summaries
            if (index > 0) await new Promise(r => setTimeout(r, 2000));
            
            const summary = await summarizeForContext(comp.content, `Competitor (${comp.url})`);
            summarizedCompetitors.push({ url: comp.url, content: summary });
        }

        const prompt = COMPARISON_AUDIT_PROMPT({
            brand_url: url,
            brand_content: summarizedBrand,
            competitors: summarizedCompetitors
        });
        const result = await generateNewContent(prompt);
        return result.generatedText;
    }

    // Otherwise generate normally
    const prompt = COMPARISON_AUDIT_PROMPT({
        brand_url: url,
        brand_content: brandContent,
        competitors: competitorsData
    });
    const result = await generateNewContent(prompt);
    return result.generatedText;
}
