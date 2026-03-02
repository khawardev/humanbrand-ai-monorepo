'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WebsiteReports from './website/WebsiteReports'
import SocialMediaReports from './social/SocialReports'
import { useState } from 'react'
import { Status, StatusIndicator } from '@/components/ui/shadcn-io/status'
import { DashboardHeader } from "../../dashboard/shared/DashboardComponents"

export default function ReportDataViewer({ allwebsiteReportsData, allSocialReportsData, brandName, competitors }: any) {
    const [activeTab, setActiveTab] = useState("website")
   
    return (
        <div className="flex flex-col space-y-4">
            <DashboardHeader
                title="Brand Reports"
                subtitle="View all generated reports and competitor insights"
            /> 
            <Tabs defaultValue="website" onValueChange={setActiveTab}>
                <div className='flex items-center justify-between'>
                    <TabsList>
                        <TabsTrigger value="website">Website Reports</TabsTrigger>
                        <TabsTrigger value="social-media">Social Media Reports</TabsTrigger>
                    </TabsList>

                    {/* <div className='flex items-center gap-2'>
                        {activeTab === "website" ? (
                            <Status status={allwebsiteReportsData[0] ? "available" : "not-available"} variant="secondary">
                                <StatusIndicator />
                                Website Reports
                            </Status>
                        ) : (
                                <Status status={allSocialReportsData[0] ? "available" : "not-available"} variant="secondary">
                                <StatusIndicator />
                                Social Reports
                            </Status>
                        )}
                    </div> */}
                </div>

                <TabsContent value="website" className="pt-6">
                    <WebsiteReports
                        allReportsData={allwebsiteReportsData}
                        brandName={brandName}
                        competitors={competitors}
                    />
                </TabsContent>

                <TabsContent value="social-media" className="pt-6">
                    <SocialMediaReports
                        allReportsData={allSocialReportsData}
                        brandName={brandName}
                        competitors={competitors}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}