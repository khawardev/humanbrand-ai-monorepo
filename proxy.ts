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

	if (!session) {
		if (isAuthRoute) {
			return NextResponse.next()
		}
		return NextResponse.redirect(new URL('/signin', request.url))
	}

	if (isAuthRoute) {
		return NextResponse.redirect(new URL('/dashboard/ai-chat', request.url))
	}

	if (!isDashboardRoute) {
		return NextResponse.redirect(new URL('/dashboard/ai-chat', request.url))
	}

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
