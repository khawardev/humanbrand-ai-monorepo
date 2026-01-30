import { Suspense } from 'react'
import { LeftSidebar } from '@/components/shared/sidebar/LeftSidebar'
import { SidebarListSkeleton } from '@/components/shared/sidebar/SidebarListSkeleton'
import { SidebarSessionsList } from '@/components/shared/sidebar/SidebarSessionsList'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { DashboardHeader } from '../../../components/shared/DashboardHeader'
import { getUserWithSavedSessions } from '@/server/actions/usersActions'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	const userWithData: any = await getUserWithSavedSessions()

	return (
		<SidebarProvider>
			<LeftSidebar
				sessionsList={
					<Suspense fallback={<SidebarListSkeleton />}>
						<SidebarSessionsList savedSessions={userWithData?.savedSessions ?? []} />
					</Suspense>
				}
				user={userWithData}
			/>
			<SidebarInset className="relative">
				<DashboardHeader />
				{children}
			</SidebarInset>
		</SidebarProvider>
	)
}
