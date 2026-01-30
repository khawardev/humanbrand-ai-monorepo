'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare } from 'lucide-react'
import { BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar'
import { AIAGConfig } from '@/config/aiagConfig'
import { formatCompactTime } from '../ServerFunctions'
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { Badge } from '@/components/ui/badge'

import { toast } from "sonner"
import { deleteSession } from "@/server/actions/savedSessionActions"
import { SidebarMenuAction } from "@/components/ui/sidebar"
import { cn } from '@/lib/utils'


type SidebarSessionsListProps = {
	savedSessions: any[]
}

export function SidebarSessionsList({ savedSessions }: SidebarSessionsListProps) {
	const pathname = usePathname()
	const { isMobile, setOpenMobile } = useSidebar()

	if (!savedSessions || savedSessions.length === 0) {
		return null
	}

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>{AIAGConfig.sidebarTitle}</SidebarGroupLabel>
			<SidebarMenu>
				{savedSessions.map((session: any) => {
					const href = `/dashboard/session/${session.id}`
					const isActive = pathname === href
					const title = session.title || session.name || `Session ${session.id?.slice(0, 8)}`
					
					return (
						<SidebarMenuItem key={session.id}>
							<SidebarMenuButton asChild isActive={isActive} tooltip={title}>
								<Link
									className="flex w-full items-center gap-2 pr-2!"
									href={href}
									onClick={() => isMobile && setOpenMobile(false)}
								>
									<IoChatboxEllipsesOutline className="size-4 shrink-0" />
									<div className="flex flex-col flex-1 min-w-0">
										<span className="truncate text-sm">{title}</span>
									</div>
									<Badge variant='secondary' className="truncate text-[10px] capitalize">
										{session.sessionType}
									</Badge>
									<span className="text-xs text-muted-foreground shrink-0 transition-opacity ease-in delay-50 duration-200 group-hover/menu-item:opacity-0">
										{formatCompactTime(session?.updatedAt)}
									</span>
									<span className="ml-px">{isActive && <BreadcrumbSeparator />}</span>
								</Link>
							</SidebarMenuButton>
							<SidebarMenuAction
								showOnHover
								className={cn('mt-1 transition-all ease-in delay-100', isActive && 'right-7')}
								onClick={() => {
									toast("Delete Session?", {
										description: "This action cannot be undone.",
										action: {
											label: "Delete",
											onClick: async () => {
												const res = await deleteSession(session.id)
												if (res.success) {
													toast.success("Session deleted")
												} else {
													toast.error("Failed to delete session")
												}
											}
										},
										cancel: {
											label: "Cancel",
											onClick: () => { }
										}
									})
								}}
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="icon icon-tabler icons-tabler-filled icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16z" /><path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z" /></svg>
								<span className="sr-only">Delete Session</span>
							</SidebarMenuAction>
						</SidebarMenuItem>
					)
				})}
			</SidebarMenu>
		</SidebarGroup>
	)
}
