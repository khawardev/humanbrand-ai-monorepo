'use client'

import { BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarBrands } from "./sidebar-brands"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight } from "lucide-react"

export const SidebarList = ({ data, brands }: any) => {
    const pathname = usePathname()

    return (
        <SidebarGroup>
            <SidebarMenu>
                {data.mainNav.map((item: any) => {
                    if (item.items && item.items.length > 0) {
                        return (
                            <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip={item.title}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items.map((subItem: any) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                                                        <Link href={subItem.href}>
                                                            <span>{subItem.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        )
                    }

                    const link = item.href || item.url || "#"
                    const isActive = pathname === link
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                isActive={isActive}
                            >
                                <Link href={link} className="flex items-center gap-2">
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    {isActive && <p><BreadcrumbSeparator /></p>}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
       
                {data.secondaryNav.map((item: any) => {
                    const link = item.href || item.url || "#"
                    const isActive = pathname === link
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                isActive={isActive}
                            >
                                <Link href={link} className="flex items-center gap-2">
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
            {/* <Separator className="my-3" /> */}
           {/* <SidebarBrands brands={brands} /> */}
        </SidebarGroup>
    )
}