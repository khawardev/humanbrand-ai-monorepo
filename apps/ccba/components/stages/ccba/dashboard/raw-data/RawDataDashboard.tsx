'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import WebsiteDataView from './website/WebsiteDataView'
import SocialDataView from '@/components/stages/ccba/details/scraps-tab/social/SocialDataView'
import { Suspense } from 'react'
import DashboardSkeleton from '../shared/DashboardSkeleton'
import ScrapDataViewerSkeleton from '@/components/stages/ccba/details/_components/_skeleton/ScrapDataViewerSkeleton'
export default function RawDataDashboard({ websiteScrapsData, socialScrapsData }: any) {
    
    return (
        <Tabs defaultValue="website">
            <TabsList>
                <TabsTrigger value="website">Website</TabsTrigger>
                <TabsTrigger value="social_media">Social Media</TabsTrigger>
            </TabsList>

            <TabsContent value="website">
                <Suspense fallback={<DashboardSkeleton />}>
                    <WebsiteDataView websiteScrapsData={websiteScrapsData} />
                </Suspense>
            </TabsContent>

            <TabsContent value="social_media">
                <Suspense fallback={<ScrapDataViewerSkeleton />}>
                    <SocialDataView socialScrapedData={socialScrapsData} />
                </Suspense>
            </TabsContent>
        </Tabs>
    )
}