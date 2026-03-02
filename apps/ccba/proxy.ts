import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authRequest } from "@/server/api/authRequest";

// --- Types ---
interface AuthState {
    user: any | null;
    newAccessToken: string | null;
    newRefreshToken: string | null;
    authFailedExplicitly: boolean;
}

// --- Helpers ---

function setCookiesOnResponse(
    response: NextResponse,
    accessToken: string,
    refreshToken: string
) {
    const isProduction = process.env.NODE_ENV === "production";
    response.cookies.set("access_token", accessToken, {
        httpOnly: true,
        secure: isProduction,
        path: "/",
    });
    response.cookies.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        path: "/",
    });
    return response;
}

function clearAuthCookies(response: NextResponse) {
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
}

function getTokens(request: NextRequest) {
    return {
        accessToken: request.cookies.get("access_token")?.value,
        refreshToken: request.cookies.get("refresh_token")?.value,
    };
}

// --- API Interactions ---

async function validateAccessToken(accessToken: string, pathname: string): Promise<{ user: any | null, failedExplicitly: boolean }> {
    try {
        const userRes = await authRequest("/users/me/", "GET", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (userRes.success) {
            return { user: userRes.data, failedExplicitly: false };
        }

        // Only treat 401/403 as explicit failure
        if (userRes.status === 401 || userRes.status === 403) {
            console.warn(`[Middleware] Token invalid (${userRes.status}). Clearing cookies as per policy.`);
            return { user: null, failedExplicitly: true };
        }

        console.error(`[Middleware] Backend error (${userRes.status}) for ${pathname}:`, userRes.error);
        return { user: null, failedExplicitly: false };

    } catch (err) {
        console.error("[Middleware] Backend connection error during token validation:", err);
        return { user: null, failedExplicitly: false };
    }
}

async function refreshAuthSession(refreshToken: string): Promise<AuthState> {
    const result: AuthState = {
        user: null,
        newAccessToken: null,
        newRefreshToken: null,
        authFailedExplicitly: false
    };

    try {
        const refreshRes = await authRequest("/refresh-token", "POST", {
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!refreshRes.success) {
            console.error("[Middleware] Token refresh failed:", refreshRes.error);
            if (refreshRes.status === 400 || refreshRes.status === 401 || refreshRes.status === 403) {
                result.authFailedExplicitly = true;
            }
            return result;
        }

        result.newAccessToken = refreshRes.data.access_token;
        result.newRefreshToken = refreshRes.data.refresh_token;

        // Try to fetch user with new token
        if (result.newAccessToken) {
            const newUserRes = await authRequest("/users/me/", "GET", {
                headers: { Authorization: `Bearer ${result.newAccessToken}` },
            });

            if (newUserRes.success) {
                result.user = newUserRes.data;
            } else if (newUserRes.status === 401 || newUserRes.status === 403) {
                result.authFailedExplicitly = true;
            } else {
                console.warn("[Middleware] User fetch failed after refresh, but tokens are valid. Proceeding.");
            }
        }

        return result;

    } catch (error) {
        console.error("[Middleware] Token refresh error:", error);
        return result;
    }
}

// --- Main Flow Handlers ---

// --- Main Flow Handlers ---

function handleExplicitAuthFailure(request: NextRequest, isDashboardPath: boolean) {
    const response = isDashboardPath
        ? NextResponse.redirect(new URL("/login", request.url))
        : NextResponse.next();
    
    clearAuthCookies(response);
    return response;
}

function handleAuthenticatedUser(
    request: NextRequest, 
    newAccessToken: string | null, 
    newRefreshToken: string | null
) {
    const { pathname } = request.nextUrl;

    // Strict Rule: Logged-in users are confined to the Dashboard.
    // If the path is NOT a dashboard path (e.g. landing page, login, public docs), redirect them to the dashboard.
    if (!pathname.startsWith("/dashboard")) {
        const redirectRes = NextResponse.redirect(
            new URL("/dashboard/brandos-v2.1/setup", request.url)
        );
        if (newAccessToken && newRefreshToken) {
            setCookiesOnResponse(redirectRes, newAccessToken, newRefreshToken);
        }
        return redirectRes;
    }

    // Allow request to proceed (User is on a dashboard path)
    const response = NextResponse.next();
    if (newAccessToken && newRefreshToken) {
        setCookiesOnResponse(response, newAccessToken, newRefreshToken);
    }
    return response;
}

function handleBackendTimeout(
    request: NextRequest, 
    newAccessToken: string | null, 
    newRefreshToken: string | null
) {
    console.warn("[Middleware] Auth check failed (possibly backend timeout). Allowing request to proceed.");
    
    // We can't trust the cookies on the request if they were invalid, but they weren't explicitly invalid here.
    // We pass the potentially refreshed tokens if we have them.
    const requestHeaders = new Headers(request.headers);
    if (newAccessToken) {
        requestHeaders.set("Authorization", `Bearer ${newAccessToken}`);
        requestHeaders.set("Cookie", `access_token=${newAccessToken}; refresh_token=${newRefreshToken}`);
    }

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    if (newAccessToken && newRefreshToken) {
        setCookiesOnResponse(response, newAccessToken, newRefreshToken);
    }
    
    return response;
}

// --- Main Middleware ---

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isDashboardPath = pathname.startsWith("/dashboard");

    // 1. Get Tokens
    const { accessToken, refreshToken } = getTokens(request);

    // 2. Early Exit: No tokens at all
    if (!accessToken && !refreshToken) {
        if (isDashboardPath) return NextResponse.redirect(new URL("/login", request.url));
        return NextResponse.next();
    }

    // State Variables
    let user = null;
    let authFailedExplicitly = false;
    let newAccessToken: string | null = null;
    let newRefreshToken: string | null = null;

    // 3. Validate Access Token (if present)
    if (accessToken) {
        const validation = await validateAccessToken(accessToken, pathname);
        user = validation.user;
        authFailedExplicitly = validation.failedExplicitly;
    }

    // 4. Attempt Refresh (if needed and safe)
    // Only attempt refresh if:
    // - User is not yet found (accessToken expired or missing)
    // - We have a refresh token
    // - We haven't already failed explicitly (e.g. 401 on access token - per strict policy)
    if (!user && refreshToken && !authFailedExplicitly) {
        const refreshResult = await refreshAuthSession(refreshToken);
        
        user = refreshResult.user;
        newAccessToken = refreshResult.newAccessToken;
        newRefreshToken = refreshResult.newRefreshToken;
        
        if (refreshResult.authFailedExplicitly) {
            authFailedExplicitly = true;
        }
    }

    // 5. Final Decision Logic

    // A) User is authenticated (either via valid access token or successful refresh)
    if (user) {
        return handleAuthenticatedUser(request, newAccessToken, newRefreshToken);
    }

    // B) Explicit Authentication Failure (401/403 anywhere) -> Force Logout
    if (authFailedExplicitly) {
        return handleExplicitAuthFailure(request, isDashboardPath);
    }

    // C) Ambiguous State (User null, but no 401/403 - likely 500 or Network Error)
    // Pass request through with warning to allow client/error boundary handling
    if (isDashboardPath) {
        return handleBackendTimeout(request, newAccessToken, newRefreshToken);
    }

    // D) Public path, no user found, no explicit error -> Allow
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};