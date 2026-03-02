"use server";

import { brandRequest } from "@/server/api/brandRequest";
import { EXTRACTOR_PROMPT, SYNTHESIS_PROMPT } from "@/lib/static/prompts";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/server/actions/authActions";

export async function batchWebsiteReports({ brand_id, batch_id, model_id, sythesizerPrompt }: any) {
    try {
        const user = await getCurrentUser();

        const payload = {
            client_id: user.client_id,
            brand_id: brand_id,
            batch_id: batch_id,
            batch_name: `${brand_id}_report`,
            extraction_prompt: EXTRACTOR_PROMPT,
            synthesizer_prompt: sythesizerPrompt ? sythesizerPrompt : SYNTHESIS_PROMPT,
            model_id: `${model_id}`
        };

        const { success, data, error } = await brandRequest("/batch/website-reports", "POST", payload);

        if (!success) return { success: false, message: error };

        revalidatePath(`/dashboard/ccba/${brand_id}`);
        return { success: true, message: "Batch website reports started successfully", data: data.task_id };
    } catch {
        return { success: false, message: "Failed to start batch website reports" };
    }
}


export async function getBatchWebsiteReports(brand_id: string) {
    try {
        const user = await getCurrentUser();
        
        const { success, data, error } = await brandRequest(
            `/batch/website-reports?client_id=${user.client_id}&brand_id=${brand_id}`,
            "GET"
        );

        if (!success) return null;

        return data;
    } catch (error) {
        return null;
    }
}
