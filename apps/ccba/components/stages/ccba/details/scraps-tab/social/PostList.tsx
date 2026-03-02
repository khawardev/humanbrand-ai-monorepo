'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { useInView } from 'react-intersection-observer';
import { Skeleton } from '@/components/ui/skeleton';

const PostItem = lazy(() => import('./PostItem'));

const PostItemSkeleton = () => (
    <div className="p-4 border rounded-xl bg-border/50 space-y-3">
        <Skeleton className="aspect-video w-full rounded-lg" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex flex-wrap items-center justify-between pt-3 border-t gap-y-2">
            <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-4 w-24" />
        </div>
    </div>
);

export default function PostList({ posts }: { posts: any[] }) {
    const [visiblePosts, setVisiblePosts] = useState(5);
    const { ref, inView } = useInView({
        threshold: 0,
        triggerOnce: false,
    });

    useEffect(() => {
        if (inView) {
            setVisiblePosts((prev) => Math.min(prev + 10, posts.length));
        }
    }, [inView, posts.length]);

    return (
        <div className="flex flex-col space-y-4 w-full">
            <Suspense fallback={<>
                {[...Array(5)].map((_, i) => <PostItemSkeleton key={i} />)}
            </>}>
                {posts.slice(0, visiblePosts).map((post: any, index: number) => (
                    <PostItem key={post.SK || index} post={post} />
                ))}
            </Suspense>

            {visiblePosts < posts.length && (
                <div ref={ref}>
                    <PostItemSkeleton />
                </div>
            )}
        </div>
    );
}
