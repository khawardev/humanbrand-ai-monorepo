"use server";

import { brandRequest } from "@/server/api/brandRequest";
import { getCurrentUser } from "@/server/actions/authActions";


export async function generateContent(payload: any) {
    try {
        const user = await getCurrentUser();
        

        const { success, data, error } = await brandRequest(
            `/cam/content/`,
            "POST",
            {
                client_id: user.client_id,
                ...payload,
            },
        );

        if (!success) return { success: false, message: error };

        return { success: true, message: "Content generated successfully", data };
    } catch {
        return { success: false, message: "Failed to generate content" };
    }
}


export async function reviseContent(payload: any) {
    try {
        const user = await getCurrentUser();
        

        const { success, data, error } = await brandRequest(
            `/cam/revise/`,
            "POST",
            {
                client_id: user.client_id,
                ...payload,
            },
        );

        if (!success) return { success: false, message: error };

        return { success: true, message: "Content revised successfully", data };
    } catch {
        return { success: false, message: "Failed to revise content" };
    }
}
