'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar'
import { AIAGConfig, ADMIN_EMAILS } from '@/config/aiagConfig'

export function SidebarNavigation({ user, newTicketStatus }: { user?: any, newTicketStatus?: { user: Record<string, number>; admin: Record<string, number> } }) {
	const pathname = usePathname()
	const { isMobile, setOpenMobile } = useSidebar()

	return (
		<SidebarGroup>
			<SidebarMenu>
				{AIAGConfig.mainNav
					.filter((item: any) => {
						if (item.title === 'Admin') {
							return user?.isAdmin
						}
						return true
					})
					.map((item: any) => {
						const isActive = pathname === item.href
						const Icon = isActive && item.fillIcon ? item.fillIcon : item.icon

						const statuses: { key: string; count: number; color: string }[] = []

						if (item.title === 'Support' || item.title === 'Admin') {
							const counts = (item.title === 'Support' ? newTicketStatus?.user : newTicketStatus?.admin) || {}
							
							if (counts.pending) {
								statuses.push({ key: 'pending', count: counts.pending, color: 'bg-yellow-500' })
							}
						}

						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
									<Link
										className="relative flex w-full items-center gap-2"
										href={item.href}
										onClick={() => isMobile && setOpenMobile(false)}
									>
										{Icon && <Icon className="size-4" />}
										<span>{item.title}</span>
										{statuses.length > 0 ? (
											<div className="ml-auto flex items-center gap-1">
												{statuses.map((status) => (
													<Badge
														key={status.key}
														variant="secondary"
														className="flex items-center gap-1.5 px-2 py-0.5"
													>
														<span className={`h-1.5 w-1.5 rounded-full ${status.color}`} />
														<span>{status.count}</span>
													</Badge>
												))}
											</div>
										) : (
											<span className="ml-auto">{isActive && <BreadcrumbSeparator />}</span>
										)}
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						)
					})}
			</SidebarMenu>
		</SidebarGroup>
	)
}

