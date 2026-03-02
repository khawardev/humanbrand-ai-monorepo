"use server";

import { db } from "@/db";
import { getSession } from "@/lib/auth/getSession";
import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { user as userSchema, audit as auditSchema } from "@/db/schema";
import { 
    HBAI_MINI_AUDIT_V4_CAPTURE_REQUEST_PROMPT, 
    HBAI_MINI_AUDIT_V7_SITE_LEDGER, 
    HBAI_MINI_AUDIT_V4_REPORT_PROMPT
} from "@/lib/prompts";
import { spiderCrawlForMiniAudit } from "./spider-crawl";
import { generateNewContent, generateStructuredContent } from "./generateContent";
import { MiniAuditReportSchema, MiniAuditReport } from "@/lib/schemas/miniAuditSchema";

// --- Types ---

type CaptureRequest = {
    action: string;
    pageLimitPerSite: number;
    sites: { role: string; url: string }[];
    crawlRules: any;
    pageFieldsRequired: string[];
};

type SiteLedger = {
    schemaVersion: string;
    input: { websiteUrl: string; pagesCaptured: number };
    [key: string]: any;
};

// --- Helper Functions ---

async function generateCaptureRequest(clientUrl: string, competitorUrls: string[]): Promise<CaptureRequest | null> {
    const prompt = HBAI_MINI_AUDIT_V4_CAPTURE_REQUEST_PROMPT({
        clientUrl,
        competitorUrls,
        pageLimit: 15 // Default preview limit
    });

    const result = await generateNewContent(prompt, "gemini-3-pro-preview");
    if (!result.generatedText) return null;

    try {
        // Clean markdown code blocks if present
        const cleanJson = result.generatedText.replace(/```json\n|\n```/g, "").trim();
        return JSON.parse(cleanJson);
    } catch (e) {
        console.error("Failed to parse CAPTURE_REQUEST JSON", e);
        return null;
    }
}

async function generateSiteLedger(url: string, content: string, pageLimit: number, actualPageCount: number): Promise<SiteLedger | null> {
    const prompt = HBAI_MINI_AUDIT_V7_SITE_LEDGER({
        website_url: url,
        crawledContent: content,
        pagelimit: pageLimit,
        actualPageCount
    });

    // Use a high-capacity model if available, otherwise standard
    const result = await generateNewContent(prompt, "gemini-3-pro-preview");
    if (!result.generatedText) return null;

    try {
        const cleanJson = result.generatedText.replace(/```json\n|\n```/g, "").trim();
        return JSON.parse(cleanJson);
    } catch (e) {
        console.error(`Failed to parse SITE_LEDGER JSON for ${url}`, e);
        return null;
    }
}

async function generateFinalReport(clientLedger: any, competitorLedgers: any[], competitorLabels: string[]): Promise<MiniAuditReport | null> {
    const prompt = HBAI_MINI_AUDIT_V4_REPORT_PROMPT({
        clientLedger,
        competitorLedgers,
        competitorLabels
    });

    const result = await generateStructuredContent(
        prompt, 
        MiniAuditReportSchema,
        "gemini-3-pro-preview",
        "MiniAuditReport", 
        "A comprehensive brand audit report"
    );
    
    return result.object;
}

// --- Main Action ---

export async function createMiniAudit(url: string, competitorUrls: string[] = []) {
    const session = await getSession();
    if (!session?.user?.id) return { error: "You must be logged in to start an audit." };

    // 1. Check Credits
    const currentUser = await db.query.user.findFirst({
        where: eq(userSchema.id, session.user.id),
        columns: { auditCredits: true },
    });

    if (!currentUser) return { error: "User not found." };
    if (currentUser.auditCredits <= 0) return { error: "You have no free reports remaining." };

    // 2. Create Pending Audit
    const [newAudit] = await db
        .insert(auditSchema)
        .values({
            userId: session.user.id,
            url,
            competitorUrls: competitorUrls, 
            status: "pending"
        })
        .returning({ id: auditSchema.id });

    if (!newAudit?.id) return { error: "Failed to create audit record." };

    try {
        // --- Step 1: Capture Request (Prompt 0) ---
        // We technically know the URLs, but we run Prompt 0 to get the "Strict Rules" 
        // and to confirm the LLM "approves" the crawl strategy.
        // In a real optimized flow, we might skip this and just hardcode, but following the "Agentic" design:
        const captureRequest = await generateCaptureRequest(url, competitorUrls);
        if (!captureRequest) throw new Error("Failed to generate capture request.");

        const pageLimit = captureRequest.pageLimitPerSite || 15;

        // --- Step 2: Crawl Client ---
        const clientCrawl = await spiderCrawlForMiniAudit(url, pageLimit);
        if (clientCrawl.error || !clientCrawl.content) throw new Error(clientCrawl.error || "Client crawl failed");

        // --- Step 3: Crawl Competitors ---
        const competitorCrawls: { url: string, content: string, pageCount: number }[] = [];
        const competitorsCrawledContentMap: Record<string, string> = {}; // For DB storage

        for (const compUrl of competitorUrls) {
            const compCrawl = await spiderCrawlForMiniAudit(compUrl, pageLimit);
            if (!compCrawl.error && compCrawl.content) {
                competitorCrawls.push({ 
                    url: compUrl, 
                    content: compCrawl.content,
                    pageCount: compCrawl.urls?.length || 0 
                });
                competitorsCrawledContentMap[compUrl] = compCrawl.content;
            }
        }

        // --- Step 4: Generate Client Ledger (Prompt 1) ---
        const clientLedger = await generateSiteLedger(
            url, 
            clientCrawl.content, 
            pageLimit, 
            clientCrawl.urls?.length || 0
        );
        if (!clientLedger) throw new Error("Failed to generate client ledger.");

        // --- Step 5: Generate Competitor Ledgers (Prompt 1 x N) ---
        const competitorLedgers: any[] = [];
        for (const comp of competitorCrawls) {
            const compLedger = await generateSiteLedger(
                comp.url, 
                comp.content, 
                pageLimit, 
                comp.pageCount
            );
            if (compLedger) {
                competitorLedgers.push(compLedger);
            }
        }

        // --- Step 6: Generate Final Report (Prompt 2) ---
        const finalReport = await generateFinalReport(
            clientLedger,
            competitorLedgers,
            competitorUrls // Use URLs as labels for now
        );

        if (!finalReport) throw new Error("Failed to generate final report.");

        // --- Step 7: Save & Deduct Credit ---
        await db.transaction(async (tx) => {
            await tx
                .update(auditSchema)
                .set({
                    status: "completed",
                    results: {
                        clientLedger,
                        competitorLedgers
                    },
                    crawledContent: clientCrawl.content.slice(0, 1000000), // Limit storage size
                    auditGenratedContent: JSON.stringify(finalReport),
                    competitorsCrawledContent: competitorsCrawledContentMap,
                    updatedAt: new Date(),
                })
                .where(eq(auditSchema.id, newAudit.id));

            await tx
                .update(userSchema)
                .set({ auditCredits: sql`${userSchema.auditCredits} - 1` })
                .where(and(eq(userSchema.id, session.user.id), sql`${userSchema.auditCredits} > 0`));
        });

        revalidatePath(`/audit/${newAudit.id}`);
        return { auditId: newAudit.id };

    } catch (error: any) {
        console.error("Mini Audit failed:", error);
        await db
            .update(auditSchema)
            .set({ status: "failed", updatedAt: new Date() })
            .where(eq(auditSchema.id, newAudit.id));

        return { error: error.message || "An error occurred during the mini audit." };
    }
}
