import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from './server/actions/get-session'
import { ADMIN_EMAILS } from './config/aiag-config'

export async function proxy(request: NextRequest) {
	const session = await getSession()
	const path = request.nextUrl.pathname

	const authRoutes = ['/signin', '/signup']

	const publicRoutes = [
		'/signin',
		'/signup',
		'/forgot-password',
		'/reset-password',
		'/sitemap.xml',
		'/robots.txt',
		'/manifest.webmanifest',
		'/opengraph-image',
		'/twitter-image',
		'/favicon.ico',
		'/googleae766bd4b0840054.html',
	]

	const protectedRoutes = [
		'/new',
		'/existing',
		'/campaign',
		'/session',
	]

	const adminRoutes = ['/admin']

	const isAuthRoute = authRoutes.includes(path)

	const isPublicRoute =
		publicRoutes.includes(path) ||
		path.startsWith('/opengraph-image') ||
		path.startsWith('/twitter-image') ||
		path.startsWith('/forgot-password') ||
		path.startsWith('/reset-password') ||
		path.endsWith('.html') ||
		path.endsWith('.xml') ||
		path.endsWith('.txt') ||
		path.endsWith('.ico') ||
		path.endsWith('.png') ||
		path.endsWith('.jpg') ||
		path.endsWith('.svg')

	const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
	const isAdminRoute = adminRoutes.some(route => path.startsWith(route))
	const isDashboardRoute = path.startsWith('/dashboard')

	if (!session) {
		if (isProtectedRoute || isAdminRoute || isDashboardRoute || path === '/') {
			return NextResponse.redirect(new URL('/signin', request.url))
		}
		return NextResponse.next()
	}

	if (session) {
		if (isAuthRoute) {
			return NextResponse.redirect(new URL('/new', request.url))
		}

		if (isAdminRoute) {
			const userEmail = session?.user?.email
			const isAdmin = userEmail ? ADMIN_EMAILS.includes(userEmail) : false
			if (!isAdmin) {
				return NextResponse.redirect(new URL('/new', request.url))
			}
		}

		return NextResponse.next()
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		'/((?!_next|api|static|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|.*\\.html$|.*\\.xml$|.*\\.txt$|.*\\.ico$|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
	],
}
