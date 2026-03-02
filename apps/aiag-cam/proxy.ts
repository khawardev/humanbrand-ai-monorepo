import { type NextRequest, NextResponse } from 'next/server'
import { getUser } from './server/actions/usersActions'

export async function proxy(request: NextRequest) {
	const user = await getUser()
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
	if (!user) {
		if (isAuthRoute) {
			return NextResponse.next()
		}
		return NextResponse.redirect(new URL('/signin', request.url))
	}

	// 2. Handle Unverified Users
	// Strict check: if adminVerified is not exactly true, consider unverified
	const isVerified = (user as any)?.adminVerified === true

	if (!isVerified) {
		if (isUnverifiedRoute) {
			return NextResponse.next()
		}
		// Unverified users are strictly redirected to the unverified page
		// regardless of whether they are trying to access dashboard, auth, or root.
		return NextResponse.redirect(new URL('/dashboard/unverified', request.url))
	}

	// 3. Handle Verified Users
	// Verified users should NOT access:
	// - /dashboard/unverified
	// - Auth routes (signin/signup)
	// - Non-dashboard routes (root, etc.)
	if (isUnverifiedRoute || isAuthRoute || !isDashboardRoute) {
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
		const isAdmin = (user as any)?.isAdmin === true
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
