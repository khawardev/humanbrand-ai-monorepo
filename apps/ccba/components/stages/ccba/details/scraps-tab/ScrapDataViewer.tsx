'use client'

import { Status, StatusIndicator } from '@/components/ui/shadcn-io/status';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SCRAPS } from '@/lib/constants';
import React, { useState } from 'react';
import { DashboardHeader } from '../../dashboard/shared/DashboardComponents';

export default function ScrapDataViewer({
    websiteScrapsComponent,
    socialScrapsComponent
}: {
    websiteScrapsComponent: React.ReactNode,
    socialScrapsComponent: React.ReactNode
}) {
    const [activeTab, setActiveTab] = useState("website")

    return (
        <div className="flex flex-col space-y-8">
            <section className=' flex items-center justify-between w-full'>
                <DashboardHeader
                    title={`Brand ${SCRAPS}`}
                    subtitle={`View all Website and Social Media data for Brand and it's Competitors`}
                />
            </section>
            <Tabs defaultValue="website" onValueChange={setActiveTab} >
                <div className='flex items-center justify-between'>
                    <TabsList >
                        <TabsTrigger value="website">Website {SCRAPS}</TabsTrigger>
                        <TabsTrigger value="social-media">Social Media {SCRAPS}</TabsTrigger>
                    </TabsList>
                    <div className=' flex items-center gap-2'>
                        {/* {activeTab === "website" ? (
                            <>
                                <Status status="available" >
                                    <StatusIndicator />
                                    Website Data Capture
                                </Status>
                            </>
                        ) : (
                            <>
                                <Status status="pending" >
                                    <StatusIndicator />
                                    Social Data Capture
                                </Status>
                            </>
                        )} */}
                    </div>
                </div>
                <TabsContent value="website" className="pt-6">
                    {websiteScrapsComponent}
                </TabsContent>
                <TabsContent value="social-media" className="pt-6">
                    {socialScrapsComponent}
                </TabsContent>
            </Tabs>
        </div>
    );
}