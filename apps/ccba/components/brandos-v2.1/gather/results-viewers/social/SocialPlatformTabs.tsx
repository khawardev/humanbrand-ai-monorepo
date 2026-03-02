import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Share2 } from 'lucide-react';
import { getPlatformIcon } from '../shared/PlatformIcon';
import { SocialPlatformProfile } from './SocialPlatformProfile';
import { SocialPostsList } from './SocialPostsList';
import { SocialPostDetail } from './SocialPostDetail';
import { EmptyStateCard } from '@/components/shared/CardsUI';

interface SocialPlatformTabsProps {
    platforms: any[];
    selectedPlatform: string | null;
    onPlatformSelect: (platform: string) => void;
    selectedPost: any | null;
    onPostSelect: (post: any) => void;
    rawData?: any;
}

const hasPosts = (platform: any): boolean => {
    return platform?.posts && Array.isArray(platform.posts) && platform.posts.length > 0;
};

export function SocialPlatformTabs({
    platforms,
    selectedPlatform,
    onPlatformSelect,
    selectedPost,
    onPostSelect,
    rawData
}: SocialPlatformTabsProps) {
    if (!platforms || platforms.length === 0) {
        return (
            <div className="p-8 text-center text-muted-foreground border border-dashed rounded-xl">
                <Share2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No social platforms data available for this source.</p>
                {rawData?.social_platforms?.length > 0 && (
                    <p className="text-sm mt-2">
                        ({rawData.social_platforms.length} platform(s) available but filtered out based on brand configuration)
                    </p>
                )}
            </div>
        );
    }

    return (
        <Tabs value={selectedPlatform || ''} onValueChange={onPlatformSelect} >
            <TabsList>
                {platforms.map((platform: any) => (
                    <TabsTrigger 
                        key={platform.platform} 
                        value={platform.platform}
                        className="my-2"
                    >
                        {getPlatformIcon(platform.platform)}
                        <span className="capitalize">{platform.platform}</span>
                        <Badge variant={'outline'} className="ml-2 text-foreground">
                            {platform.posts?.length || 0}
                        </Badge>
                    </TabsTrigger>
                ))}
            </TabsList>

            {platforms.map((platform: any) => (
                <TabsContent key={platform.platform} value={platform.platform} className="mt-6 space-y-6">
                    {hasPosts(platform) ? (
                        <>
                            <SocialPlatformProfile platform={platform} />
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                                <SocialPostsList 
                                    posts={platform.posts} 
                                    selectedPost={selectedPost} 
                                    onSelect={onPostSelect} 
                                />

                                <div className="lg:col-span-2">
                                    <SocialPostDetail 
                                        post={selectedPost} 
                                        platformName={platform.platform}
                                        pageUsername={platform.page_info?.username}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <EmptyStateCard 
                            message={`No posts available for ${platform.platform}.`} 
                        />
                    )}
                </TabsContent>
            ))}
        </Tabs>
    );
}
