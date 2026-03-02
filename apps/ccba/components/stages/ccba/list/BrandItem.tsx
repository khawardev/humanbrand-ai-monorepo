"use client";

import { useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "../../../ui/badge";
import { ButtonSpinner } from "../../../shared/SpinnerLoader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { scrapeBatchWebsite } from "@/server/actions/ccba/website/websiteScrapeActions";
import { WebsiteAskLimitDialog } from "../details/scraps-tab/website/WebsiteAskLimitDialog";
import { SCRAPE, SCRAPING } from "@/lib/constants";
import { BrandCompCrudButtons } from "../details/profile-tab/BrandCompCrudButtons";
import { ClickableListCard, EmptyStateCard } from "@/components/shared/CardsUI";

function BrandItemSkeleton() {
  return (
    <div className="mt-6">
      <div>
        <Skeleton className="h-5 w-1/4" />
        <div className="flex flex-wrap gap-2 mt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
      <div>
        <Skeleton className="h-5 w-1/3" />
        <div className="mt-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-5 w-24" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-32" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-28" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(2)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default function BrandItem({ brand, isScrapped, index }: any) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const scrapeBrand = (limit: any) => {
    startTransition(() => {
      (async () => {
        const {success, message} = await scrapeBatchWebsite(brand.brand_id, limit);

        if (!success) return toast.error(message);
        router.push(`/dashboard/ccba/${brand.brand_id}`);
        toast.success(message);
      })();
    });
  };


  return (
    <ClickableListCard
      isActive={isScrapped}
      href={`/dashboard/ccba/${brand.brand_id}`}
    >
      <div className=" mx-auto w-full space-y-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{brand.name}</CardTitle>
            <CardDescription>
              <Link
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                href={brand.url}
                target="_blank"
                rel="noreferrer"
              >
                {brand.url}
                <LinkIcon className="size-3" />
              </Link>
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
            {!isScrapped && (
              <WebsiteAskLimitDialog onConfirm={scrapeBrand}>
                <Button disabled={isPending}>
                  {isPending ? <ButtonSpinner>{SCRAPING}</ButtonSpinner> : SCRAPE}
                </Button>
              </WebsiteAskLimitDialog>
            )}
            <BrandCompCrudButtons side={null} brand={brand} />
          </div>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <BrandItemSkeleton />
          ) : (
            <div className="space-y-4 ">
              <div>
                <h4 className="text-md font-medium mb-2">Social Links</h4>
                <div className="flex flex-wrap gap-2">
                  {brand.facebook_url && (
                    <Badge asChild variant="secondary">
                      <Link href={brand.facebook_url} target="_blank">
                        Facebook
                      </Link>
                    </Badge>
                  )}
                  {brand.instagram_url && (
                    <Badge asChild variant="secondary">
                      <Link href={brand.instagram_url} target="_blank">
                        Instagram
                      </Link>
                    </Badge>
                  )}
                  {brand.linkedin_url && (
                    <Badge asChild variant="secondary">
                      <Link href={brand.linkedin_url} target="_blank">
                        LinkedIn
                      </Link>
                    </Badge>
                  )}
                  {brand.x_url && (
                    <Badge asChild variant="secondary">
                      <Link href={brand.x_url} target="_blank">
                        X
                      </Link>
                    </Badge>
                  )}
                  {brand.youtube_url && (
                    <Badge asChild variant="secondary">
                      <Link href={brand.youtube_url} target="_blank">
                        YouTube
                      </Link>
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium mb-2">Competitors</h4>
                {brand.competitors?.length > 0 ? (
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
                        {brand.competitors.map((competitor: any) => {
                          return (
                            <TableRow key={competitor.competitor_id}>
                              <TableCell className="font-medium">
                                {competitor.name}
                              </TableCell>
                              <TableCell>
                                <Link
                                  href={competitor.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 hover:underline"
                                >
                                  {competitor.url}
                                  <LinkIcon className="size-3" />
                                </Link>
                              </TableCell>
                              <TableCell className="flex flex-wrap gap-1">
                                {competitor.facebook_url && (
                                  <Badge asChild variant="secondary">
                                    <Link
                                      href={competitor.facebook_url}
                                      target="_blank"
                                    >
                                      Facebook
                                    </Link>
                                  </Badge>
                                )}
                                {competitor.instagram_url && (
                                  <Badge asChild variant="secondary">
                                    <Link
                                      href={competitor.instagram_url}
                                      target="_blank"
                                    >
                                      Instagram
                                    </Link>
                                  </Badge>
                                )}
                                {competitor.linkedin_url && (
                                  <Badge asChild variant="secondary">
                                    <Link
                                      href={competitor.linkedin_url}
                                      target="_blank"
                                    >
                                      LinkedIn
                                    </Link>
                                  </Badge>
                                )}
                                {competitor.x_url && (
                                  <Badge asChild variant="secondary">
                                    <Link href={competitor.x_url} target="_blank">
                                      X
                                    </Link>
                                  </Badge>
                                )}
                                {competitor.youtube_url && (
                                  <Badge asChild variant="secondary">
                                    <Link
                                      href={competitor.youtube_url}
                                      target="_blank"
                                    >
                                      YouTube
                                    </Link>
                                  </Badge>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  ) : <EmptyStateCard message="No competitors found for this brand." /> }
              </div>
            </div>
          )}
          <span className="absolute flex  inset-0 justify-end flex-row w-full -z-10 text-[220px] font-bold  dark:text-accent text-primary/10  select-none">
            B{index + 1}
          </span>
        </CardContent>
      </div>
    </ClickableListCard>
  );
}