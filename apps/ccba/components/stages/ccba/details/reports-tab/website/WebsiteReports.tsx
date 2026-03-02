'use client'

import { useState, useMemo, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { timeAgo } from '@/lib/utils'
import WebsiteReportDisplay from './WebsiteReportDisplay'
import { TooltipContent, Tooltip,  TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon } from 'lucide-react'
import { EmptyStateCard } from '@/components/shared/CardsUI'
export default function WebsiteReports({ allReportsData, brandName, competitors }: any) {
    const [selectedReportBatchId, setSelectedReportBatchId] = useState<string | null>(null)
    const [selectedSource, setSelectedSource] = useState<any>(null)

    const sortedReports = useMemo(() => {
        if (!allReportsData || allReportsData.length === 0) return []
        return [...allReportsData].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
    }, [allReportsData])

    const selectedReport = useMemo(() => {
        if (!selectedReportBatchId) return null
        return sortedReports.find((report: any) => report.report_batch_id === selectedReportBatchId)
    }, [selectedReportBatchId, sortedReports])

    const dataSources = useMemo(() => {
        if (!selectedReport) return []

        const sources = []
        sources.push({
            name: brandName,
            data: {
                extraction: selectedReport.brand_extraction,
                synthesis: selectedReport.brand_synthesizer
            }
        })

        if (selectedReport.competitor_reports && Array.isArray(selectedReport.competitor_reports)) {
            selectedReport.competitor_reports.forEach((comp: any) => {
                const matchedCompetitor = competitors?.find(
                    (c: any) => c.competitor_id === comp.competitor_id
                )
                sources.push({
                    name: matchedCompetitor?.name || "Unknown Competitor",
                    data: {
                        extraction: comp.extraction_report,
                        synthesis: comp.synthesizer_report
                    }
                })
            })
        }

        return sources
    }, [selectedReport, brandName, competitors])

    useEffect(() => {
        if (sortedReports.length > 0 && !selectedReportBatchId) {
            setSelectedReportBatchId(sortedReports[0].report_batch_id)
        }
        if (dataSources.length > 0) {
            const currentSelection = dataSources.find(s => s.name === selectedSource?.name) || dataSources[0]
            setSelectedSource(currentSelection)
        } else {
            setSelectedSource(null)
        }
    }, [dataSources, sortedReports, selectedReportBatchId, selectedSource?.name])

    if (sortedReports.length === 0) {
        return <EmptyStateCard message="No website report data available." /> 
    }

    if (!selectedSource) {
        return (
            <div className="flex h-[60vh] items-center justify-center p-8 text-center text-muted-foreground">
                Loading report data...
            </div>
        )
    }

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between gap-2">
                <div className='flex items-center gap-2'>
                    <TooltipProvider>
                        {dataSources.map((source, index) => (
                            <div key={source.name} className='flex items-center gap-2'>
                                {index === 1 && <div className="h-6 w-px bg-border" aria-hidden="true" />}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            className='capitalize'
                                            variant={selectedSource?.name === source.name ? "outline" : "ghost"}
                                            onClick={() => setSelectedSource(source)}
                                        >
                                            {source.name}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{index === 0 ? "Select Brand" : "Select Competitor"}</p>
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
                                        <Button variant="outline" className="justify-between">
                                            {sortedReports.find(r => r.report_batch_id === selectedReportBatchId)?.created_at
                                                ? timeAgo(sortedReports.find(r => r.report_batch_id === selectedReportBatchId).created_at)
                                                : "Select report run"}
                                            <ChevronDownIcon  />
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
                            Previous Website Reports
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <WebsiteReportDisplay standardizedReportData={selectedSource} title={selectedSource.name} />
        </div>
    )
}