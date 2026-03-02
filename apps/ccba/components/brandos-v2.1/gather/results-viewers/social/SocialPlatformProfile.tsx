import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPlatformIcon } from '../shared/PlatformIcon';
import { formatNumber } from "../utils";

interface SocialPlatformProfileProps {
    platform: any;
}

export function SocialPlatformProfile({ platform }: SocialPlatformProfileProps) {
    if (!platform?.page_info) return null;

    const { page_info } = platform;

    // Helper to render statistic items safely
    const StatItem = ({ label, value, isCode = false, badge = false }: { label: string, value: any, isCode?: boolean, badge?: boolean }) => {
        if (value === undefined || value === null || value === '') return null;
        
        return (
            <div className="space-y-1 space-x-1">
                <Badge variant={'secondary'} className="text-xs font-normal">{label}</Badge>
                {isCode ? (
                    <code className="text-xs bg-muted px-1 rounded block w-fit max-w-full truncate" title={String(value)}>{value}</code>
                ) : badge ? (
                    <Badge variant="secondary" className="text-xs font-normal">{value}</Badge>
                ) : (
                    <p className="font-medium text-lg truncate" title={String(value)}>
                        {typeof value === 'number' ? formatNumber(value) : value}
                    </p>
                )}
            </div>
        );
    };

    return (
        <Card className="bg-muted/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {getPlatformIcon(platform.platform)}
                    <span className="capitalize">{platform.platform} Profile</span>
                    {page_info.is_verified && (
                        <Badge variant="default" className="text-[10px] h-5 px-1.5 ml-auto">Verified</Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {/* Identity */}
                    <StatItem label="Username" value={page_info.username ? `@${page_info.username}` : null} />
                    <StatItem label="Name" value={page_info.name || page_info.display_name} />
                    
                    {/* Audience */}
                    <StatItem label="Followers" value={page_info.follower_count} />
                    <StatItem label="Subscribers" value={page_info.subscriber_count} />
                    
                    {/* Content Counts */}
                    <StatItem label="Videos" value={page_info.video_count} />
                    <StatItem label="Tweets" value={page_info.tweet_count} />
                    <StatItem label="Posts" value={page_info.post_count} />
                    
                    {/* Engagement */}
                    <StatItem label="Likes" value={page_info.like_count} />
                    <StatItem label="Total Views" value={page_info.total_views} />
                    
                    {/* Company/Professional (LinkedIn) */}
                    <StatItem label="Employees" value={page_info.employee_count} />
                    <StatItem label="Founded" value={page_info.founded} />
                    <StatItem label="Company Size" value={page_info.company_size} badge />
                    <StatItem label="Industry" value={page_info.industry} />
                    <StatItem label="Headquarters" value={page_info.headquarters} />
                    
                    {/* Meta */}
                    <StatItem label="ID" value={page_info.channel_id || page_info.page_id} isCode />
                </div>

                {/* Bio / Description */}
                {(page_info.description || page_info.bio || page_info.tagline) && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                         {page_info.tagline && (
                            <p className="text-muted-foreground">{page_info.tagline}</p>
                        )}
                        {(page_info.description || page_info.bio) && (
                            <div>
                                <Badge variant={'secondary'} className="text-sm mb-4">About</Badge>
                                <p className="leading-relaxed whitespace-pre-wrap">
                                    {page_info.description || page_info.bio}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Specialties (LinkedIn) */}
                {page_info.specialties && Array.isArray(page_info.specialties) && page_info.specialties.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                        <Badge variant={'secondary'} className="text-sm mb-4">Specialties</Badge>
                        <div className="flex flex-wrap gap-2">
                            {page_info.specialties.map((s: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs font-normal">{s}</Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
