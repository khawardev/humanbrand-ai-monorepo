import FirecrawlApp from '@mendable/firecrawl-js';
import { logger } from "@/lib/utils";

export async function crawlWebsite(url: any) {
    const functionName = "crawlWebsite";
    logger.info("Crawl initiated.", { url });

    if (!url || typeof url !== 'string') {
        logger.warn("Invalid URL provided for crawling.", { functionName, urlProvided: url });
        return { error: 'A valid URL must be provided.' };
    }

    try {
        const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY! });
        const crawlResponse: any = await app.crawl(url, {
            limit: 10,
            scrapeOptions: {
                formats: ['markdown'],
            }
        });

        if (!crawlResponse.success || !crawlResponse.data) {
            const errorMessage = crawlResponse.error || "Crawl failed with no data returned.";
            throw new Error(errorMessage);
        }

        const allPagesDataString = crawlResponse.data.map((page: any) => {
            let pageContent = `\n\n--- Page Data Start ---\n\n`;
            pageContent += `Markdown Content for page: ${page.metadata?.sourceURL || 'N/A'}\n\n`;
            pageContent += `${page.markdown || 'No markdown content.'}\n\n`;
            pageContent += `Metadata for page: ${page.metadata?.sourceURL || 'N/A'}\n\n`;
            if (page.metadata) {
                for (const key in page.metadata) {
                    if (Object.prototype.hasOwnProperty.call(page.metadata, key)) {
                        const value = page.metadata[key];
                        pageContent += `${key}: ${JSON.stringify(value)}\n`;
                    }
                }
            } else {
                pageContent += 'No metadata available for this page.\n';
            }

            pageContent += `\n--- Page Data End ---\n`;
            return pageContent;
        }).join('');

        logger.info("Crawl successful, all page content combined.", { url });
        return { content: allPagesDataString };

    } catch (error: any) {
        logger.error("Spider crawl API call failed.", { functionName, url, errorMessage: error.message, errorDetails: error });
        return {
            error: error.message || 'An unknown error occurred during the website crawl.',
            details: error.cause || null
        };
    }
}