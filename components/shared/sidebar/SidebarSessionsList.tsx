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
									className="flex w-full items-center gap-2"
									href={href}
									onClick={() => isMobile && setOpenMobile(false)}
								>
									<IoChatboxEllipsesOutline className="size-4 shrink-0" />
									<span className="flex-1 truncate">{title}</span>
									<span className="ml-auto">{isActive && <BreadcrumbSeparator />}</span>
									<span className="text-xs text-muted-foreground shrink-0">
										{formatCompactTime(session?.updatedAt)}
									</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					)
				})}
			</SidebarMenu>
		</SidebarGroup>
	)
}
