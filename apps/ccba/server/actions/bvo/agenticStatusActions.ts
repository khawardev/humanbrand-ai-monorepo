"use server";

import { brandRequest } from "@/server/api/brandRequest";
import { getCurrentUser } from "@/server/actions/authActions";

export async function getBvoAgentStatus(brand_id: string, task_id: string,) {
    try {
        const user = await getCurrentUser();

        const { success, data, error } = await brandRequest(
            `/bam/agentic/${task_id}/status?client_id=${user.client_id}&brand_id=${brand_id}`,
            "GET",
        );

        if (!success) return null;
        return data;
    } catch (error) {
        return null;
    }
}