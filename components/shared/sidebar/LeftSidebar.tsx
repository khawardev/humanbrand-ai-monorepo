'use client'

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarRail,
} from '@/components/ui/sidebar'
import SidebarCollapsable from './SidebarCollpasable'
import { SidebarNavigation } from './SidebarNavigation'
import SidebarUser from './SidebarUser'
import { FullLogo, HalfLogo } from '../Logo'

type LeftSidebarProps = {
	user: any
	sessionsList?: React.ReactNode
}

export function LeftSidebar({ user, sessionsList, ...props }: LeftSidebarProps) {
	return (
		<Sidebar collapsible="icon" variant="inset" {...props}>
			<SidebarHeader>
				<section className="mt-1">
					<div className="hidden group-data-[collapsible=icon]:block">
						<HalfLogo />
					</div>
					<div className="block group-data-[collapsible=icon]:hidden">
						<FullLogo />
					</div>
				</section>
			</SidebarHeader>

			<SidebarContent>
				<SidebarNavigation />
				{sessionsList}
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarUser user={user} />
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarCollapsable />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
