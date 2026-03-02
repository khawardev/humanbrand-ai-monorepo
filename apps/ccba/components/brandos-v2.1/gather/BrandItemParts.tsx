"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { EmptyStateCard } from "@/components/shared/CardsUI";
import { Skeleton } from "@/components/ui/skeleton";

export function CompetitorsTable({ competitors }: { competitors: any[] }) {
    if (!competitors || competitors.length === 0) {
        return <EmptyStateCard message="No competitors found for this brand." />;
    }

    return (
        <div className="mt-2">
            <h4 className="text-md font-medium mb-2">Competitors</h4>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Website</TableHead>
                    <TableHead>Socials</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {competitors.map((competitor: any) => (
                    <TableRow key={competitor.competitor_id}>
                    <TableCell className="font-medium">
                        {competitor.name}
                    </TableCell>
                    <TableCell>
                        <Link
                        href={competitor.url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                        >
                        {competitor.url}
                        <LinkIcon className="size-3" />
                        </Link>
                    </TableCell>
                    <TableCell className="flex flex-wrap gap-1">
                        {competitor.facebook_url && (
                            <Badge asChild variant="secondary">
                            <Link href={competitor.facebook_url} target="_blank" onClick={(e) => e.stopPropagation()}>
                                Facebook
                            </Link>
                            </Badge>
                        )}
                        {competitor.instagram_url && (
                            <Badge asChild variant="secondary">
                            <Link href={competitor.instagram_url} target="_blank" onClick={(e) => e.stopPropagation()}>
                                Instagram
                            </Link>
                            </Badge>
                        )}
                        {competitor.linkedin_url && (
                            <Badge asChild variant="secondary">
                            <Link href={competitor.linkedin_url} target="_blank" onClick={(e) => e.stopPropagation()}>
                                LinkedIn
                            </Link>
                            </Badge>
                        )}
                        {competitor.x_url && (
                            <Badge asChild variant="secondary">
                            <Link href={competitor.x_url} target="_blank" onClick={(e) => e.stopPropagation()}>
                                X
                            </Link>
                            </Badge>
                        )}
                        {competitor.youtube_url && (
                            <Badge asChild variant="secondary">
                            <Link href={competitor.youtube_url} target="_blank" onClick={(e) => e.stopPropagation()}>
                                YouTube
                            </Link>
                            </Badge>
                        )}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>
    );
}

export function CompetitorsSkeleton() {
    return (
        <div className="mt-6 space-y-2">
            <Skeleton className="h-5 w-32 mb-2" />
            <div className="border rounded-md p-4 space-y-4">
                 <div className="flex gap-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                 </div>
                 {[1,2].map(i => (
                     <div key={i} className="flex gap-4">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                     </div>
                 ))}
            </div>
        </div>
    )
}

export { ScrapeStatusBadge as StatusBadge, ScrapeStatusBadgeSkeleton as StatusBadgeSkeleton } from './ScrapeStatusBadge';
export { PollingStatusBadge } from './PollingStatusBadge';
