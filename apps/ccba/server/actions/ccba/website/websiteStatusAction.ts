"use server";

import { brandRequest } from "@/server/api/brandRequest";
import { getCurrentUser } from "@/server/actions/authActions";

export async function getBatchWebsiteScrapeStatus(brand_id: string, batch_id: string) {
    try {
        const user = await getCurrentUser();
        const { success, data, error } = await brandRequest(`/batch/website-task-status/${batch_id}?client_id=${user.client_id}&brand_id=${brand_id}`, "GET");

        if (!success) return null;

        return data;
    } catch (error) {
        return null;
    }
}

export async function getBatchWebsiteScrapeStatusWithUser(brand_id: string, batch_id: string, user: any) {
    try {
        if (!user || !user.client_id) return null;
        
        const { success, data, error } = await brandRequest(`/batch/website-task-status/${batch_id}?client_id=${user.client_id}&brand_id=${brand_id}`, "GET");

        if (!success) return null;

        return data;
    } catch (error) {
        return null;
    }
}

export async function getBatchWebsiteReportsStatus(brand_id: string, batch_id: string) {
    try {
        const user = await getCurrentUser();
        const { success, data, error } = await brandRequest(`/batch/website-reports-status/${batch_id}?client_id=${user.client_id}&brand_id=${brand_id}`, "GET");

        if (!success) return null;

        return data;
    } catch (error) {
        return null;
    }
}