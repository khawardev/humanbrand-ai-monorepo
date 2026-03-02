'use client'
import {
    Command,
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInput,
    SidebarMenu,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { FullLogo, HalfLogo } from "../Logo"
import WhatsNew from "./whats-new"
import SidebarCollapsable from "./sidebar-collpasable"
import { SidebarList } from "./sidebar-list"
import SidebarUser from "./sidebar-user"
import { BrandOSConfig } from "@/config/brandos-sidebar-config"

export function LeftSidebar({ user, ...props}: any) {

    return (
        <Sidebar collapsible="icon" variant='inset' {...props}>
            <SidebarHeader>
                <section>
                    <div className="hidden group-data-[collapsible=icon]:block">
                        <HalfLogo />
                    </div>
                    <div className="block group-data-[collapsible=icon]:hidden">
                        <FullLogo />
                    </div>
                </section>
                {/* <div className="px-1 my-2 relative group-data-[collapsible=icon]:hidden text-base">
                    <div className="relative">
                        <Command className="absolute left-2 top-2.5 size-3.5 text-muted-foreground" />
                        <SidebarInput placeholder="Search" className="pl-8 bg-background border-input" />
                        <div className="absolute right-2 top-2 hidden items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                            <span className="text-xs">⌘</span>K
                        </div>
                    </div>
                </div> */}
            </SidebarHeader>
            
            <SidebarContent>
                <SidebarList data={BrandOSConfig} />
            </SidebarContent>

            <SidebarFooter>
                {/* <WhatsNew /> */}
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarUser user={user} />
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarCollapsable />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}