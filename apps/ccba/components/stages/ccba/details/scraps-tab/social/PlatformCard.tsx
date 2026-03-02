'use client';

import { useState } from 'react';
import { FaFacebook, FaXTwitter, FaTiktok } from 'react-icons/fa6';
import { BsLinkedin } from "react-icons/bs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Instagram, Youtube, Users, Eye, Heart, MessageSquare, Share2, Clock, MapPin, Briefcase, Calendar, ChevronDown, ExternalLink, Hash, Music, Film } from 'lucide-react';
import { SCRAPED } from '@/lib/constants';
import { EmptyStateCard } from '@/components/shared/CardsUI';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
        case 'facebook': return <FaFacebook className="h-4 w-4" />;
        case 'instagram': return <Instagram className="h-4 w-4" />;
        case 'linkedin': return <BsLinkedin className="h-4 w-4" />;
        case 'x':
        case 'twitter': return <FaXTwitter className="h-4 w-4" />;
        case 'youtube': return <Youtube className="h-4 w-4" />;
        case 'tiktok': return <FaTiktok className="h-4 w-4" />;
        default: return null;
    }
};

const formatNumber = (num: number | string | undefined): string => {
    if (num === undefined || num === null) return '0';
    const n = typeof num === 'string' ? parseInt(num) : num;
    if (isNaN(n)) return '0';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
};

const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
};

