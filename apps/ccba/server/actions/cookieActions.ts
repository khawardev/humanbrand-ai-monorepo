"use server";

import { cookies } from "next/headers";

export async function setGatherCookies(params: {
    brandId: string;
    startDate?: string;
    endDate?: string;
    webLimit?: string;
}) {
    console.log("[setGatherCookies] params:", params);
    await clearGatherCookies();
    const cookieStore = await cookies();
    
    if (params.brandId) {
        cookieStore.set("gather_brandId", params.brandId, { path: "/", maxAge: 60 * 60 * 24 * 30 }); // 30 days
    }
    if (params.startDate) {
        cookieStore.set("gather_startDate", params.startDate, { path: "/", maxAge: 60 * 60 * 24 * 30 });
    }
    if (params.endDate) {
        cookieStore.set("gather_endDate", params.endDate, { path: "/", maxAge: 60 * 60 * 24 * 30 });
    }
    if (params.webLimit) {
        cookieStore.set("gather_webLimit", params.webLimit.toString(), { path: "/", maxAge: 60 * 60 * 24 * 30 });
    }
}

export async function getGatherCookies() {
    const cookieStore = await cookies();
    return {
        brandId: cookieStore.get("gather_brandId")?.value,
        startDate: cookieStore.get("gather_startDate")?.value,
        endDate: cookieStore.get("gather_endDate")?.value,
        webLimit: cookieStore.get("gather_webLimit")?.value,
    };
}

export async function clearGatherCookies() {
    const cookieStore = await cookies();
    cookieStore.delete("gather_brandId");
    cookieStore.delete("gather_startDate");
    cookieStore.delete("gather_endDate");
    cookieStore.delete("gather_webLimit");
}

