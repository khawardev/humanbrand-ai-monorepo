'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar'
import { AIAGConfig, ADMIN_EMAILS } from '@/config/aiagConfig'

export function SidebarNavigation({ user, newTicketStatus }: { user?: any, newTicketStatus?: { hasNewUserTickets: boolean, hasNewAdminTickets: boolean } }) {
	const pathname = usePathname()
	const { isMobile, setOpenMobile } = useSidebar()

	return (
		<SidebarGroup>
			<SidebarMenu>
				{AIAGConfig.mainNav
					.filter((item: any) => {
						if (item.title === 'Admin') {
							return user?.email && ADMIN_EMAILS.includes(user.email)
						}
						return true
					})
					.map((item: any) => {
						const isActive = pathname === item.href
						const Icon = isActive && item.fillIcon ? item.fillIcon : item.icon
                        
                        const showPulse = (item.title === 'Support' && newTicketStatus?.hasNewUserTickets) || 
                                          (item.title === 'Admin' && newTicketStatus?.hasNewAdminTickets);

						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
									<Link
										className="flex w-full items-center gap-2 relative"
										href={item.href}
										onClick={() => isMobile && setOpenMobile(false)}
									>
										{Icon && <Icon className="size-4" />}
										<span>{item.title}</span>
                                        {showPulse && (
                                            <span className="absolute z-50 right-4 top-4 flex h-2 w-2">
                                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                            </span>
                                        )}
										{!showPulse && <span className="ml-auto">{isActive && <BreadcrumbSeparator />}</span>}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						)
					})}
			</SidebarMenu>
		</SidebarGroup>
	)
}

