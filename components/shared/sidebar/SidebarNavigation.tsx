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
import { AIAGConfig } from '@/config/aiagConfig'

export function SidebarNavigation() {
	const pathname = usePathname()
	const { isMobile, setOpenMobile } = useSidebar()

	return (
		<SidebarGroup>
			<SidebarMenu>
				{AIAGConfig.mainNav.map((item: any) => {
					const isActive = pathname === item.href
					const Icon = isActive && item.fillIcon ? item.fillIcon : item.icon
					return (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
								<Link
									className="flex w-full items-center gap-2"
									href={item.href}
									onClick={() => isMobile && setOpenMobile(false)}
								>
									{Icon && <Icon className="size-4" />}
									<span>{item.title}</span>
									<span className="ml-auto">{isActive && <BreadcrumbSeparator />}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					)
				})}
			</SidebarMenu>
		</SidebarGroup>
	)
}
