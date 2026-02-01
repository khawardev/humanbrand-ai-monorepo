'use client'

import { ChevronsUpDown, LogOut } from 'lucide-react'
import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar'
import { useSignOut } from '@/lib/auth/signout'

export default function SidebarUser({ user, hasFeeds }: any) {
	const [open, setOpen] = useState(false)
	const { handleSignOut } = useSignOut()
	const { isMobile, setOpenMobile } = useSidebar()

	const handleMobileClose = () => {
		if (isMobile) {
			setOpenMobile(false)
		}
	}

	return (
		<DropdownMenu onOpenChange={setOpen} open={open}>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					size="lg"
				>
					<Avatar>
						<AvatarImage
							alt={user?.name || ''}
							className="object-cover"
							src={user?.image || `https://avatar.vercel.sh/${user?.email}.png`}
						/>
						<AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
					</Avatar>

					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">{user?.name}</span>
						<span className="truncate text-muted-foreground text-xs">{user?.email}</span>
					</div>

					<ChevronsUpDown className="ml-auto size-4" />
				</SidebarMenuButton>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="center" className="w-64" side="top" sideOffset={4}>
				<DropdownMenuLabel label="Account" rootOpenSetter={setOpen} />
				<DropdownMenuSeparator />

				<DropdownMenuItem className="dark:bg-border bg-accent ">
					<div className="flex items-center gap-2 text-left text-sm">
						<Avatar>
							<AvatarImage src={user?.image || `https://avatar.vercel.sh/${user?.email}.png`} alt={user?.name || ""} />
							<AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
						</Avatar>

						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{user?.name}</span>
							<span className="truncate text-xs text-muted-foreground">{user?.email}</span>
						</div>
					</div>
					<div className="ml-auto size-2 rounded-full bg-primary" />
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						handleSignOut()
						handleMobileClose()
					}}
					variant="destructive"
				>
					<LogOut /> Sign out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
