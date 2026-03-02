"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ViewType } from "../brand"

interface ViewToggleProps {
    currentView: ViewType
    setCurrentView: (view: ViewType) => void
}

export default function ViewToggle({ currentView, setCurrentView }: ViewToggleProps) {
    return (
        <Tabs
            value={currentView}
            onValueChange={(value) => setCurrentView(value as ViewType)}
        >
            <TabsList >
                <TabsTrigger
                    value="platforms"
                >
                    Brand Platforms
                </TabsTrigger>
                <TabsTrigger
                    value="implications"
                >
                    Strategic Implications
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}
