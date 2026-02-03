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
	const user: any = await getUser()
    const newTicketStatus = await checkNewSupportTickets()

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
			</SidebarInset>
		</SidebarProvider>
	)
}
