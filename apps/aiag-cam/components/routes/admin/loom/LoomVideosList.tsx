"use client";

import { deleteLoomVideo } from "@/server/actions/loomActions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, ExternalLink, MoreVertical, Copy } from "lucide-react";
import { toast } from "sonner";
import { SiLoom } from "react-icons/si";

interface LoomVideo {
  id: string;
  title: string;
  url: string;
  description: string | null;
  html: string | null;
  thumbnailUrl: string | null;
  createdAt: Date;
}

interface LoomVideosListProps {
  videos: LoomVideo[];
  readOnly?: boolean;
}

export function LoomVideosList({ videos, readOnly = false }: LoomVideosListProps) {
  const handleDelete = async (id: string) => {
    try {
      const result = await deleteLoomVideo(id);
      if (result.success) {
        toast.success("Video deleted successfully");
      } else {
        toast.error("Failed to delete video");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const getEmbedUrl = (shareUrl: string) => {
    return shareUrl.replace('/share/', '/embed/');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <Card key={video.id} className="group overflow-hidden border-none shadow-none bg-transparent">
          <CardContent className="p-0">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted shadow-sm ring-1 ring-border/50">
              <iframe
                src={getEmbedUrl(video.url)}
                frameBorder="0"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
                title={video.title}
              />
            </div>

            <div className="flex items-start justify-between mt-4 gap-4 px-1">
              <div className="space-y-1">
                <h3 className="font-medium tracking-tight" title={video.title}>
                  {video.title || "Untitled Video"}
                </h3>
                <p className="text-xs mt-2 text-muted-foreground">
                  {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 text-muted-foreground hover:text-foreground">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => window.open(video.url, '_blank')}>
                    <SiLoom />
                    Open in Loom
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyToClipboard(video.url)}>
                    <Copy />
                    Copy Link
                  </DropdownMenuItem>
                  {!readOnly && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(video.id)} variant="destructive">
                        <Trash2 />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {video.description && (
              <p className="text-sm text-muted-foreground mt-2 px-1 line-clamp-2">
                {video.description}
              </p>
            )}

          </CardContent>
        </Card>
      ))}
      {videos.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-xl border border-dashed text-muted-foreground">
          <SiLoom className="h-10 w-10 mb-4 opacity-20" />
          <p className="font-medium">No instructional videos yet</p>
          {!readOnly && <p className="text-sm mt-1 opacity-70">Add your first video to get started</p>}
        </div>
      )}
    </div>
  );
}
