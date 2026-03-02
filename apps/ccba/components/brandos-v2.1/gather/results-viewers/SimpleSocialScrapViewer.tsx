'use client';

import { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import { EmptyStateCard } from '@/components/shared/CardsUI';
import { ViewerProps, SocialStats } from './types';
import { SourceSelector } from './shared/SourceSelector';
import { BatchInfo } from './shared/BatchInfo';
import { SocialStatsCards } from './social/SocialStatsCards';
import { SocialPlatformTabs } from './social/SocialPlatformTabs';

export function SimpleSocialScrapViewer({ scrapsData, brandName, brandData, status }: ViewerProps) {
    const [selectedSource, setSelectedSource] = useState(brandName);
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
    const [selectedPost, setSelectedPost] = useState<any>(null);

    useEffect(() => {
        console.log("[SimpleSocialScrapViewer] Props:", {
            hasScrapsData: !!scrapsData,
            brandName,
            status,
            hasBrandData: brandData,
            hasCompetitorData: brandData.competitors,
            dataKeys: scrapsData ? Object.keys(scrapsData) : []
        });
    }, [scrapsData, brandName, brandData, status]);

    if (!scrapsData) {
        if (status && status !== 'Completed' && status !== 'CompletedWithErrors') {
            return <EmptyStateCard message={`Social capture status: ${status}`} />;
        }
        return <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">No social data collected yet.</div>;
    }

    // Handle potential structure variations in scrapsData
    const brandDataObj = scrapsData.brand || (Array.isArray(scrapsData.social_platforms) ? scrapsData : null);
    const competitors = scrapsData.competitors || brandDataObj?.competitors || [];

    const sources = [
        { 
            name: brandDataObj?.brand_name || brandName, 
            data: brandDataObj, 
            type: 'brand' 
        },
        ...competitors.map((c: any) => ({ 
            name: c.competitor_name || c.name || c.brand_name || "Unknown Competitor", 
            data: c, 
            type: 'competitor' 
        }))
    ];

    const currentSource = sources.find(s => s.name === selectedSource) || sources[0];
    const rawData = currentSource?.data;

    let filteredData = rawData;
    if (brandData && rawData && rawData.social_platforms) {
        let entity: any = null;
        if (currentSource?.type === 'brand') {
            entity = brandData;
        } else {
            entity = brandData.competitors?.find((c: any) => c.name === currentSource?.name);
        }

        if (entity) {
            const configuredPlatforms: string[] = [];
            if (entity.facebook_url) configuredPlatforms.push('facebook');
            if (entity.linkedin_url) configuredPlatforms.push('linkedin');
            if (entity.x_url) configuredPlatforms.push('x', 'twitter');
            if (entity.instagram_url) configuredPlatforms.push('instagram');
            if (entity.youtube_url) configuredPlatforms.push('youtube');
            if (entity.tiktok_url) configuredPlatforms.push('tiktok');
            
            filteredData = {
                ...rawData,
                social_platforms: rawData.social_platforms.filter((p: any) => 
                    configuredPlatforms.some(cp => cp === p.platform?.toLowerCase())
                )
            };
        }
    }

    const platforms = filteredData?.social_platforms || [];

    useEffect(() => {
        if (platforms.length > 0 && !selectedPlatform) {
            setSelectedPlatform(platforms[0].platform);
        }
    }, [platforms, selectedPlatform]);

    const getTotalStats = (): { stats: SocialStats, totalFollowers: number } => {
        if (!filteredData?.social_platforms) return { stats: { posts: 0, views: 0, likes: 0, shares: 0, comments: 0 }, totalFollowers: 0 };
        
        let stats = { posts: 0, views: 0, likes: 0, shares: 0, comments: 0 };
        let totalFollowers = 0;

        filteredData.social_platforms.forEach((platform: any) => {
            // Calculate Audience
            if (platform.page_info) {
                const followers = parseInt(platform.page_info.follower_count) || 0;
                const subscribers = parseInt(platform.page_info.subscriber_count) || 0;
                // Some platforms might have both or just one, typically one primary metric per platform
                totalFollowers += Math.max(followers, subscribers); 
            }

            if (platform.posts) {
                stats.posts += platform.posts.length;
                platform.posts.forEach((post: any) => {
                    if (post.engagement) {
                        stats.views += parseInt(post.engagement.views || 0);
                        stats.likes += parseInt(post.engagement.likes || 0);
                        stats.shares += parseInt(post.engagement.shares || 0);
                        stats.comments += post.comments?.length || parseInt(post.engagement.comments || 0);
                    }
                });
            }
        });
        return { stats, totalFollowers };
    };

    const { stats, totalFollowers } = getTotalStats();

    const handleSourceSelect = (source: string) => {
        setSelectedSource(source);
        setSelectedPlatform(null);
        setSelectedPost(null);
    };

    const handlePlatformSelect = (platform: string) => {
        setSelectedPlatform(platform);
        setSelectedPost(null); 
    };

    return (
        <div className="space-y-6">
            <SourceSelector 
                sources={sources.map(s => s.name)}
                selectedSource={selectedSource}
                onSelect={handleSourceSelect}
                icon={Share2}
            />

            <BatchInfo 
                batchId={scrapsData.batch_id}
                status={scrapsData.status}
                scrapedAt={scrapsData.scraped_at}
                startDate={scrapsData.start_date}
                endDate={scrapsData.end_date}
            />

            {platforms.length > 0 && (
                <SocialStatsCards stats={stats} totalFollowers={totalFollowers} platformCount={platforms.length} />
            )}

            <SocialPlatformTabs 
                platforms={platforms}
                selectedPlatform={selectedPlatform}
                onPlatformSelect={handlePlatformSelect}
                selectedPost={selectedPost}
                onPostSelect={setSelectedPost}
                rawData={rawData}
            />
        </div>
    );
}
