"use server";

import { brandRequest } from "@/server/api/brandRequest";
import { getCurrentUser } from "@/server/actions/authActions";

export async function getBrandPerceptionReport(brand_id: string) {
    try {
        const user = await getCurrentUser();

        const { success, data, error } = await brandRequest(
            `/dashboard/${user.client_id}/${brand_id}/BRAND_PERCEPTION`,
            "GET", undefined, 'force-cache'
        );

        if (!success) return null;

        return data;
    } catch (error) {
        return null;
    }
}
