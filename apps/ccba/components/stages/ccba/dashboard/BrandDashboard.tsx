'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardSkeleton from './shared/DashboardSkeleton';
import { Suspense } from "react";
import { SCRAPED } from "@/lib/constants";
import { DashboardHeader } from "./shared/DashboardComponents";

export default function BrandDashboard({
    title,
    rawDataTab,
    websiteAuditTab,
    socialAuditTab,
    analyticsDashboardsTab
}: {
    title: string,
    rawDataTab: React.ReactNode,
    websiteAuditTab: React.ReactNode,
    socialAuditTab: React.ReactNode,
    analyticsDashboardsTab: React.ReactNode
}) {

    return (
        <div>
            <Tabs defaultValue="raw_data">
                <TabsList>
                    <TabsTrigger value="raw_data">{SCRAPED} Data</TabsTrigger>
                    <TabsTrigger value="website_audit">Website Audit Reports</TabsTrigger>
                    <TabsTrigger value="social_audit">Social Media Audit Reports</TabsTrigger>
                    <TabsTrigger value="analytics_dashboards">Analytics Dashboard</TabsTrigger>
                </TabsList>

                <TabsContent value="raw_data">
                    <Suspense fallback={<DashboardSkeleton />}>
                        {rawDataTab}
                    </Suspense>
                </TabsContent>

                <TabsContent value="website_audit">
                    <Suspense fallback={<DashboardSkeleton />}>
                        {websiteAuditTab}
                    </Suspense>
                </TabsContent>

                <TabsContent value="social_audit">
                    <Suspense fallback={<DashboardSkeleton />}>
                        {socialAuditTab}
                    </Suspense>
                </TabsContent>

                <TabsContent value="analytics_dashboards">
                    <Suspense fallback={<DashboardSkeleton />}>
                        {analyticsDashboardsTab}
                    </Suspense>
                </TabsContent>
            </Tabs>
        </div>
    );
}