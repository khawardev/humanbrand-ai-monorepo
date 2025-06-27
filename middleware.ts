import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_EMAILS } from './config/aiag-config';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
export async function middleware(request: NextRequest) {
    const session = await auth?.api?.getSession({ headers: await headers() });
    const isAdmin = session?.user?.email ? ADMIN_EMAILS.includes(session?.user?.email) : false;
    if (!isAdmin) {
        const homeUrl = new URL('/', request.url);
        return NextResponse.redirect(homeUrl);
    }
    return NextResponse.next();
}

export const config = {
    matcher: '/admin',
};