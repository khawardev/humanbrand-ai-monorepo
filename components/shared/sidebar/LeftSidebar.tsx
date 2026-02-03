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
	user?: any
	userItem?: React.ReactNode
	sessionsList?: React.ReactNode
	adminAlert?: React.ReactNode
    newTicketStatus?: { hasNewUserTickets: boolean, hasNewAdminTickets: boolean }
}

export function LeftSidebar({ user, userItem, sessionsList, adminAlert, newTicketStatus, ...props }: LeftSidebarProps) {
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
				<SidebarNavigation user={user} newTicketStatus={newTicketStatus} />
				{sessionsList}
			</SidebarContent>

			<SidebarFooter>
				{adminAlert}
				<SidebarMenu>
					<SidebarMenuItem>
						{userItem || <SidebarUser user={user} />}
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
