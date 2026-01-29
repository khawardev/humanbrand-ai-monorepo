'use client'

import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'

export function DashboardHeader() {
	return (
		<header className="flex h-16 w-full shrink-0 items-center gap-2 rounded-tl-xl rounded-tr-xl border-b bg-accent/30 px-6 transition-[width,height] ease-linear">
			<div className="mr-auto flex items-center gap-2">
				<SidebarTrigger className="-ml-1" />
				<Separator className="h-7" orientation="vertical" />
				<p className="text-muted-foreground text-sm">AIAG CAM 26.1</p>
			</div>
			<div className="flex items-center gap-2">
				<ThemeSwitcher />
			</div>
		</header>
	)
}
