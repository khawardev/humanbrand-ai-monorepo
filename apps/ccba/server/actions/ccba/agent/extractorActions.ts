"use server";

import { brandRequest } from "@/server/api/brandRequest";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/server/actions/authActions";

export async function createExtractionReport(payload: any, brand_id: any, competitor_id:any) {
    try {
        await getCurrentUser();

        const { success, data, error } = await brandRequest("/bedrock-extraction-report", "POST", payload);
        
        if (!success) return { success: false, message: error };

        brand_id && revalidatePath(`/dashboard/ccba/dashboard/brand/${brand_id}`);
        competitor_id && revalidatePath(`/dashboard/ccba/dashboard/brand/${brand_id}/competitor/${competitor_id}`);
        
        return { success: true, message: "Extraction report created successfully", data };
    } catch (error: any) {
        console.error("createExtractionReport error:", error);
        return { success: false, message: "Failed to create extraction report" };
    }
}

export async function getBrandExtractionReport(brand_id:any) {
    try {
        const user = await getCurrentUser();

        const { success, data, error } = await brandRequest(
            `/bedrock-extraction-report?client_id=${user.client_id}&brand_id=${brand_id}`,
            "GET"
        );

        if (!success) return null;

        return data;
    } catch (error: any) {
        console.error("getExtractionReport error:", error);
        return null;
    }
}

export async function getCompetitorExtractionReport(brand_id: any, competitor_id:any) {
    try {
        const user = await getCurrentUser();

        const { success, data, error } = await brandRequest(
            `/bedrock-extraction-report?client_id=${user.client_id}&brand_id=${brand_id}&competitor_id=${competitor_id}`,
            "GET"
        );

        if (!success) return null;

        return data;
    } catch (error: any) {
        console.error("getExtractionReport error:", error);
        return null;
    }
}
