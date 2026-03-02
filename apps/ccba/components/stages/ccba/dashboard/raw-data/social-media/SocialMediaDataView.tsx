'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FacebookPost from "./FacebookPost";
import LinkedinPost from "./LinkedinPost";
import YoutubePost from "./YoutubePost";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function SocialMediaDataView({ data }: any) {
    if (!data) return null;

    const renderPosts = (platformPosts: any, PostComponent: any) => (
        <div>
            <h3 className="text-xl font-bold mb-4">{platformPosts.brand.name}</h3>
            <div className="space-y-4">
                {platformPosts.brand.posts.map((post: any, index: number) => (
                    <PostComponent key={index} post={post} />
                ))}
            </div>

            {platformPosts.competitors.map((competitor: any, idx: number) => (
                <div key={`${competitor.name}-${idx}`} className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Competitor: {competitor.name}</h3>
                    <div className="space-y-4">
                        {competitor.posts.map((post: any, index: number) => (
                            !post.warning_code && <PostComponent key={`${competitor.name}-${index}`} post={post} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
            <Tabs defaultValue="facebook">
                <TabsList>
                    <TabsTrigger value="facebook">Facebook</TabsTrigger>
                    <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                    <TabsTrigger value="youtube">YouTube</TabsTrigger>
                </TabsList>
                <ScrollArea className="h-[65vh] mt-4 ">
                    <TabsContent value="facebook">
                        {renderPosts(data.facebook, FacebookPost)}
                    </TabsContent>
                    <TabsContent value="linkedin">
                        {renderPosts(data.linkedin, LinkedinPost)}
                    </TabsContent>
                    <TabsContent value="youtube">
                        {renderPosts(data.youtube, YoutubePost)}
                    </TabsContent>
                </ScrollArea>
            </Tabs>
    );
}