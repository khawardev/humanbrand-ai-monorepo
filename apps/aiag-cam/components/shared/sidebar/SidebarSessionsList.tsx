'use client'

import { useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar'
import { formatCompactTime } from '../ServerFunctions'
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { Badge } from '@/components/ui/badge'

import { toast } from "sonner"
import { deleteSession } from "@/server/actions/savedSessionActions"
import { cn } from '@/lib/utils'
import { RiChatAiLine } from "react-icons/ri";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu"



type SidebarSessionsListProps = {
	savedSessions: any[]
}

export function SidebarSessionsList({ savedSessions }: SidebarSessionsListProps) {
	const pathname = usePathname()
	const router = useRouter()
	const { isMobile, setOpenMobile } = useSidebar()

	if (!savedSessions || savedSessions.length === 0) {
		return null
	}

	const chatSessions = useMemo(() => savedSessions.filter((session: any) => session.sessionType === 'ai_chat'), [savedSessions])
	const otherSessions = useMemo(() => savedSessions.filter((session: any) => session.sessionType !== 'ai_chat'), [savedSessions])

	const renderSessionItem = (session: any) => {
		const isChat = session.sessionType === 'ai_chat'
		const href = isChat ? `/dashboard/ai-chat/${session.id}` : `/dashboard/session/${session.id}`
		const isActive = pathname === href
		const title = session.title || session.name || `Session ${session.id?.slice(0, 8)}`

		return (
			<SidebarMenuItem key={session.id}>
				<ContextMenu>
					<ContextMenuTrigger asChild>
						<SidebarMenuButton asChild isActive={isActive} tooltip={title}>
							<Link
								className="flex w-full items-center gap-2"
								href={href}
								onClick={() => isMobile && setOpenMobile(false)}
							>
								{isChat ? <RiChatAiLine className="size-4 shrink-0" /> : <IoChatboxEllipsesOutline className="size-4 shrink-0" />}
								<div className="flex flex-col flex-1 min-w-0">
									<span className="truncate text-sm">{title}</span>
								</div>
								{!isChat && (
									<Badge variant='secondary' className="truncate text-[10px] capitalize">
										{session.sessionType}
									</Badge>
								)}
								<span className="text-xs text-muted-foreground shrink-0 ">
									{formatCompactTime(session?.updatedAt)}
								</span>
								<span className="ml-px">{isActive && <BreadcrumbSeparator />}</span>
							</Link>
						</SidebarMenuButton>
					</ContextMenuTrigger>
					<ContextMenuContent className="w-48">
						<ContextMenuItem asChild>
							<Link href={href} className="cursor-pointer">
								Open Session
							</Link>
						</ContextMenuItem>
						<ContextMenuItem
							variant='destructive'
							onClick={() => {
								toast("Delete Session?", {
									description: "This action cannot be undone.",
									action: {
										label: "Delete",
										onClick: async () => {
											const res = await deleteSession(session.id)
											if (res.success) {
												toast.success("Session deleted")
												if (pathname.includes(session.id)) {
													router.push(isChat ? '/dashboard/ai-chat' : '/dashboard')
												}
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
							Delete Session
						</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenu>
			</SidebarMenuItem>
		)
	}

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden w-full">
			<Tabs defaultValue="chats">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="chats">Chats</TabsTrigger>
					<TabsTrigger value="saved">Content</TabsTrigger>
				</TabsList>
				<TabsContent value="chats" className="mt-0 w-full">
					<SidebarMenu>
						{chatSessions.length > 0 ? (
							chatSessions.map(renderSessionItem)
						) : (
							<div className="text-xs text-muted-foreground p-2 text-center">No chat history</div>
						)}
					</SidebarMenu>
				</TabsContent>
				<TabsContent value="saved" className="mt-0 w-full">
					<SidebarMenu>
						{otherSessions.length > 0 ? (
							otherSessions.map(renderSessionItem)
						) : (
							<div className="text-xs text-muted-foreground p-2 text-center">No saved sessions</div>
						)}
					</SidebarMenu>
				</TabsContent>
			</Tabs>
		</SidebarGroup>
	)
}
