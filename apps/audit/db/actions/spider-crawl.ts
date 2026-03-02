import { Spider } from '@spider-cloud/spider-client';
import { logger } from "@/lib/utils";

export async function spiderCrawlWebsite(url: any, limit:any) {
    const functionName = "crawlWebsite";
    logger.info("Spider crawl initiated.", { url });

    if (!url || typeof url !== 'string') {
        logger.warn("Invalid URL provided for crawling.", { functionName, urlProvided: url });
        return { error: 'A valid URL must be provided.' };
    }

    try {
        const app = new Spider({ apiKey: process.env.SPIDER_API_KEY! });

        const crawlParams = {
            limit: limit,
            metadata: false
        };

        const crawlData = await app.crawlUrl(url, crawlParams);

        if (!crawlData || crawlData.length === 0) {
            throw new Error("Crawl failed or returned no data.");
        }

        const urls = crawlData.map((page: any) => page.url);
        const allPagesDataString = crawlData.map((page: any) => {
            const cleanContent = (page.content || '').replace(/\s+/g, ' ').trim();
            let pageContent = `\n[PAGE]: ${page.url}\n`;
            pageContent += `[CONTENT]: ${cleanContent}\n`;
            
            if (page.metadata && Object.keys(page.metadata).length > 0) {
                pageContent += `[META]: ${JSON.stringify(page.metadata)}\n`;
            }
            return pageContent;
        }).join('---\n');

        logger.info("Spider crawl successful, all page content combined.", { url, pageCount: crawlData.length });
        return { content: allPagesDataString, urls };
    } catch (error: any) {
        logger.error("Spider crawl API call failed.", { functionName, url, errorMessage: error.message, errorDetails: error });
        return {
            error: error.message || 'An unknown error occurred during the website crawl.',
            details: error.cause || null
        };
    }
}

/**
 * Specialized crawler for Mini Audit V4.
 * Requests metadata: true and ensures detailed capture for "Site Ledger" analysis.
 * Strict separation from legacy spiderCrawlWebsite.
 */
export async function spiderCrawlForMiniAudit(url: string, limit: number, options?: { crawlRules?: any }) {
    const functionName = "spiderCrawlForMiniAudit";
    logger.info("Mini Audit Spider crawl initiated.", { url, limit });

    if (!url || typeof url !== 'string') {
        return { error: 'A valid URL must be provided.' };
    }

    try {
        const app = new Spider({ apiKey: process.env.SPIDER_API_KEY! });
        
        // V4 requires robust metadata
        const crawlParams = {
            limit: limit,
            metadata: true, // Key difference: we need title, desc, etc.
            return_format: "markdown", // or 'html' if we prefer raw DOM, but MD is usually token-efficient for LLMs
            ...options?.crawlRules // Allow passing specific rules if needed
        };

        const crawlData = await app.crawlUrl(url, crawlParams);

        if (!crawlData || crawlData.length === 0) {
            throw new Error("Crawl failed or returned no data.");
        }

        const urls = crawlData.map((page: any) => page.url);
        
        // Format content specifically for the SITE_LEDGER prompt
        const allPagesDataString = crawlData.map((page: any, index: number) => {
            const cleanContent = (page.content || '').trim();
            
            // Construct a rich page block
            let pageBlock = `--- PAGE ${index + 1} START ---\n`;
            pageBlock += `URL: ${page.url}\n`;
            
            if (page.metadata) {
                pageBlock += `TITLE: ${page.metadata.title || 'N/A'}\n`;
                pageBlock += `DESC: ${page.metadata.description || 'N/A'}\n`;
            }
            
            pageBlock += `CONTENT:\n${cleanContent}\n`;
            pageBlock += `--- PAGE ${index + 1} END ---\n`;
            
            return pageBlock;
        }).join('\n\n');

        logger.info("Mini Audit crawl successful.", { url, pageCount: crawlData.length });
        return { content: allPagesDataString, urls, rawData: crawlData };

    } catch (error: any) {
        logger.error("Mini Audit spider crawl failed.", { functionName, url, error: error.message });
        return {
            error: error.message || 'An unknown error occurred during the mini audit crawl.',
            details: error.cause || null
        };
    }
}