import { Suspense } from 'react'
import { LeftSidebar } from '@/components/shared/sidebar/LeftSidebar'
import { SidebarListSkeleton } from '@/components/shared/sidebar/SidebarListSkeleton'
import { SidebarUserSkeleton } from '@/components/shared/sidebar/SidebarUserSkeleton'
import { AsyncSidebarSessionsList } from '@/components/shared/sidebar/AsyncSidebarSessionsList'
import { AsyncSidebarUser } from '@/components/shared/sidebar/AsyncSidebarUser'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { DashboardHeader } from '../../../components/shared/DashboardHeader'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<LeftSidebar
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
