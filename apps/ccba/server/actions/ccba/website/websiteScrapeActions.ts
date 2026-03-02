"use server";

import { brandRequest } from "@/server/api/brandRequest";
import { revalidatePath } from "next/cache";
import { SCRAPING } from "@/lib/constants";
import { getCurrentUser } from "@/server/actions/authActions";
import { cache } from "react";

export async function scrapeBatchWebsite(brand_id: any, limit: any) {
    try {
        const user = await getCurrentUser();
        if (!user || !user.client_id) {
            console.error("[scrapeBatchWebsite] User not authenticated or missing client_id");
            return { success: false, message: "User not authenticated" };
        }

        const scrapePayload = {
            client_id: user.client_id,
            brand_id: brand_id,
            limit: limit,
            name: `${brand_id} - website Capture`,
        }


        const { success, data, error } = await brandRequest("/batch/website", "POST", scrapePayload);


        if (!success) return { success: false, message: error };

        revalidatePath(`/dashboard/ccba/${brand_id}`);
        revalidatePath(`/dashboard/brandos-v2.1/gather`);
        return { success: true, message: `${SCRAPING} and report extraction successfully`, data };
    } catch (e) {
        console.error("[scrapeBatchWebsite] Error:", e);
        return { success: false, message: `Batch ${SCRAPING} failed` };
    }
}

export async function getWebsiteBatchStatus(brand_id: string, batch_id: string) {
    try {
        const user = await getCurrentUser();
        if (!user || !user.client_id) return null;


        const { success, data, error } = await brandRequest(
            `/batch/website-task-status/${batch_id}?client_id=${user.client_id}&brand_id=${brand_id}`,
            "GET"
        );


        if (!success) return null;

        return data;
    } catch (error) {
        console.error("[getWebsiteBatchStatus] Error:", error);
        return null;
    }
}

export async function getscrapeBatchWebsite(brand_id: string, batch_id: any) {
    try {
        const user = await getCurrentUser();
        if (!user || !user.client_id) return null;

        if (!batch_id) {
            console.warn("[getscrapeBatchWebsite] No batch_id provided");
            return null;
        }

        const { success, data, error } = await brandRequest(
            `/batch/website-scrape-results?client_id=${user.client_id}&brand_id=${brand_id}&batch_id=${batch_id}`,
            "GET"
        );


        if (!success) return null;

        return data;
    } catch (error) {
        console.error("[getscrapeBatchWebsite] Error:", error);
        return null;
    }
}

export async function getWebsiteBatchId(brand_id: string) {
    try {
        const user = await getCurrentUser();
        if (!user || !user.client_id) return null;

        const { success, data, error } = await brandRequest(
            `/batch/website-scrapes?client_id=${user.client_id}&brand_id=${brand_id}`, 
            "GET"
        );

        if (!success) return null;

        if (!Array.isArray(data) || data.length === 0) return null;

        const sorted = data.toSorted((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return sorted[0]?.batch_id ?? null;
    } catch {
        return null;
    }
}

export async function getWebsiteBatchIdWithUser(brand_id: string, user: any) {
    try {
        if (!user || !user.client_id) return null;

        const { success, data, error } = await brandRequest(
            `/batch/website-scrapes?client_id=${user.client_id}&brand_id=${brand_id}`, 
            "GET",
            undefined,
            'no-store'
        );


        if (!success) return null;

        if (!Array.isArray(data) || data.length === 0) return null;

        const sorted = data.toSorted((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const latest = sorted[0];
        return latest ? { batchId: latest.batch_id, status: latest.status, error: latest.error } : null;
    } catch {
        return null;
    }
}

async function fetchPreviousWebsiteScrapsInternal(brand_id: string) {
    try {
        const user = await getCurrentUser();
        if (!user || !user.client_id) return null;

        const { success, data, error } = await brandRequest(
            `/batch/website-scrapes?client_id=${user.client_id}&brand_id=${brand_id}`, 
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
                scraped_pages: item.scraped_pages,
                batch_id: item.batch_id,
                errors: item.errors,
                result_keys: item.result_keys
            }))
            .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());


        return filtered;
    } catch (e) {
        console.error("[getpreviousWebsiteScraps] Error:", e);
        return null;
    }
}

export const getpreviousWebsiteScraps = cache(fetchPreviousWebsiteScrapsInternal);