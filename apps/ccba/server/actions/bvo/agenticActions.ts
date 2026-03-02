"use server";

import { brandRequest } from "@/server/api/brandRequest";
import { getCurrentUser } from "@/server/actions/authActions";
import { pollUntilComplete } from "@/lib/utils";
import { getBvoAgentStatus } from "./agenticStatusActions";

export async function initiateBvoAgenticProcess(brand_id: any, bvoPayload: FormData) {
    try {
        await getCurrentUser();

        const mode = bvoPayload.get("mode");

        if (mode === "interactive") {
            const { success, data, error } = await brandRequest(
                `/bam/agentic`,
                "POST",
                bvoPayload,
            );

            if (!success) return { success: false, message: error };

            const runPayload: any = {
                agent_id: "1",
                custom_instructions: bvoPayload.get("custom_instructions") as string | null ?? undefined,
            };

            const runResponse = await runInteractiveAgent(data.session_id, runPayload);
            return { ...runResponse, session_id: data.session_id };


        } else {
            const { success, data, error } = await brandRequest(
                `/bam/agentic`,
                "POST",
                bvoPayload,
            );

            if (!success) return { success: false, message: error };

            await pollUntilComplete(
                async () => await getBvoAgentStatus(brand_id, data.task_id),
                (res: any) => res.success && res?.status === "Completed"
            );

            return { success: true, message: "Agentic process initiated successfully.", data };
        }
    } catch (error: any) {
        return { success: false, message: "Failed to initiate BVO agentic process" };
    }
}

export async function getBvoHistory(brand_id: string) {
    try {
        const user = await getCurrentUser();

        const { success, data, error } = await brandRequest(
            `/bam/agentic?client_id=${user.client_id}&brand_id=${brand_id}`,
            "GET",
        );

        if (!success) return null;
        return data;
    } catch (error) {
        return null;
    }
}


export async function getBvoAgentResults(task_id: string, brand_id: string) {
    try {
        const user = await getCurrentUser();

        const { success, data, error } = await brandRequest(
            `/bam/agentic/${task_id}/results?client_id=${user.client_id}&brand_id=${brand_id}`,
            "GET",
        );

        if (!success) return null;
        return data;
    } catch (error) {
        return null;
    }
}

export async function runInteractiveAgent(session_id: string, payload: any) {
    try {
        await getCurrentUser();
        
        const { success, data, error } = await brandRequest(
            `/bam/interactive/${session_id}/run`,
            "POST",
            payload,
        );

        if (!success) return { success: false, message: error };
        return { success: true, message: "Interactive agent ran successfully.", data };
    } catch (error: any) {
        console.error("Error in runInteractiveAgent:", error);
        return { success: false, message: "Failed to run interactive agent" };
    }
}

export async function getInteractiveSessionStatus(session_id: string) {
    try {
        await getCurrentUser();

        const { success, data, error } = await brandRequest(
            `/bam/interactive/${session_id}/status`,
            "GET",
        );

        if (!success) return null;
        return data;
    } catch (error) {
        return null;
    }
}

export async function endInteractiveSession(session_id: string) {
    try {
        await getCurrentUser();

        const { success, data, error } = await brandRequest(
            `/bam/interactive/${session_id}/end`,
            "POST",
        );

        if (!success) return { success: false, message: error };
        return { success: true, message: "Interactive session ended successfully.", data };
    } catch (error: any) {
        console.error("Error in endInteractiveSession:", error);
        return { success: false, message: "Failed to end interactive session" };
    }
}
