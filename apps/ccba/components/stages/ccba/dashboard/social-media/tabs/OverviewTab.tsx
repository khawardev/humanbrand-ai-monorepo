'use client'

import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Activity, Award, Globe, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CustomChartTooltipContent from "@/components/stages/ccba/dashboard/shared/CustomChartTooltipContent"
import KpiCard from "../charts-and-cards/KpiCard"
import CustomLegend from "../../shared/Legend"
import { BRAND_SOCIAL_COLOR } from "@/lib/static/dashboardColor"
import { formatCount } from "@/lib/utils"

export default function OverviewTab({ data }: any) {
    const { platforms } = data
    const { PLATFORM_COLORS }: any = BRAND_SOCIAL_COLOR
    const platformKeys = Object.keys(platforms)

    const safeNumber = (val: any) => {
        if (val === null || val === undefined || val === "") return 0
        const num = Number(val)
        return isNaN(num) ? 0 : num
    }

    const platformData = Object.values(platforms).map((platform: any) => ({
        name: platform.name,
        followers: safeNumber(platform.followers),
        posts: safeNumber(platform.posts),
        engagement: safeNumber(platform.avgEngagement),
        sentiment: safeNumber(platform.sentiment?.positive),
    }))

    const totalReach = platformData.reduce((sum, p) => sum + p.followers, 0)
    const totalPosts = platformData.reduce((sum, p) => sum + p.posts, 0)
    const avgSentiment = platformData.length
        ? Math.round(platformData.reduce((sum, p) => sum + p.sentiment, 0) / platformData.length)
        : 0

    let platformName = "-"
    let platformFollowersInK = "0k"

    if (platformData.length > 0) {
        const topPlatform = platformData.reduce((prev, current) =>
            prev.followers > current.followers ? prev : current
        )
        platformName = topPlatform.name
        platformFollowersInK = `${Math.round(topPlatform.followers / 1000)}k`
    }
    const maxFollowers = Math.max(...platformData.map(p => p.followers)) || 1

    const normalizedPlatformData = platformData.map(p => ({
        ...p,
        engagement_scaled: Number(((p.engagement / maxFollowers) * maxFollowers).toFixed(1)),
        followers: p.followers,
    }))
    return (
        <Tabs defaultValue="total_overview">
            <div className="w-full">
                <TabsList>
                    <TabsTrigger value="total_overview">Total Overview</TabsTrigger>
                    {platformKeys.map(key => (
                        <TabsTrigger key={key} value={key}>{platforms[key].name}</TabsTrigger>
                    ))}
                </TabsList>
            </div>

            <div>
                <TabsContent value="total_overview" className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <KpiCard title="Total Reach" value={formatCount(totalReach)} description="Combined followers" icon={Globe} />
                        <KpiCard title="Total Content" value={totalPosts} description="Posts across all platforms" icon={Activity} />
                        <KpiCard title="Avg Positive Sentiment" value={`${avgSentiment}%`} description="Average across platforms" icon={Heart} />
                        <KpiCard title="Top Platform" value={platformName} description={`${platformFollowersInK} followers of reach`} icon={Award} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="lg:col-span-4">
                            <CardHeader><CardTitle>Platform Performance Overview</CardTitle></CardHeader>
                            <CardContent className="h-[400px] w-full p-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={normalizedPlatformData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid horizontal={false} vertical={false} />
                                        <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                        <Tooltip content={<CustomChartTooltipContent />} />
                                        <Legend content={<CustomLegend />} />
                                        <Bar dataKey="engagement_scaled" fill="#75E80B" name="Avg Engagement" radius={6} />
                                        <Bar dataKey="followers" fill="#ef4444" name="Followers" radius={6} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-3">
                            <CardHeader><CardTitle>Platform Reach Distribution</CardTitle></CardHeader>
                            <CardContent className="h-[400px] w-full p-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={platformData} dataKey="followers" nameKey="name" cx="50%" cy="50%" outerRadius={120}>
                                            {platformData.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.name]} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Legend content={<CustomLegend />} />
                                        <Tooltip content={<CustomChartTooltipContent />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {platformKeys.map(key => {
                    const platform = platforms[key]
                    return (
                        <TabsContent key={key} value={key}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <span style={{ color: PLATFORM_COLORS[platform.name] }}>{platform.name}</span> Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <KpiCard title="Followers" value={safeNumber(platform.followers).toLocaleString()} />
                                    <KpiCard title="Posts" value={safeNumber(platform.posts)} />
                                    <KpiCard title="Positive Sentiment" value={`${safeNumber(platform.sentiment?.positive)}%`} />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    )
                })}
            </div>
        </Tabs>
    )
}