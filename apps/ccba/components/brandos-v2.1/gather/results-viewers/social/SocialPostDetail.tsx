"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Copy, ExternalLink, Eye, Heart, MessageSquare, Share2, Youtube, ThumbsUp, Calendar, Clock, PlayCircle } from 'lucide-react';
import { FaTiktok, FaInstagram, FaLinkedin, FaFacebook, FaTwitter } from 'react-icons/fa6';
import NextLink from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { formatNumber, formatDuration, normalizeImageUrl } from '../utils';
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import { SocialStatCard } from "./SocialStatsCards";
import { Skeleton } from "@/components/ui/skeleton";

interface SocialPostDetailProps {
    post: any | null;
    platformName: string;
    pageUsername?: string;
}

export function SocialPostDetail({ post, platformName, pageUsername }: SocialPostDetailProps) {
    if (!post) {
        return (
            <Card className="h-full flex flex-col items-center justify-center min-h-[400px] border-dashed shadow-none bg-muted/30">
                <div className="text-center space-y-3">
                    <div className="bg-background p-4 rounded-full inline-flex shadow-sm">
                        <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-medium text-foreground">No Post Selected</h3>
                        <p className="text-sm text-muted-foreground">Select a post from the list to view full details</p>
                    </div>
                </div>
            </Card>
        );
    }

    // Normalizing content fields
    const contentText = post.description || post.text || post.message || post.full_text || post.caption || '';
    
    // Logic to include thumbnail and deduplicate
    let images = post.image_urls || post.images || [];
    if (!Array.isArray(images)) images = [];
    
    // Prepend thumbnail if available
    if (post.thumbnail && typeof post.thumbnail === 'string') {
        const thumb = post.thumbnail;
        // Avoid duplicates if reasonable
        if (!images.includes(thumb)) {
             images = [thumb, ...images];
        }
    }

    // Platform Icon Helper
    const getPlatformIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'youtube': return <Youtube className="w-4 h-4 text-red-600" />;
            case 'tiktok': return <FaTiktok className="w-4 h-4" />;
            case 'instagram': return <FaInstagram className="w-4 h-4 text-pink-600" />;
            case 'linkedin': return <FaLinkedin className="w-4 h-4 text-blue-700" />;
            case 'facebook': return <FaFacebook className="w-4 h-4 text-blue-600" />;
            case 'twitter': case 'x': return <FaTwitter className="w-4 h-4" />;
            default: return <Share2 className="w-4 h-4" />;
        }
    };

    // Tag normalization helper
    const renderTags = (tags: any[]) => {
        return tags.map((tag: any, i: number) => {
            const label = typeof tag === 'string' ? tag : tag.hashtag || tag.tag;
            const href = typeof tag === 'object' && tag.link ? tag.link : null;

            const badge = (
                <Badge 
                    key={i} 
                    variant="secondary" 
                >
                   {label}
                </Badge>
            );

            if (href) {
                return <NextLink key={i} href={href} target="_blank">{badge}</NextLink>;
            }
            return badge;
        });
    };

    return (
        <div className="h-full border-none shadow-none bg-transparent space-y-6">
            
            {/* 1. Header Section */}
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                             <Badge variant='outline' >
                                {getPlatformIcon(platformName)}
                                <span className="capitalize">{platformName} Post</span>
                            </Badge>
                        </div>
                        <h2 className="text-2xl font-medium leading-tight tracking-tight line-clamp-2">
                            {post.title}
                        </h2>
                        {post.published_at && (
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(post.published_at).toLocaleDateString(undefined, {
                                        year: 'numeric', month: 'short', day: 'numeric'
                                    })}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    {new Date(post.published_at).toLocaleTimeString(undefined, {
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Media Section */}
            <div className="space-y-4">
                {post.video_id && platformName === 'youtube' ? (
                    <div className="rounded-xl overflow-hidden shadow-sm border bg-black aspect-video relative group">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${post.video_id}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0"
                        ></iframe>
                    </div>
                ) : (
                   images && images.length > 0 && (
                        <div className={`grid gap-2 ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {images.slice(0, 4).map((url: string, idx: number) => {
                                const validUrl = normalizeImageUrl(url);
                                if (!validUrl || (!validUrl.startsWith('http') && !validUrl.startsWith('/'))) return null;

                                return (
                                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-muted group">
                                         <ImageWithSkeleton
                                            src={validUrl}
                                            alt={`Post media ${idx + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-500"
                                            unoptimized={validUrl.endsWith('.svg')}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                   )
                )}
            </div>

            {/* 3. Engagement Stats Bar */}
           

            <div className="grid gap-6">
                {/* 4. Text Content */}
                {contentText && (
                     <Card>
                         <CardContent >
                            <ScrollArea className="max-h-[300px] pr-4">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word text-muted-foreground">
                                    {contentText}
                                </p>
                            </ScrollArea>
                         </CardContent>
                     </Card>
                )}
                {post.engagement && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {post.engagement.views !== undefined && (
                            <SocialStatCard
                                icon={Eye}
                                label="Views"
                                value={post.engagement.views}
                                className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20"
                                iconContainerClassName="bg-purple-500/20"
                                iconClassName="text-purple-600"
                            />
                        )}
                        {(post.engagement.likes !== undefined || post.engagement.reactions !== undefined) && (
                            <SocialStatCard
                                icon={post.engagement.reactions !== undefined ? ThumbsUp : Heart}
                                label={post.engagement.reactions !== undefined ? 'Reactions' : 'Likes'}
                                value={post.engagement.likes || post.engagement.reactions}
                                className="bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-500/20"
                                iconContainerClassName="bg-pink-500/20"
                                iconClassName="text-pink-600"
                            />
                        )}
                        {(post.comments?.length !== undefined || post.engagement.comments !== undefined) && (
                            <SocialStatCard
                                icon={MessageSquare}
                                label="Comments"
                                value={post.comments?.length || post.engagement.comments || 0}
                                className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20"
                                iconContainerClassName="bg-blue-500/20"
                                iconClassName="text-blue-600"
                            />
                        )}
                        {post.engagement.shares !== undefined && (
                            <SocialStatCard
                                icon={Share2}
                                label="Shares"
                                value={post.engagement.shares}
                                className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20"
                                iconContainerClassName="bg-green-500/20"
                                iconClassName="text-green-600"
                            />
                        )}
                    </div>
                )}
                {/* 5. Metadata & Tech Details */}
                {(post.video_id || post.duration_seconds || post.is_short !== undefined || post.sound) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {post.video_id && (
                             <DetailItem label="Video ID" value={post.video_id} copyable />
                         )}
                         {post.duration_seconds !== undefined && (
                             <DetailItem label="Duration" value={formatDuration(post.duration_seconds)} />
                         )}
                         {post.is_short !== undefined && (
                             <DetailItem label="Format" value={
                                <Badge variant={post.is_short ? "destructive" : "secondary"} className="h-5 px-1.5 text-[10px]">
                                    {post.is_short ? 'Short / Reel' : 'Standard Video'}
                                </Badge>
                             } />
                         )}
                         {post.sound && (
                             <DetailItem label="Audio" value={
                                 <div className="flex flex-col gap-0.5 max-w-full overflow-hidden">
                                     <span className="truncate text-xs font-medium" title={post.sound.title}>{post.sound.title}</span>
                                     <span className="text-[10px] text-muted-foreground">{post.sound.is_original ? 'Original Audio' : 'Licensed Track'}</span>
                                 </div>
                             } />
                         )}
                    </div>
                )}

                {/* 6. Tags & Hashtags */}
                {(post.hashtags?.length > 0 || post.tags?.length > 0) && (
                   <div className="space-y-3">
                        {post.hashtags?.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hashtags</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {renderTags(post.hashtags)}
                                </div>
                            </div>
                        )}
                        {post.tags?.length > 0 && (
                             <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground uppercase ">Mentions & Tags</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {renderTags(post.tags)}
                                </div>
                            </div>
                        )}
                   </div>
                )}
                
                {/* 7. Footer Actions */}
                 <div className="flex flex-wrap gap-2 pt-2">
                    {post.scraped_profile_url && (
                        <ActionButton href={post.scraped_profile_url} icon={ExternalLink} label="View Profile" />
                    )}
                    {post.scraped_channel_url && (
                        <ActionButton href={post.scraped_channel_url} icon={ExternalLink} label="View Channel" />
                    )}
                    {post.scraped_page_url && (
                        <ActionButton href={post.scraped_page_url} icon={ExternalLink} label="View Page" />
                    )}
                    {post.video_id && platformName === 'youtube' && (
                         <ActionButton href={`https://www.youtube.com/watch?v=${post.video_id}`} icon={Youtube} label="Watch on YouTube" />
                    )}
                    {post.video_id && platformName === 'tiktok' && pageUsername && (
                        <ActionButton href={`https://www.tiktok.com/@${pageUsername}/video/${post.video_id}`} icon={FaTiktok} label="Watch on TikTok" />
                    )}
                </div>

                {/* 8. Additional Data (Transcript/Comments) */}
                 {(post.transcript || (post.comments && post.comments.length > 0)) && (
                     <div className="space-y-2">
                         {post.transcript && <ExpandableSection title="Transcript" content={post.transcript} icon={FileText} />}
                         {post.playlists?.length > 0 && ( 
                            <ExpandableList title={`Playlists (${post.playlists.length})`} items={post.playlists} type="playlists" icon={PlayCircle} />
                         )}
                         {post.comments?.length > 0 && (
                            <ExpandableList title={`Comments (${post.comments.length})`} items={post.comments} type="comments" icon={MessageSquare} />
                         )}
                     </div>
                 )}

            </div>
        </div>
    );
}


function DetailItem({ label, value, copyable }: { label: string, value: any, copyable?: boolean }) {
    const handleCopy = () => {
        if (typeof value === 'string') {
             navigator.clipboard.writeText(value).then(() => toast.success("Copied!"));
        }
    };
    
    return (
        <div className="bg-muted/30 rounded-lg border p-3 flex justify-between items-center gap-3">
            <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-medium text-muted-foreground uppercase">{label}</span>
                <div className="h-4 w-px bg-border mx-1"></div>
                <div className="text-sm font-medium truncate">
                    {value}
                </div>
            </div>
            {copyable && typeof value === 'string' && (
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={handleCopy}>
                    <Copy className="w-3 h-3 text-muted-foreground" />
                </Button>
            )}
        </div>
    );
}

function ActionButton({ href, icon: Icon, label }: any) {
    return (
        <Button variant="outline" size="sm" asChild className="h-8 gap-2 bg-background hover:bg-muted/50">
            <NextLink href={href} target="_blank">
                <Icon className="w-3.5 h-3.5" />
                {label}
            </NextLink>
        </Button>
    )
}

function ExpandableSection({ title, content, icon: Icon }: any) {
    return (
        <Collapsible className="group border rounded-lg bg-background">
             <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between hover:bg-muted/50 h-10 px-4">
                    <span className="text-sm font-medium flex items-center gap-2 text-muted-foreground group-data-[state=open]:text-foreground">
                        {Icon && <Icon className="size-4" />} {title}
                    </span>
                    <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                 <ScrollArea className="h-[200px] bg-muted/20 p-4 border-t">
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{content}</p>
                </ScrollArea>
            </CollapsibleContent>
        </Collapsible>
    )
}

function ExpandableList({ title, items, type, icon: Icon }: any) {
     return (
        <Collapsible className="group border rounded-lg bg-background">
             <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between hover:bg-muted/50 h-10 px-4">
                    <span className="text-sm font-medium flex items-center gap-2 text-muted-foreground group-data-[state=open]:text-foreground">
                         {Icon && <Icon className="size-4" />} {title}
                    </span>
                    <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                 <ScrollArea className="h-[200px] bg-muted/20 border-t">
                    <div className="p-2 space-y-2">
                        {items.map((item: any, i: number) => (
                             <div key={i} className="bg-background rounded-md border p-3 text-sm text-muted-foreground">
                                {type === 'playlists' ? (
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-foreground">{item.title}</span>
                                        <Badge variant="secondary" className="text-[10px]">{item.video_count} vids</Badge>
                                    </div>
                                ) : (
                                    <p>{typeof item === 'string' ? item : JSON.stringify(item)}</p>
                                )}
                             </div>
                        ))}
                    </div>
                </ScrollArea>
            </CollapsibleContent>
        </Collapsible>
    )
}


function ImageWithSkeleton({ src, alt, className, ...props }: any) {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
            <Image
                src={src}
                alt={alt}
                className={cn(className, isLoading ? 'opacity-0' : 'opacity-100')}
                onLoadingComplete={() => setIsLoading(false)}
                {...props}
            />
        </>
    );
}
