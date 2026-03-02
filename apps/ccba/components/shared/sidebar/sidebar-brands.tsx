'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { VscCollapseAll } from "react-icons/vsc";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function SidebarBrands({ brands }: { brands: any[] }) {
    const pathname = usePathname()
    const [expandedBrands, setExpandedBrands] = React.useState<Record<string, boolean>>({})

    React.useEffect(() => {
        const newExpanded: Record<string, boolean> = {}
        let hasChange = false

        if (brands) {
            brands.forEach(brand => {
                const isBrand = pathname.includes(brand.brand_id)
                const isCompetitor = brand.competitors?.some((c: any) =>
                    pathname.includes(c.competitor_id)
                )

                if (isBrand || isCompetitor) {
                    newExpanded[brand.brand_id] = true
                    hasChange = true
                }
            })
        }

        if (hasChange) {
            setExpandedBrands(prev => {
                const next = { ...prev }
                let changed = false
                for (const key in newExpanded) {
                    if (!next[key]) {
                        next[key] = true
                        changed = true
                    }
                }
                return changed ? next : prev
            })
        }
    }, [pathname, brands])

    const handleOpenChange = (brandId: string, isOpen: boolean) => {
        setExpandedBrands(prev => ({ ...prev, [brandId]: isOpen }))
    }

    const collapseAll = () => {
        setExpandedBrands({})
    }

    if (!brands?.length) return null

    return (
        <SidebarGroup className=" space-y-2">
            <SidebarGroupLabel className="w-full justify-between">
                Brands
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={collapseAll}
                    title="Collapse All"
                >
                    <VscCollapseAll className="h-3 w-3" />
                </Button>
            </SidebarGroupLabel>
            <SidebarMenu>
                {brands.map(brand => (
                    <BrandItem
                        key={brand.brand_id}
                        brand={brand}
                        pathname={pathname}
                        isOpen={!!expandedBrands[brand.brand_id]}
                        onOpenChange={(open) => handleOpenChange(brand.brand_id, open)}
                    />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}

function BrandItem({
    brand,
    pathname,
    isOpen,
    onOpenChange
}: {
    brand: any;
    pathname: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void
}) {
    const brandUrl = `/dashboard/ccba/dashboard/brand/${brand.brand_id}`
    const isBrand = pathname.includes(brand.brand_id)
    const isScrapped = brand.isScrapped

    if (!isScrapped) {
        return (
            <SidebarMenuItem>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="w-full">
                                <SidebarMenuButton
                                    isActive={isBrand}
                                    className="opacity-50 cursor-not-allowed"
                                >
                                    <span>{brand.name}</span>
                                </SidebarMenuButton>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side='right'>
                            <div className="flex flex-col gap-1 text-xs">
                                <span>1. Gather Social Data</span>
                                <span>2. Generate Website and Social Reports</span>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </SidebarMenuItem>
        )
    }

    return (
        <Collapsible open={isOpen} onOpenChange={onOpenChange}>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton asChild isActive={isBrand}>
                        <Link href={brandUrl}>{brand.name}</Link>
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarGroupLabel>Competitors</SidebarGroupLabel>
                    <SidebarMenuSub>
                        {brand.competitors?.map((comp: any) => {
                            const url = `/dashboard/ccba/dashboard/brand/${brand.brand_id}/competitor/${comp.competitor_id}`
                            const active = pathname === url

                            return (
                                <SidebarMenuSubItem key={comp.competitor_id}>
                                    <SidebarMenuSubButton asChild isActive={active}>
                                        <Link href={url}>{comp.name}</Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            )
                        })}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}