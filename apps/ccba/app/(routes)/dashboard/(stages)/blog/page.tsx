import { DashboardInnerLayout, DashboardLayoutHeading } from '@/components/stages/ccba/dashboard/shared/DashboardComponents'
import BlogPostCard from '@/components/static/blogs/BlogPostCard'
import { posts } from '@/components/static/blogs/blog'

const page = () => {
    return (
        <>
            <DashboardLayoutHeading
                title="Where builders think out loud"
                subtitle="Thoughts on building, designing, and shipping. Sometimes technical, always useful."
            />
            <DashboardInnerLayout>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post: any) => (
                        <BlogPostCard key={post.id} post={post} />
                    ))}
                </div>
            </DashboardInnerLayout>
        </>
    )
}

export default page