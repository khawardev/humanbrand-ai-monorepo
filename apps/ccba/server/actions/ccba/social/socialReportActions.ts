"use server";

import { brandRequest } from "@/server/api/brandRequest";
import { revalidatePath } from "next/cache";
import { SOCIAL_SYNTHESIS_PROMPT } from "@/lib/static/prompts";
import { getCurrentUser } from "@/server/actions/authActions";

export async function batchSocialReports({
    brand_id,
    batch_id,
    model_id,
    social_prompt,
}: any) {
    try {
        const user = await getCurrentUser();

        const payload = {
            client_id: user.client_id,
            brand_id: brand_id,
            batch_id: batch_id,
            batch_name: `${brand_id} - website Report`,
            social_prompt: social_prompt ? social_prompt : SOCIAL_SYNTHESIS_PROMPT,
            model_id: model_id,
        };

        const { success, data, error } = await brandRequest("/batch/social-reports", "POST", payload);

        if (!success) return { success: false, message: error };

        revalidatePath(`/dashboard/ccba/${brand_id}`);
        return { success: true, message: "Batch social reports started successfully", data: data.task_id };
    } catch (error: any) {
        console.error("Error in batchSocialReports:", error);
        return { success: false, message: "Failed to start batch social reports" };
    }
}

export async function getBatchSocialReports(brand_id: string) {
    try {
        const user = await getCurrentUser();

        const { success, data, error } = await brandRequest(
            `/batch/social-reports?client_id=${user.client_id}&brand_id=${brand_id}`,
            "GET"
        );

        if (!success) return null;

        return data;
    } catch (error) {
        return null;
    }
}