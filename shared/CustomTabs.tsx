"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
}

export const CustomTabs: React.FC<CustomTabsProps> = ({ defaultValue, tabs, triggerMaxWidthClass = "max-w-30" }) => {
    const tabTriggerClass = `data-[state=active]:after:bg-primary px-0 justify-start data-[state=active]:after:top-[33px] ${triggerMaxWidthClass} dark:data-[state=active]:border-none dark:data-[state=active]:bg-transparent relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none`

    return (
        <Tabs defaultValue={defaultValue}>
            <TabsList className="w-full overflow-x-auto overflow-y-hidden flex-wrap no-scrollbar justify-start rounded-none border-b p-0 md:gap-0 gap-2 bg-transparent">
                {tabs.map(({ label, value, icon }) => (
                    <TabsTrigger key={value} value={value} className={tabTriggerClass}>
                        {icon} {label}
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
