"use server";

import { brandRequest } from "@/server/api/brandRequest";
import { getCurrentUser } from "@/server/actions/authActions";

export async function createCamKnowledgeBase(brand_id: string, bam_session_id: string) {
    try {
        const user = await getCurrentUser();
        
        const { success, data, error } = await brandRequest(
            `/cam/knowledge-base/`,
            "POST",
            {
                client_id: user.client_id,
                brand_id,
                bam_session_id,
            },
        );

        if (!success) return { success: false, message: error };

        return { success: true, message: "Knowledge base created successfully", data };
    } catch {
        return { success: false, message: "Failed to create knowledge base" };
    }
}

export async function getCamSessions(brand_id: string) {
    try {
        const user = await getCurrentUser();

        const { success, data, error } = await brandRequest(
            `/cam/sessions?client_id=${user.client_id}&brand_id=${brand_id}`,
            "GET",
        );

        if (!success) return null;

        return data;
    } catch (error) {
        return null;
    }
}
