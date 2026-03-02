'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { timeAgo } from '@/lib/utils'
import { TooltipContent, Tooltip, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import SocialReportDisplay from './SocialReportDisplay'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon } from 'lucide-react'
import { EmptyStateCard } from '@/components/shared/CardsUI'
export default function SocialMediaReports({ allReportsData, brandName, competitors }: any) {
    const [selectedReportBatchId, setSelectedReportBatchId] = useState<string | null>(null)
    const [selectedEntityName, setSelectedEntityName] = useState<string | null>(null)

    const sortedReports = useMemo(() => {
        if (!allReportsData || allReportsData.length === 0) return []
        return [...allReportsData]
            .filter(report => report.status === 'Completed' && (report.brand_reports?.length > 0 || report.competitor_reports?.length > 0))
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }, [allReportsData])

    const selectedReport = useMemo(() => {
        if (!selectedReportBatchId) return null
        return sortedReports.find((report: any) => report.report_batch_id === selectedReportBatchId)
    }, [selectedReportBatchId, sortedReports])

    const dataSources = useMemo(() => {
        if (!selectedReport) return []

        const sources: any[] = []

        if (selectedReport.brand_reports && selectedReport.brand_reports.length > 0) {
            sources.push({
                name: brandName,
                isBrand: true,
                reports: selectedReport.brand_reports,
            })
        }

        if (selectedReport.competitor_reports && Array.isArray(selectedReport.competitor_reports)) {
            selectedReport.competitor_reports.forEach((compReport: any) => {
                const matchedCompetitor = competitors?.find(
                    (c: any) => c.competitor_id === compReport.competitor_id
                )
                if (matchedCompetitor && compReport.reports && compReport.reports.length > 0) {
                    sources.push({
                        name: matchedCompetitor.name,
                        isBrand: false,
                        reports: compReport.reports,
                    })
                }
            })
        }
        return sources
    }, [selectedReport, brandName, competitors])

    useEffect(() => {
        if (sortedReports.length > 0 && !selectedReportBatchId) {
            setSelectedReportBatchId(sortedReports[0].report_batch_id)
        }
        if (dataSources.length > 0 && !selectedEntityName) {
            setSelectedEntityName(brandName)
        }
    }, [sortedReports, dataSources, brandName, selectedReportBatchId, selectedEntityName])

    if (sortedReports.length === 0) {
        return <EmptyStateCard message="No social media report data available." />
    }

    const selectedEntity = dataSources.find(ds => ds.name === selectedEntityName)

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div className='flex items-center gap-2'>
                    <TooltipProvider>
                        {dataSources.map((source, index) => (
                            <div key={source.name} className='flex items-center gap-2'>
                                {index === 1 && !source.isBrand && <div className="h-6 w-px bg-border" aria-hidden="true" />}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            className='capitalize'
                                            variant={selectedEntityName === source.name ? "outline" : "ghost"}
                                            onClick={() => setSelectedEntityName(source.name)}
                                        >
                                            {source.name}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{source.isBrand ? "Select Brand" : "Select Competitor"}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        ))}
                    </TooltipProvider>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="inline-block">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" >
                                            {sortedReports.find(r => r.report_batch_id === selectedReportBatchId)?.created_at
                                                ? timeAgo(sortedReports.find(r => r.report_batch_id === selectedReportBatchId).created_at)
                                                : "Select Previous reports"}
                                            <ChevronDownIcon />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[135px]">
                                        {sortedReports.map(report => (
                                            <DropdownMenuItem
                                                key={report.report_batch_id}
                                                onClick={() => setSelectedReportBatchId(report.report_batch_id)}
                                            >
                                                {timeAgo(report.created_at)}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            Select Previous Social Reports
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <SocialReportDisplay
                entityReports={selectedEntity?.reports}
                selectedEntityName={selectedEntityName}
            />
        </div>
    )
}