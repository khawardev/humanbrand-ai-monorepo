import {SidebarMenuButton, useSidebar} from "@/components/ui/sidebar"
import { PanelLeft, PanelLeftClose } from 'lucide-react'

const SidebarCollapsable = () => {
    const { toggleSidebar, state } = useSidebar()

  return (
      <SidebarMenuButton onClick={toggleSidebar}  className="justify-center text-muted-foreground hover:text-foreground">
          {state === "expanded" ? (
              <>
                  <PanelLeftClose  />
                  <span>Collapse</span>
              </>
          ) : (
              <PanelLeft className="size-4" />
          )}
      </SidebarMenuButton>
  )
}

export default SidebarCollapsable