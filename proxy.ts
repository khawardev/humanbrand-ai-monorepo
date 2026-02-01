import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from './server/actions/getSession'
import { ADMIN_EMAILS } from './config/aiagConfig'

export async function proxy(request: NextRequest) {
	const session = await getSession()
	const path = request.nextUrl.pathname

	const isAuthRoute =
		path === '/signin' ||
		path === '/signup' ||
		path.startsWith('/forgot-password') ||
		path.startsWith('/reset-password')

	const isDashboardRoute = path.startsWith('/dashboard')
	const isAdminRoute = path.startsWith('/dashboard/admin')
	const isUnverifiedRoute = path === '/dashboard/unverified'

	// 1. Handle Unauthenticated Users
	if (!session) {
		if (isAuthRoute) {
			return NextResponse.next()
		}
		return NextResponse.redirect(new URL('/signin', request.url))
	}

	// 2. Handle Unverified Users
	// Strict check: if adminVerified is not exactly true, consider unverified
	const isVerified = (session?.user as any)?.adminVerified === true

	if (!isVerified) {
		if (isUnverifiedRoute) {
			return NextResponse.next()
		}
		// Unverified users are strictly redirected to the unverified page
		// regardless of whether they are trying to access dashboard, auth, or root.
		return NextResponse.redirect(new URL('/dashboard/unverified', request.url))
	}

	// 3. Handle Verified Users
	
	// Verified users should NOT access the unverified page
	if (isUnverifiedRoute) {
		return NextResponse.redirect(new URL('/dashboard/ai-chat', request.url))
	}

	// Verified users strictly redirected from auth pages
	if (isAuthRoute) {
		return NextResponse.redirect(new URL('/dashboard/ai-chat', request.url))
	}

	// Verified users must remain in dashboard
	if (!isDashboardRoute) {
		return NextResponse.redirect(new URL('/dashboard/ai-chat', request.url))
	}

	// Admin Check
	if (isAdminRoute) {
		const userEmail = session?.user?.email
		const isAdmin = userEmail ? ADMIN_EMAILS.includes(userEmail) : false
		if (!isAdmin) {
			return NextResponse.redirect(new URL('/dashboard/ai-chat', request.url))
		}
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		'/((?!_next|api|static|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|.*\\.html$|.*\\.xml$|.*\\.txt$|.*\\.ico$|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
	],
}
