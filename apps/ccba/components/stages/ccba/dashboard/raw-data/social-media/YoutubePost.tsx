import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, Eye } from "lucide-react";

export default function YoutubePost({ post }: any) {
    const videoId = post.url.split('v=')[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold">{post.title}</CardTitle>
                <span className="text-xs text-muted-foreground pt-1">
                    {new Date(post.date_posted).toLocaleDateString()}
                </span>
            </CardHeader>
            <CardContent>
                {videoId && (
                    <div className="aspect-video mb-4">
                        <iframe
                            width="100%"
                            height="100%"
                            src={embedUrl}
                            title={post.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-md"
                        ></iframe>
                    </div>
                )}
                <p className="text-sm text-muted-foreground">{post.description}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Watch on YouTube
                </a>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.views?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes?.toLocaleString()}</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}