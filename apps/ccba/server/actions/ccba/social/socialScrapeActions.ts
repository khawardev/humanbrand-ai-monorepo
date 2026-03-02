"use server";

import { brandRequest } from "@/server/api/brandRequest";
import { revalidatePath } from "next/cache";
import { SCRAPE, SCRAPING } from "@/lib/constants";
import { getCurrentUser } from "@/server/actions/authActions";
import { cache } from "react";

export async function scrapeBatchSocial(
    brand_id: any,
    start_date: string,
    end_date: string
) {
    try {
        const user = await getCurrentUser();
        if (!user || !user.client_id) {
            console.error("[scrapeBatchSocial] User not authenticated or missing client_id");
            return { success: false, message: "User not authenticated" };
        }

        const scrapePayload = {
            client_id: user.client_id,
            brand_id: brand_id,
            name: `social_scrape_${brand_id}`,
            start_date: start_date,
            end_date: end_date,
        }

        const { success, data, error } = await brandRequest("/batch/social", "POST", scrapePayload);

        if (!success) return { success: false, message: error };

        revalidatePath(`/dashboard/ccba/${brand_id}`);
        revalidatePath(`/dashboard/brandos-v2.1/gather`);
        return { success: true, message: `Social ${SCRAPING} started successfully`, data };
    } catch (error: any) {
        console.error(`[scrapeBatchSocial] Error for brand ${brand_id}:`, error);
        return { success: false, message: `Batch social ${SCRAPING} failed` };
    }
}

export async function getSocialBatchStatus(brand_id: string, batch_id: string) {
    try {
        const user = await getCurrentUser();
        if (!user || !user.client_id) return null;

        const { success, data, error } = await brandRequest(
            `/batch/social-task-status/${batch_id}?client_id=${user.client_id}&brand_id=${brand_id}`,
            "GET"
        );

        if (!success) return null;

        return data;
    } catch (error) {
        console.error("[getSocialBatchStatus] Error:", error);
        return null;
    }
}

export async function getScrapeBatchSocial(brand_id: string, batch_id: any) {
    try {
        const user = await getCurrentUser();
        if (!user || !user.client_id) return null;

        if (!batch_id) {
            console.warn("[getScrapeBatchSocial] No batch_id provided");
            return null;
        }

        const { success, data, error } = await brandRequest(
            `/batch/social-scrape-results?client_id=${user.client_id}&brand_id=${brand_id}&batch_id=${batch_id}`,
            "GET"
        );

        if (!success) return null;

        return data;
    } catch (error) {
        console.error("[getScrapeBatchSocial] Error:", error);
        return null;
    }
}

async function fetchPreviousSocialScrapesInternal(brand_id: string) {
    try {
        const user = await getCurrentUser();
        if (!user || !user.client_id) return null;

        const { success, data, error } = await brandRequest(
            `/batch/social-scrapes?client_id=${user.client_id}&brand_id=${brand_id}`,
            "GET",
            undefined,
            'no-store'
        );

        if (!success) return null;
        if (!Array.isArray(data) || data.length === 0) return [];

        const filtered = data
            .map((item: any) => ({
                brand_id: item.brand_id,
                client_id: item.client_id,
                created_at: item.created_at,
                status: item.status,
                batch_id: item.batch_id,
                start_date: item.start_date,
                end_date: item.end_date,
                error: item.error
            }))
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return filtered;
    } catch (error) {
        console.error("[getPreviousSocialScrapes] Error:", error);
        return null;
    }
}

export const getPreviousSocialScrapes = cache(fetchPreviousSocialScrapesInternal);

export async function getSocialBatchId(brand_id: string) {
    try {
        const user = await getCurrentUser();
        if (!user || !user.client_id) return null;

        const { success, data, error } = await brandRequest(
            `/batch/social-scrapes?client_id=${user.client_id}&brand_id=${brand_id}`, 
            "GET"
        );

        if (!success) return null;
        if (!Array.isArray(data) || data.length === 0) return null;

        const sorted = data.toSorted((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return sorted[0]?.batch_id ?? null;
    } catch (error) {
        console.error("[getSocialBatchId] Error:", error);
        return null;
    }
}

export async function getSocialBatchIdWithUser(brand_id: string, user: any) {
    try {
        if (!user || !user.client_id) return null;

        const { success, data, error } = await brandRequest(
            `/batch/social-scrapes?client_id=${user.client_id}&brand_id=${brand_id}`, 
            "GET",
            undefined,
            'no-store'
        );

        if (!success) return null;
        if (!Array.isArray(data) || data.length === 0) return null;

        const sorted = data.toSorted((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const latest = sorted[0];
        return latest ? { batchId: latest.batch_id, status: latest.status, error: latest.error } : null; 
    } catch (error) {
        console.error("[getSocialBatchIdWithUser] Error:", error);
        return null;
    }
}