'use server'

import { cookies } from "next/headers";
import { getCurrentUser } from "../actions/authActions";
const API_URL = process.env.API_URL;

export async function agentRequest(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: any,
    cache: RequestCache = "no-store"
) {
    await getCurrentUser();

    const accessToken = (await cookies()).get("access_token")?.value;
    if (!accessToken) throw new Error("Unauthorized");

    const headers: HeadersInit = { Authorization: `Bearer ${accessToken}` };
    const isFormData = body instanceof FormData;

    if (!isFormData) headers["Content-Type"] = "application/json";

    // Increase timeout for agent requests if possible, but fetch doesn't support timeout directly without AbortController
    // Standard fetch here.
    const res = await fetch(`${API_URL}${endpoint}`, {
        method, headers, body: isFormData ? body : body ? JSON.stringify(body) : undefined, cache,
    });

    let data;
    try { data = await res.json(); } catch { data = null }

    if (res.ok) {
        return { success: true, data };
    }

    return { success: false, error: data?.message || data?.detail || "Request failed" };
}
