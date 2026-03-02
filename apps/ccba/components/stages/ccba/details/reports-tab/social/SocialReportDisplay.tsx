'use client'

import { useState, useMemo, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SynthesizedReportsDashboard from '@/components/stages/ccba/dashboard/synthesized-reports/SynthesizedReportsDashboard'
import { EmptyStateCard } from '@/components/shared/CardsUI'

export default function SocialReportDisplay({ entityReports, selectedEntityName }: any) {
    const [activeTab, setActiveTab] = useState<string>('')

    const availablePlatforms = useMemo(() => {
        if (!entityReports || entityReports.length === 0) return []
        const platformSet = new Set<string>()
        entityReports.forEach((report: any) => {
            if (report.platform) {
                platformSet.add(report.platform)
            }
        })
        return Array.from(platformSet).sort()
    }, [entityReports])

    useEffect(() => {
        if (availablePlatforms.length > 0 && !availablePlatforms.includes(activeTab)) {
            setActiveTab(availablePlatforms[0] as string)
        } else if (availablePlatforms.length === 0) {
            setActiveTab('')
        }
    }, [availablePlatforms, activeTab])

    const analysis = useMemo(() => {
        if (!activeTab || !entityReports) return null
        const reportForPlatform = entityReports.find((r: any) => r.platform === activeTab)
        return reportForPlatform?.analysis
    }, [activeTab, entityReports])

    if (availablePlatforms.length === 0) {
        return <EmptyStateCard message={`No platforms with reports found for ${selectedEntityName}.`} />
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} >
            <TabsList>
                {availablePlatforms.map((platform: string) => (
                    <TabsTrigger key={platform} value={platform} className="capitalize">
                        {platform}
                    </TabsTrigger>
                ))}
            </TabsList>
            <TabsContent value={activeTab}>
                <SynthesizedReportsDashboard synthesizerReport={analysis} title={selectedEntityName} />
            </TabsContent>
        </Tabs>
    )
}