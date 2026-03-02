import { PanelLeft, PanelLeftClose } from 'lucide-react'
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar'

const SidebarCollapsable = () => {
	const { toggleSidebar, state } = useSidebar()

	return (
		<SidebarMenuButton
			className="justify-center text-muted-foreground hover:text-foreground"
			onClick={toggleSidebar}
		>
			{state === 'expanded' ? (
				<>
					<PanelLeftClose />
					<span>Collapse</span>
				</>
			) : (
				<PanelLeft className="size-4" />
			)}
		</SidebarMenuButton>
	)
}

export default SidebarCollapsable
