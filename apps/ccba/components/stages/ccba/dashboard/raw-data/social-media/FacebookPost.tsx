import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, Share2 } from "lucide-react";

export default function FacebookPost({ post }: any) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium">Facebook Post</CardTitle>
                    <span className="text-xs text-muted-foreground">
                        {new Date(post.date_posted).toLocaleDateString()}
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm mb-4 whitespace-pre-wrap">{post.content}</p>
                <div className="flex flex-wrap gap-2">
                    {post.hashtags?.map((tag: string) => (
                        <Badge key={tag} variant="secondary">#{tag}</Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    View Post
                </a>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.num_comments}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Share2 className="h-4 w-4" />
                        <span>{post.num_shares}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}