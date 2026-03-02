"use server";

const API_URL = process.env.API_URL;

const MAX_RETRIES = 3;
const BASE_DELAY = 500;

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function authRequest(
  endpoint: string,
  method: "GET" | "POST",
  options: RequestInit = {}
) {
  let lastError: any = null;
  let lastStatus: number | null = null;
  let data;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json", ...options.headers },
        body: options.body,
        cache: "no-store",
      });

      try { data = await res.json(); } catch { data = null }

      if (res.ok) {
        return { success: true, status: res.status, data };
      }

      // Handle specific status codes that warrant a retry (5xx, 429)
      const isRetryable = res.status >= 500 || res.status === 429;

      if (!isRetryable) {
        // Immediate failure for client errors (400, 401, 403, 404, etc)
        return {
          success: false,
          status: res.status,
          error: data?.message || data?.detail || "Request failed"
        };
      }

      // If retryable
      lastStatus = res.status;
      lastError = data?.message || data?.detail || `Server error ${res.status}`;

      if (attempt < MAX_RETRIES) {
        const waitTime = BASE_DELAY * Math.pow(2, attempt);
        console.warn(`[authRequest] Retry ${attempt + 1}/${MAX_RETRIES} for ${endpoint} (${res.status}) after ${waitTime}ms`);
        await delay(waitTime);
        continue;
      }

    } catch (e: any) {
      // Network errors
      lastError = e?.message || "Network error";
      lastStatus = 0;

      if (attempt < MAX_RETRIES) {
        const waitTime = BASE_DELAY * Math.pow(2, attempt);
        console.warn(`[authRequest] Network retry ${attempt + 1}/${MAX_RETRIES} for ${endpoint} after ${waitTime}ms`);
        await delay(waitTime);
        continue;
      }
    }
  }

  return { 
    success: false, 
    status: lastStatus || 500, 
    error: lastError || "Request failed after retries" 
  };
}