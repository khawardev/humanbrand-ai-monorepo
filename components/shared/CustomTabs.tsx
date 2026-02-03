"use client"

import { useId } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface TabItem {
    label: string
    value: string
    icon?: React.ReactNode
    content: React.ReactNode
}

interface CustomTabsProps {
    defaultValue: string
    tabs: TabItem[]
    triggerMaxWidthClass?: string
    className?: string
}

export const CustomTabs: React.FC<CustomTabsProps> = ({ 
    defaultValue, 
    tabs, 
    triggerMaxWidthClass = "max-w-32",
    className
}) => {
    const baseId = useId()
    return (
        <Tabs defaultValue={defaultValue} className={cn("w-full", className)}>
            <TabsList className="w-full justify-start rounded-none border-0 border-b bg-transparent p-0 overflow-x-auto overflow-y-hidden flex-wrap md:flex-nowrap scrollbar-none h-auto">
                {tabs.map(({ label, value, icon }) => {
                    const id = `${baseId}-trigger-${value}`
                    return (
                        <TabsTrigger
                            key={value}
                            value={value}
                            id={id}
                            aria-controls={`${baseId}-content-${value}`}
                            className={cn(
                                "relative h-9 rounded-none data-[state=active]:border-t-0 data-[state=active]:border-r-0 data-[state=active]:border-l-0 border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground shadow-none transition-none",
                                "data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:hover:text-foreground data-[state=active]:shadow-none data-[state=active]:bg-transparent",
                                "hover:bg-transparent hover:text-muted-foreground",
                                "flex items-center gap-2 justify-start",
                                triggerMaxWidthClass
                            )}
                        >
                            {icon && <span className="shrink-0">{icon}</span>}
                            <span className="truncate">{label}</span>
                        </TabsTrigger>
                    )
                })}
            </TabsList>
            {tabs.map(({ value, content }) => (
                <TabsContent key={value} value={value} className="flex flex-col space-y-8 py-4 px-1">
                    {content}
                </TabsContent>
            ))}
        </Tabs>
    )
}
