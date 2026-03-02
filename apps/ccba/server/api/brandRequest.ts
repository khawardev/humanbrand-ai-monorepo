'use server'

import { cookies } from "next/headers";
const API_URL = process.env.API_URL;

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 100;

async function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getAccessToken(): Promise<string | null> {
    try {
        const accessToken = (await cookies()).get("access_token")?.value;
        return accessToken || null;
    } catch {
        return null;
    }
}

export async function brandRequestWithToken(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    accessToken: string,
    body?: any,
    cache: RequestCache = "no-store"
) {
    if (!accessToken) {
        return { success: false, error: "Unauthorized - No access token" };
    }

    const headers: HeadersInit = { Authorization: `Bearer ${accessToken}` };
    const isFormData = body instanceof FormData;

    if (!isFormData) headers["Content-Type"] = "application/json";

    let lastError: any = null;
    const RETRY_BASE_DELAY = 500;
    const MAX_RETRIES_EXTENDED = 3;

    for (let attempt = 0; attempt <= MAX_RETRIES_EXTENDED; attempt++) {
        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method, 
                headers, 
                body: isFormData ? body : body ? JSON.stringify(body) : undefined, 
                cache,
            });

            let data;
            try { 
                data = await res.json(); 
            } catch { 
                data = null; 
            }

            if (res.ok) {
                return { success: true, data };
            }

            if (res.status === 401) {
                const errorDetail = data?.message || data?.detail;
                // If it's a token expiry, we might want to return authError: true immediately
                // But some 401s might be transient (unlikely). 
                // We'll trust 401 is hard failure.
                return { success: false, error: errorDetail || "Unauthorized - Token expired", authError: true };
            }

            // Retry on Server Errors (5xx) or Rate Limits (429)
            if ((res.status >= 500 || res.status === 429) && attempt < MAX_RETRIES_EXTENDED) {
                lastError = data?.message || data?.detail || `Server error ${res.status}`;
                const waitTime = RETRY_BASE_DELAY * Math.pow(2, attempt);
                await delay(waitTime);
                continue;
            }

            // Other client errors (400, 403, 404) - Return immediately
            return { success: false, error: data?.message || data?.detail || "Request failed" };

        } catch (e: any) {
            lastError = e?.message || "Network error";
            
            if (attempt < MAX_RETRIES_EXTENDED) {
                const waitTime = RETRY_BASE_DELAY * Math.pow(2, attempt);
                await delay(waitTime);
                continue;
            }
            
            console.error("[brandRequestWithToken] Fetch error:", e);
            return { success: false, error: "Network error" };
        }
    }

    return { success: false, error: lastError || "Request failed after retries" };
}

export async function brandRequest(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: any,
    cache: RequestCache = "no-store"
) {
    const accessToken = (await cookies()).get("access_token")?.value;
    
    if (!accessToken) {
        return { success: false, error: "Unauthorized - No access token" };
    }

    return brandRequestWithToken(endpoint, method, accessToken, body, cache);
}

