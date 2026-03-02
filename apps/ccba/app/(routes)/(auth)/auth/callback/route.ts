import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const access_token = searchParams.get("access_token");
    const refresh_token = searchParams.get("refresh_token");

    const loginUrl = new URL("/login", request.nextUrl.origin);

    if (!access_token || !refresh_token) {
        loginUrl.searchParams.set("error", "Authentication failed. Please try again.");
        return NextResponse.redirect(loginUrl);
    }

    try {
        const cookieStore = await cookies();

        cookieStore.set("access_token", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
        });

        cookieStore.set("refresh_token", refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
        });

        const dashboardUrl = new URL("/dashboard/ccba", request.nextUrl.origin);
        return NextResponse.redirect(dashboardUrl);

    } catch (error) {
        console.error("Failed to set authentication cookies:", error);
        loginUrl.searchParams.set("error", "An unexpected server error occurred.");
        return NextResponse.redirect(loginUrl);
    }
}