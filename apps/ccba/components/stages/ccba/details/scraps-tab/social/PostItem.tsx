'use client'

import { Badge } from '@/components/ui/badge';
import { timeAgo } from '@/lib/utils';
import { AlertTriangle, CalendarDays, Heart, MessageSquare, Link as LinkIcon, Eye, Share2, ArrowRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
            return urlObj.searchParams.get('v');
        }
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1);
        }
    } catch (error) {
        return null;
    }
    return null;
};

const PostMedia = ({ post }: any) => {
    const youtubeVideoId = getYouTubeVideoId(post.url);
    if (youtubeVideoId) {
        return (
            <div className="aspect-video w-full overflow-hidden rounded-lg border">
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </div>
        );
    }

    let mediaUrl = null;
    let isVideo = false;

    if (post.attachments && post.attachments.length > 0) {
        mediaUrl = post.attachments[0].url;
        isVideo = post.attachments[0].type === 'Video';
    } else if (post.video_thumbnail) {
        mediaUrl = post.video_thumbnail;
        isVideo = true;
    } else {
        mediaUrl = post.images?.[0] || post.external_link_data?.[0]?.post_external_image;
    }

    if (!mediaUrl) return null;

    return (
        <div className="aspect-video w-full overflow-hidden rounded-lg border relative group">
            <img src={mediaUrl} alt="Post media" className="h-full w-full object-cover" />
            {isVideo && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="h-12 w-12 text-white/80" />
                </div>
            )}
        </div>
    );
};


const PostContent = ({ post }: any) => {
    const title = post.title;
    const text = post.description || post.post_text || post.content || post.headline;

    if (!title && !text) return null; 

    return (
        <div>
            {title && <p className="font-semibold text-foreground mb-1">{title}</p>}
            {text && <p className="text-sm text-foreground whitespace-pre-wrap  ">{text}</p>}
        </div>
    );
};

const PostHashtags = ({ post }: any) => {
    if (!post.hashtags || post.hashtags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 pt-3">
            {post.hashtags.map((tag: any, index: number) => (
                <Badge key={index} variant="secondary">
                    {typeof tag === 'object' && tag !== null ? tag.hashtag : tag}
                </Badge>
            ))}
        </div>
    );
};

const PostComments = ({ post }: any) => {
    if (!post.comments || post.comments.length === 0) {
        return null;
    }


    return (
        <div className="pt-3 space-y-2">
            {post.comments && (
                <Collapsible>
                    <CollapsibleTrigger asChild>
                        <Button variant="link" size="sm" className="w-full justify-start px-0 h-auto text-xs text-muted-foreground">
                            View {post.comments.length} comment{post.comments.length - 1 > 1 ? 's' : ''}
                        </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <ScrollArea className="h-48 mt-2 px-0">
                            <div className="flex flex-col gap-2 ">
                                {post.comments.map((comment: string, index: number) => (
                                    <div key={index} className="text-xs p-2 rounded-md bg-border border">
                                        <p className="text-xs text-muted-foreground whitespace-normal">
                                            {comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CollapsibleContent>
                </Collapsible>
            )}
        </div>
    );
};

const PostTranscript = ({ post }: any) => {
    if (!post.transcript) return null;

    return (
        <Collapsible>
            <CollapsibleTrigger asChild>
                <Button variant="link" size="sm" className="w-full justify-start px-0 h-auto text-xs text-muted-foreground">
                    Show Transcript
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <ScrollArea className="h-48 mt-2 rounded-md border p-3">
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">{post.transcript}</p>
                </ScrollArea>
            </CollapsibleContent>
        </Collapsible>
    );
};

export default function PostItem({ post }: any) {
    const postUrl = post.url;
    const likes = post.likes ?? post.num_likes;
    const comments = post.num_comments;
    const views = post.views;
    const shares = post.num_shares;
    const errorMessage = post.error || post.warning
    if (errorMessage) {
        return (
            <div key={post.SK} className="p-4 border rounded-lg bg-border/50 space-y-2">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                    <p>{errorMessage}</p>
                </div>
                {post.warning_code && (
                    <Badge
                        variant={post.warning_code === "dead_page" ? "destructive" : "secondary"}
                        className="whitespace-nowrap capitalize"
                    >
                        {post.warning_code.replace(/_/g, " ")}
                    </Badge>
                )}
            </div>
        )
    }
    return (
        <div className="p-4 border rounded-xl bg-border/50 space-y-3 ">
            <PostMedia post={post} />
            <PostContent post={post} />
            <PostHashtags post={post} />
            <PostTranscript post={post} />
            <PostComments post={post} />
            <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-3 border-t gap-y-2">
                <div className="flex items-center gap-4">
                    {typeof likes === 'number' && (
                        <div className="flex items-center gap-1.5" title="Likes">
                            <Heart className="h-3.5 w-3.5" />
                            <span>{likes.toLocaleString()}</span>
                        </div>
                    )}
                    {typeof comments === 'number' && (
                        <div className="flex items-center gap-1.5" title="Comments">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>{comments.toLocaleString()}</span>
                        </div>
                    )}
                    {typeof shares === 'number' && (
                        <div className="flex items-center gap-1.5" title="Shares">
                            <Share2 className="h-3.5 w-3.5" />
                            <span>{shares.toLocaleString()}</span>
                        </div>
                    )}
                    {typeof views === 'number' && (
                        <div className="flex items-center gap-1.5" title="Views">
                            <Eye className="h-3.5 w-3.5" />
                            <span>{views.toLocaleString()}</span>
                        </div>
                    )}
                </div>
                {post.date_posted && (
                    <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>{timeAgo(post.date_posted)}</span>
                    </div>
                )}
            </div>

            {postUrl && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t">
                    <LinkIcon className="h-3 w-3" />
                    <a href={postUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                        View original post
                    </a>
                </div>
            )}
        </div>
    );
}