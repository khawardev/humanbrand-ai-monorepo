import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Heart, MessageSquare } from 'lucide-react';
import { formatNumber, formatDuration, normalizeImageUrl } from '../utils';
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { useInView } from 'react-intersection-observer';

interface SocialPostsListProps {
    posts: any[];
    selectedPost: any | null;
    onSelect: (post: any) => void;
}

export function SocialPostsList({ posts, selectedPost, onSelect }: SocialPostsListProps) {
    const [visibleCount, setVisibleCount] = useState(20);
    const { ref, inView } = useInView({
        threshold: 0.1,
        rootMargin: '200px',
    });

    useEffect(() => {
        if (inView && visibleCount < posts.length) {
            setVisibleCount(prev => Math.min(prev + 20, posts.length));
        }
    }, [inView, visibleCount, posts.length]);

    useEffect(() => {
        setVisibleCount(20);
    }, [posts]);

    if (!posts || posts.length === 0) return null;

    const visiblePosts = posts.slice(0, visibleCount);

    return (
        <div className="lg:col-span-1 ">
            <div className="sticky top-4">
                <h4 className="mb-3 flex items-center gap-2">
                    Posts ({posts.length})
                </h4>
                <ScrollArea className="h-[60vh] rounded-lg">
                    <div className="space-y-2">
                        {visiblePosts.map((post: any, idx: number) => {
                            const displayText = post.title || post.description || post.message || post.text || post.full_text || post.caption || 'Untitled Post';
                            
                            // Align image logic with SocialPostDetail.tsx
                            let derivedImages = post.image_urls || post.images || [];
                            if (!Array.isArray(derivedImages)) derivedImages = [];

                            // Prepend thumbnail if valid string
                            if (post.thumbnail && typeof post.thumbnail === 'string') {
                                const thumb = post.thumbnail;
                                if (!derivedImages.includes(thumb)) {
                                     derivedImages = [thumb, ...derivedImages];
                                }
                            }

                            // Find first valid, normalized image URL
                            let thumbnail = derivedImages.map((img: any) => normalizeImageUrl(img)).find((url: string | null) => url);

                            // Fallback to video thumbnail if no images found
                            if (!thumbnail && post.video_id) {
                                thumbnail = `https://img.youtube.com/vi/${post.video_id}/default.jpg`;
                            }

                            const likes = post.engagement?.likes ?? post.engagement?.reactions ?? 0;
                            const views = post.engagement?.views;
                            const comments = post.comments?.length ?? post.engagement?.comments ?? 0;

                            return (
                                <Button
                                    key={post.SK || post.video_id || idx}
                                    variant={selectedPost?.SK === post.SK || selectedPost?.video_id === post.video_id ? "secondary" : "ghost"}
                                    className="w-full justify-start h-auto py-3 px-3 text-left items-start gap-3 whitespace-normal"
                                    onClick={() => onSelect(post)}
                                >
                                    <div className="flex items-center gap-2 absolute top-2 right-2">
                                        <Badge variant="outline" className="text-[9px] h-4 px-1">
                                            #{idx + 1}
                                        </Badge>
                                    </div>

                                    {thumbnail && (
                                        <div className="w-16 h-12 shrink-0 rounded overflow-hidden bg-muted mt-1 relative">
                                            <PostThumbnail src={thumbnail} alt="thumb" />
                                        </div>
                                    )}

                                    <div className="w-full min-w-0 space-y-1.5">
                                        <div className="pr-8">
                                            <p className="text-xs font-medium line-clamp-2 leading-snug">
                                                {displayText}
                                            </p>
                                        </div>

                                        {post.published_at && (
                                            <p className="text-[10px] text-muted-foreground">
                                                {new Date(post.published_at).toLocaleDateString()}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground pt-1">
                                            {views !== undefined && (
                                                <span className="flex items-center gap-1" title="Views">
                                                    <Eye className="w-3 h-3" />
                                                    {formatNumber(views)}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1" title="Likes/Reactions">
                                                <Heart className="w-3 h-3" />
                                                {formatNumber(likes)}
                                            </span>
                                            {comments > 0 && (
                                                <span className="flex items-center gap-1" title="Comments">
                                                    <MessageSquare className="w-3 h-3" />
                                                    {formatNumber(comments)}
                                                </span>
                                            )}
                                            {post.is_short && (
                                                <Badge variant="destructive" className="text-[8px] h-3 px-1 py-0" style={{ fontSize: '8px' }}>Short</Badge>
                                            )}
                                        </div>
                                    </div>
                                </Button>
                            );
                        })}
                        {visibleCount < posts.length && (
                            <div ref={ref} className="py-2 text-center text-xs text-muted-foreground">
                                Loading more posts...
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}

function PostThumbnail({ src, alt }: { src: string, alt: string }) {
    const [isLoading, setIsLoading] = useState(true);

    // Filter out invalid URLs or non-http strings if necessary, though <Image> usually handles or errors
    if (!src || (!src.startsWith('http') && !src.startsWith('/'))) return null;

    return (
        <>
            {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
            <Image
                src={src}
                alt={alt}
                fill
                className={cn("object-cover transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100")}
                onLoadingComplete={() => setIsLoading(false)}
                unoptimized={src.includes('youtube.com')}
            />
        </>
    );
}