const PageInfo = ({ platform, info }: { platform: string, info: any }) => {
    // Debug logging for PageInfo
    console.log(`[PageInfo] Rendering for ${platform}:`, info);

    if (!info) return null;

    const [showFullDesc, setShowFullDesc] = useState(false);
    const description = info.description || info.bio || info.tagline;
    const hasLongDesc = description && description.length > 150;

    return (
        <div className="bg-muted/30 p-5 rounded-xl mb-6 space-y-5 border border-border/50">
            {/* Header: Name, Username, Verification */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-xl">{info.name || info.display_name || info.username}</h3>
                        {info.is_verified || info.verified ? (
                            <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px] bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 gap-1 border-blue-200/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Verified
                            </Badge>
                        ) : null}
                    </div>

                    {(info.username || info.handle) && (description !== info.username) && (
                        <p className="text-sm font-medium text-muted-foreground">@{info.username || info.handle}</p>
                    )}

                    {/* Description/Bio */}
                    {description && (
                        <div className="pt-2">
                            <p className={`text-sm text-foreground/80 leading-relaxed ${!showFullDesc && hasLongDesc ? 'line-clamp-3' : ''}`}>
                                {description}
                            </p>
                            {hasLongDesc && (
                                <button
                                    onClick={() => setShowFullDesc(!showFullDesc)}
                                    className="text-xs text-primary font-medium hover:underline mt-1"
                                >
                                    {showFullDesc ? 'Show less' : 'Read more'}
                                </button>
                            )}
                        </div>
                    )}

                    {/* LinkedIn Specialties */}
                    {info.specialties && info.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                            {info.specialties.map((spec: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-[10px] bg-background/50">
                                    {spec}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 shrink-0 min-w-[200px]">
                    {(info.follower_count !== undefined) && (
                        <div className="text-center">
                            <p className="font-bold text-lg">{formatNumber(info.follower_count)}</p>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Followers</p>
                        </div>
                    )}
                    {(info.subscriber_count !== undefined) && (
                        <div className="text-center">
                            <p className="font-bold text-lg">{formatNumber(info.subscriber_count)}</p>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Subscribers</p>
                        </div>
                    )}
                    {(info.like_count !== undefined) && (
                        <div className="text-center">
                            <p className="font-bold text-lg">{formatNumber(info.like_count)}</p>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Likes</p>
                        </div>
                    )}
                    {(info.total_views !== undefined) && (
                        <div className="text-center">
                            <p className="font-bold text-lg">{formatNumber(info.total_views)}</p>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Views</p>
                        </div>
                    )}
                    {(info.employee_count !== undefined) && (
                        <div className="text-center">
                            <p className="font-bold text-lg">{formatNumber(info.employee_count)}</p>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Employees</p>
                        </div>
                    )}
                    {(info.post_count !== undefined || info.tweet_count !== undefined || info.video_count !== undefined) && (
                        <div className="text-center">
                            <p className="font-bold text-lg">{formatNumber(info.post_count || info.tweet_count || info.video_count)}</p>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Posts</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Platform Specific Metadata Footer */}
            {(platform.toLowerCase() === 'linkedin' || info.headquarters || info.founded || info.page_id || info.channel_id) && (
                <div className="flex flex-wrap gap-4 pt-4 border-t border-border/40 text-xs text-muted-foreground">
                    {info.industry && (
                        <div className="flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>{info.industry}</span>
                        </div>
                    )}
                    {info.headquarters && (
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{info.headquarters}</span>
                        </div>
                    )}
                    {info.founded && (
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Founded {info.founded}</span>
                        </div>
                    )}
                    {info.company_size && (
                        <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" />
                            <span>{info.company_size}</span>
                        </div>
                    )}
                    {(info.category) && (
                        <div className="flex items-center gap-1.5">
                            <Badge variant="secondary" className="text-[10px] h-5">{info.category}</Badge>
                        </div>
                    )}
                    {/* Metadata IDs */}
                    {info.page_id && <span className="ml-auto opacity-50">Page ID: {info.page_id}</span>}
                    {info.channel_id && <span className="ml-auto opacity-50">Channel ID: {info.channel_id}</span>}
                </div>
            )}
        </div>
    );
};

const PostItem = ({ post, platform }: { post: any, platform: string }) => {
    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success(`${label} copied to clipboard`);
        });
    };

    // Determine content fields based on platform
    const title = post.title || post.sound?.title;
    const body = post.description || post.text || post.message || post.caption || (post.title ? null : JSON.stringify(post)); // Fallback
    const engagement = post.engagement || {};
    const images = post.images || post.image_urls || [];
    const date = post.published_at || post.date_posted;

    // Construct public URL if possible (best effort based on IDs/Usernames)
    // Note: This often requires page username which might be in parent scope, but we use what we have or generic
    const publicUrl = post.scraped_profile_url ||
        (platform === 'tiktok' && post.tiktok_post_id ? `https://www.tiktok.com/video/${post.tiktok_post_id}` :
            (platform === 'youtube' && post.video_id ? `https://www.youtube.com/watch?v=${post.video_id}` : null));

    return (
        <div className="border rounded-xl bg-background overflow-hidden hover:border-primary/50 transition-colors">
            {/* Header: Date + Type */}
            <div className="flex items-center justify-between p-3 bg-muted/20 border-b">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                        {post.entity_type?.replace(/_/g, ' ') || platform}
                    </Badge>
                    {date && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(date).toLocaleDateString()}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {post.is_short && <Badge className="text-[9px] bg-red-500">Short</Badge>}
                    {post.is_competitor && <Badge variant="secondary" className="text-[9px]">Competitor</Badge>}
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* Title/Sound */}
                {title && (
                    <div className="font-semibold flex items-start gap-2">
                        {post.sound ? <Music className="w-4 h-4 mt-1 text-primary" /> : null}
                        <span>{title}</span>
                    </div>
                )}

                {/* Body Text */}
                {body && (
                    <p className="text-sm whitespace-pre-wrap text-muted-foreground line-clamp-4 hover:line-clamp-none">
                        {body}
                    </p>
                )}

                {/* Images/Media */}
                {images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                        {images.map((img: string, idx: number) => (
                            <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-muted border">
                                {img.startsWith('s3://') ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
                                        <div className="px-3 py-1 bg-background/80 rounded text-xs">S3 Media</div>
                                        <code className="text-[9px] px-2 text-center break-all">{img.split('/').pop()}</code>
                                    </div>
                                ) : (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={img} alt="Post media" className="object-cover w-full h-full" />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Hashtags */}
                {(post.hashtags?.length > 0 || post.tags?.length > 0) && (
                    <div className="flex flex-wrap gap-1.5">
                        {[...(post.hashtags || []), ...(post.tags || [])].map((tag: string | any, i: number) => {
                            const tagText = typeof tag === 'string' ? tag : (tag.hashtag || tag.tag || JSON.stringify(tag));
                            return (
                                <Badge key={i} variant="secondary" className="text-[10px] bg-primary/5 hover:bg-primary/10">
                                    <Hash className="w-2 h-2 mr-0.5" />
                                    {tagText.replace(/^#/, '')}
                                </Badge>
                            );
                        })}
                    </div>
                )}

                {/* Engagement Stats */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatNumber(engagement.views || post.views)}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{formatNumber(engagement.likes || post.num_likes)}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{formatNumber(post.comments?.length || engagement.comments || post.num_comments)}</span>
                    <span className="flex items-center gap-1"><Share2 className="w-3 h-3" />{formatNumber(engagement.shares || post.num_shares)}</span>
                </div>

                {/* Collapsible Details (Comments, Transcript, Playlists) */}
                <div className="space-y-2">
                    {/* Comments */}
                    {post.comments && post.comments.length > 0 && (
                        <Collapsible>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="w-full justify-between h-8 text-xs">
                                    <span>Comments ({post.comments.length})</span>
                                    <ChevronDown className="w-3 h-3" />
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <ScrollArea className="h-[150px] w-full rounded-md border p-2 bg-muted/20">
                                    <div className="space-y-2">
                                        {post.comments.map((c: string, i: number) => (
                                            <div key={i} className="text-xs p-2 bg-background rounded border">{c}</div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CollapsibleContent>
                        </Collapsible>
                    )}

                    {/* YouTube Playlists */}
                    {post.playlists && post.playlists.length > 0 && (
                        <Collapsible>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="w-full justify-between h-8 text-xs">
                                    <span>Playlists ({post.playlists.length})</span>
                                    <ChevronDown className="w-3 h-3" />
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div className="space-y-1 p-2 bg-muted/20 rounded-md">
                                    {post.playlists.map((pl: any, i: number) => (
                                        <div key={i} className="text-xs flex justify-between">
                                            <span>{pl.title}</span>
                                            <span className="text-muted-foreground">{pl.video_count} videos</span>
                                        </div>
                                    ))}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    )}

                    {/* Transcript */}
                    {post.transcript && (
                        <Collapsible>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm" className="w-full justify-between h-8 text-xs">
                                    <span>Transcript</span>
                                    <ChevronDown className="w-3 h-3" />
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <ScrollArea className="h-[150px] w-full rounded-md border p-2 bg-muted/20">
                                    <p className="text-xs whitespace-pre-wrap">{post.transcript}</p>
                                </ScrollArea>
                            </CollapsibleContent>
                        </Collapsible>
                    )}
                </div>

                {/* Helper Links */}
                <div className="flex gap-2 pt-2">
                    {publicUrl && (
                        <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" asChild>
                            <Link href={publicUrl} target="_blank">
                                <ExternalLink className="w-3 h-3 " />
                                Original
                            </Link>
                        </Button>
                    )}
                    {post.video_id && (
                        <Button variant="secondary" size="sm" className="h-7 text-xs" onClick={() => handleCopy(post.video_id, 'Video ID')}>
                            Copy ID
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function PlatformCard({ platformData }: any) {
    // Debug logging for PlatformCard
    console.log('[PlatformCard] Received data:', platformData);

    const { platform, posts, page_info } = platformData;

    if (!posts) return null;

    // Deduplicate posts
    const uniquePosts = Array.from(new Map(posts.map((post: any) => [post.SK || post.post_id || post.youtube_post_id || JSON.stringify(post), post])).values());
    const hasError = uniquePosts.some((post: any) => post.error || post.warning);

    return (
        <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className='pt-0 pb-4 px-0'>
                <div className="flex items-center justify-between mb-4">
                    <CardTitle>
                        <Badge variant="outline" className="flex items-center gap-2 w-fit px-3 py-1.5 text-sm font-medium bg-background/80 backdrop-blur-sm border-primary/20">
                            {getPlatformIcon(platform)}
                            <span className="capitalize">{platform}</span>
                        </Badge>
                    </CardTitle>
                    <Badge variant="secondary">{uniquePosts.length} posts</Badge>
                </div>

                {/* Page Info Section */}
                {page_info && <PageInfo platform={platform} info={page_info} />}
            </CardHeader>
            <CardContent className='px-0 pb-0'>
                {uniquePosts && uniquePosts.length > 0 ? (
                    <ScrollArea className="h-[750px] pr-4">
                        <div className="flex flex-col gap-4 pb-4">
                            {uniquePosts.map((post: any, idx: number) => (
                                <PostItem key={post.SK || idx} post={post} platform={platform} />
                            ))}
                        </div>
                    </ScrollArea>
                ) : <EmptyStateCard message={`No posts were ${SCRAPED.toLowerCase()} for this platform for the specified period.`} />}
            </CardContent>
        </Card>
    );
}