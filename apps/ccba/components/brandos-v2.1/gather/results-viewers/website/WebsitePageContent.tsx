import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Code, Copy, ExternalLink, FileText, ImageIcon } from 'lucide-react';
import NextLink from 'next/link';
import { MarkdownViewer } from '@/components/shared/MarkdownViewer';
import { toast } from 'sonner';
import { WebsitePage } from '../types';
import { WebsiteImageViewer } from './WebsiteImageViewer';
import { useState } from 'react';

interface WebsitePageContentProps {
    page: WebsitePage;
}

export function WebsitePageContent({ page }: WebsitePageContentProps) {
    const [viewMode, setViewMode] = useState<'markdown' | 'html' | 'images'>('markdown');

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success(`${label} copied to clipboard`);
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
                <NextLink
                    href={page.url}
                    target="_blank"
                    className="text-sm text-muted-foreground hover:text-foreground truncate max-w-[500px] flex items-center gap-1"
                >
                    {page.url}
                    <ExternalLink className="w-3 h-3" />
                </NextLink>
                <div className="flex items-center gap-2">
                    {page.image_urls && page.image_urls.length > 0 && (
                        <Badge variant="outline">
                            {page.image_urls.length} images
                        </Badge>
                    )}
                </div>
            </div>

            <Separator />

            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="w-full">
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="markdown" className="gap-2">
                            <FileText className="w-3 h-3" />
                            Markdown
                        </TabsTrigger>
                        <TabsTrigger value="html" className="gap-2" disabled={!page.html_content}>
                            <Code className="w-3 h-3" />
                            HTML
                        </TabsTrigger>
                        <TabsTrigger value="images" className="gap-2" disabled={!page.image_urls?.length}>
                            <ImageIcon className="w-3 h-3" />
                            Images
                        </TabsTrigger>
                    </TabsList>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(
                            viewMode === 'html' ? (page.html_content || '') : (page.content || ''),
                            viewMode === 'html' ? 'HTML' : 'Content'
                        )}
                    >
                        <Copy className="w-3 h-3 " />
                        Copy
                    </Button>
                </div>

                <TabsContent value="markdown" >
                    <ScrollArea className="h-[55vh] w-full">
                        {page.content ? (
                            <MarkdownViewer content={page.content} />
                        ) : (
                            <p className="text-muted-foreground">No markdown content available.</p>
                        )}
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="html" className="mt-4">
                    <ScrollArea className="h-[55vh] w-full border rounded-lg bg-background">
                        {page.html_content ? (
                            <pre className="p-4 text-xs font-mono whitespace-pre-wrap break-all">
                                {page.html_content}
                            </pre>
                        ) : (
                            <p className="p-4 text-muted-foreground">No HTML content available.</p>
                        )}
                    </ScrollArea>
                </TabsContent>

                <TabsContent value="images" className="mt-4">
                    <WebsiteImageViewer imageUrls={page.image_urls || []} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
