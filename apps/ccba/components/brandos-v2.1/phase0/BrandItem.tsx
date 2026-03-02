"use client";

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, CheckCircle2, Link as LinkIcon, PlayCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ClickableListCard, EmptyStateCard } from "@/components/shared/CardsUI";
import { MdOutlineArrowRight } from "react-icons/md";

type BrandItemProps = {
  item: any;
};

export function BrandItem({ item }: BrandItemProps) {
  const { brand, hasData, webStatus, socStatus } = item;

  // Status Logic
  const canAudit = hasData;

  const getHref = () => {
    if (canAudit) {
      return `/dashboard/brandos-v2.1/phase-0/processing/${brand.brand_id}`;
    }
    return `/dashboard/brandos-v2.1/gather/collecting/${brand.brand_id}`;
  };

  return (
    <ClickableListCard
      isActive={canAudit}
      href={getHref()}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <CardTitle className="text-xl">{brand.name}</CardTitle>
            <div className="flex items-center gap-2 ml-2">
              {canAudit ? (
                <Badge variant="outline" className=" text-green-800 ">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Data Ready
                </Badge>
              ) : (
                <Badge variant="outline" className="text-amber-600">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Data Incomplete
                </Badge>
              )}
              <div className="flex gap-1 text-[10px] uppercase font-semibold text-muted-foreground ml-2">
                <span className={cn(webStatus === 'Completed' || webStatus === 'CompletedWithErrors' ? "text-green-600" : "text-amber-600")}>
                  Web: {webStatus || 'Pending'}
                </span>
                <span>|</span>
                <span className={cn(socStatus === 'Completed' || socStatus === 'CompletedWithErrors' ? "text-green-600" : "text-amber-600")}>
                  Soc: {socStatus || 'Pending'}
                </span>
              </div>
            </div>
          </div>
          <CardDescription>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              href={brand.url || "#"}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              {brand.url}
              <LinkIcon className="size-3" />
            </Link>
          </CardDescription>
        </div>

        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          {canAudit ? (
            <Link href={`/dashboard/brandos-v2.1/phase-0/processing/${brand.brand_id}`}>
              <Button size="sm" className="gap-2">
                Start Phase 0
                <MdOutlineArrowRight />
              </Button>
            </Link>
          ) : (
            <Link href={`/dashboard/brandos-v2.1/gather/collecting/${brand.brand_id}`}>
              <Button variant="outline" size="sm" className="gap-2">
                Go to Gather
                <MdOutlineArrowRight />
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Brand Socials */}
          <div>
            <h4 className="text-md font-medium mb-2">Social Links</h4>
            <div className="flex flex-wrap gap-2">
              {['facebook', 'instagram', 'linkedin', 'x', 'youtube'].map(platform => {
                const urlKey = `${platform}_url`;
                if (!brand[urlKey]) return null;
                return (
                  <Badge key={platform} asChild variant="secondary">
                    <Link href={brand[urlKey]} target="_blank" onClick={(e) => e.stopPropagation()} className="capitalize">
                      {platform}
                    </Link>
                  </Badge>
                );
              })}
              {!brand.facebook_url && !brand.instagram_url && !brand.linkedin_url && !brand.x_url && !brand.youtube_url && (
                <span className="text-sm text-muted-foreground">No social links found.</span>
              )}
            </div>
          </div>

          {/* Competitors Table */}
          <div>
            <h4 className="text-md font-medium mb-2">Competitors</h4>
            {brand.competitors && brand.competitors.length > 0 ? (
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead>Socials</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brand.competitors.map((competitor: any) => (
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
                          {['facebook', 'instagram', 'linkedin', 'x', 'youtube'].map(platform => {
                            const urlKey = `${platform}_url`;
                            if (!competitor[urlKey]) return null;
                            return (
                              <Badge key={platform} asChild variant="secondary" className="text-[10px] px-1.5 h-5">
                                <Link href={competitor[urlKey]} target="_blank" onClick={(e) => e.stopPropagation()} className="capitalize">
                                  {platform}
                                </Link>
                              </Badge>
                            );
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyStateCard message="No competitors found for this brand." />
            )}
          </div>
        </div>
      </CardContent>
    </ClickableListCard>
  );
}
