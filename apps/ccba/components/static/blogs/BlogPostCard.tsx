import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '../../ui/badge';

interface BlogPostCardProps {
    post: any;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
    return (
        <div className="relative">
            <Image
                width={1200}
                height={630}
                loading="lazy"
                alt={post.title}
                className="rounded-xl object-cover"
                src={post.image}
            />
            <div className="group  inset-0 flex flex-col justify-end">
                <div className="flex flex-col gap-4 bg-opacity-50 py-4 rounded-lg backdrop-blur-sm">
                    <div>
                        {post.tags.map((tag: any) => (
                            <Badge key={tag} className="">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    <Link href="#" aria-label={`Read more ${post.title} article`} className="absolute inset-0">
                    </Link>

                    <h2 className="text-xl  group-hover:underline">{post.title}</h2>
                    <p className="text-muted-foreground">{post.description}</p>

                    <div className="flex items-center text-sm text-muted-foreground">
                        <div className="flex items-center">
                            {post.authors.length > 1 ? (
                                <div className="flex -space-x-2">
                                    {post.authors.map((author: any, index: any) => (
                                        <Image
                                            key={index}
                                            className="h-8 w-8 rounded-full border-2 border"
                                            width={32}
                                            height={32}
                                            alt={author.name}
                                            src={author.avatarUrl}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <Image
                                        className="h-8 w-8 rounded-full"
                                        width={32}
                                        height={32}
                                        alt={post.authors[0].name}
                                        src={post.authors[0].avatarUrl}
                                    />
                                    <span className="ml-2 hidden  sm:inline">{post.authors[0].name}</span>
                                </div>
                            )}
                        </div>
                        <span className="mx-2" aria-hidden="true">·</span>
                        <div>{post.date}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPostCard;