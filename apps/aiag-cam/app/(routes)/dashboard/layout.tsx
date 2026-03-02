import { Suspense } from 'react'
import { LeftSidebar } from '@/components/shared/sidebar/LeftSidebar'
import { SidebarListSkeleton } from '@/components/shared/sidebar/SidebarListSkeleton'
import { SidebarUserSkeleton } from '@/components/shared/sidebar/SidebarUserSkeleton'
import { AsyncSidebarSessionsList } from '@/components/shared/sidebar/AsyncSidebarSessionsList'
import { AsyncSidebarUser } from '@/components/shared/sidebar/AsyncSidebarUser'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { DashboardHeader } from '../../../components/shared/DashboardHeader'
import AdminMailAlert from '@/components/shared/AdminMailAlert'
import { getUser } from '@/server/actions/usersActions'
import { checkNewSupportTickets } from '@/server/actions/supportActions'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const [user, newTicketStatus] = await Promise.all([
		getUser(),
		checkNewSupportTickets(),
	]) as [any, any]

	return (
		<SidebarProvider>
			<LeftSidebar
				user={user}
                newTicketStatus={newTicketStatus}
				adminAlert={<AdminMailAlert />}
				sessionsList={
					<Suspense fallback={<SidebarListSkeleton />}>
						<AsyncSidebarSessionsList />
					</Suspense>
				}
				userItem={
					<Suspense fallback={<SidebarUserSkeleton />}>
						<AsyncSidebarUser />
					</Suspense>
				}
			/>
			<SidebarInset className="relative">
				<DashboardHeader />
				{children}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 z-50 isolate  opacity-65 contain-strict block rounded-xl"
				>
					<div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
					<div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
					<div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
				</div>
			</SidebarInset>
		</SidebarProvider>
	)
}
