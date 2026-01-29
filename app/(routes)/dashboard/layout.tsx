import { Suspense } from 'react'
import { LeftSidebar } from '@/components/shared/sidebar/LeftSidebar'
import { SidebarListSkeleton } from '@/components/shared/sidebar/SidebarListSkeleton'
import { SidebarSessionsList } from '@/components/shared/sidebar/SidebarSessionsList'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { DashboardHeader } from '../../../components/shared/DashboardHeader'
import { getUser, getUserWithSavedSessions } from '@/server/actions/usersActions'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const user: any = await getUser()
	const rawUser: any = await getUserWithSavedSessions()

	return (
		<SidebarProvider>
			<LeftSidebar
				sessionsList={
					<Suspense fallback={<SidebarListSkeleton />}>
						<SidebarSessionsList savedSessions={rawUser?.savedSessions ?? []} />
					</Suspense>
				}
				user={user}
			/>
			<SidebarInset className="relative">
				<DashboardHeader />
				{children}
			</SidebarInset>
		</SidebarProvider>
	)
}
