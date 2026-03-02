"use client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TabItem {
    title: string
    value: string
    icon?: React.ReactNode
    content: React.ReactNode
}

interface VercelStyleTabsProps {
    tabs: TabItem[]
    defaultValue: string
    triggerMaxWidthClass?: string
}

export function VercelStyleTabs({ tabs, defaultValue, triggerMaxWidthClass = "max-w-30" }: VercelStyleTabsProps) {
    const [selected, setSelected] = useState(defaultValue)

    return (
        <Tabs value={selected} onValueChange={setSelected}>
            <TabsList className="w-full overflow-x-auto overflow-y-hidden flex-wrap justify-start rounded-none border-b p-0 md:gap-0 gap-2 bg-transparent">
                {tabs.map(({ title, value, icon }) => (
                    <TabsTrigger key={value} value={value}>
                        {icon} {title}
                    </TabsTrigger>
                ))}
            </TabsList>
            {tabs.map(({ value, content }) => (
                <TabsContent key={value} value={value} className="flex flex-col space-y-8 py-4">
                    {content}
                </TabsContent>
            ))}
        </Tabs>
    )
}