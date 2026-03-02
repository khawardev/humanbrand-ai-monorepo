"use client";

import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BrandCompCrudButtons } from "@/components/stages/ccba/details/profile-tab/BrandCompCrudButtons";
import { ClickableListCard } from "@/components/shared/CardsUI";
import { RecollectDialog } from "./RecollectDialog";

export function BrandItemSkeleton() {
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
                <Skeleton className="h-5 w-1/3 mt-5" />
                <div className="mt-2 space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    );
}

interface GatherBrandItemProps {
    item: {
        brand: any;
        hasData: boolean;
        isProcessing: boolean;
        websiteBatchId: string | null;
        socialBatchId: string | null;
        actionsSlot?: React.ReactNode;
    };
    index: number;
    competitorsSlot?: React.ReactNode;
    webStatusSlot?: React.ReactNode;
    socialStatusSlot?: React.ReactNode;
}

export default function BrandItem({ item, index, competitorsSlot, webStatusSlot, socialStatusSlot }: GatherBrandItemProps) {
    const { brand, hasData, isProcessing, websiteBatchId, socialBatchId } = item;

    const isScrapped = !!websiteBatchId || !!socialBatchId || hasData || isProcessing;

    const getHref = () => {
        if (!websiteBatchId && !socialBatchId) return undefined;
        return `/dashboard/brandos-v2.1/gather/data/${brand.brand_id}`;
    };

    return (
        <ClickableListCard
            isActive={!!getHref()}
            href={getHref()}
            className="relative"
        >
            <div className="mx-auto w-full space-y-6">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                            <CardTitle className="text-xl">{brand.name}</CardTitle>
                            <div className="flex items-center gap-2 ml-2">
                                {webStatusSlot}
                                {socialStatusSlot}
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
                        {item.actionsSlot ? (
                            item.actionsSlot
                        ) : (
                            <>
                                <RecollectDialog 
                                    brandId={brand.brand_id} 
                                    brandName={brand.name}
                                    variant="dropdown"
                                />
                                <BrandCompCrudButtons side={null} brand={brand} />
                            </>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-md font-medium mb-2">Social Links</h4>
                            <div className="flex flex-wrap gap-2">
                                    {brand.facebook_url && (
                                        <Badge asChild variant="secondary">
                                            <Link href={brand.facebook_url} target="_blank" onClick={(e) => e.stopPropagation()}>
                                                Facebook
                                            </Link>
                                        </Badge>
                                    )}
                                    {brand.instagram_url && (
                                        <Badge asChild variant="secondary">
                                            <Link href={brand.instagram_url} target="_blank" onClick={(e) => e.stopPropagation()}>
                                                Instagram
                                            </Link>
                                        </Badge>
                                    )}
                                    {brand.linkedin_url && (
                                        <Badge asChild variant="secondary">
                                            <Link href={brand.linkedin_url} target="_blank" onClick={(e) => e.stopPropagation()}>
                                                LinkedIn
                                            </Link>
                                        </Badge>
                                    )}
                                    {brand.x_url && (
                                        <Badge asChild variant="secondary">
                                            <Link href={brand.x_url} target="_blank" onClick={(e) => e.stopPropagation()}>
                                                X
                                            </Link>
                                        </Badge>
                                    )}
                                    {brand.youtube_url && (
                                        <Badge asChild variant="secondary">
                                            <Link href={brand.youtube_url} target="_blank" onClick={(e) => e.stopPropagation()}>
                                                YouTube
                                            </Link>
                                        </Badge>
                                    )}
                            </div>
                        </div>

                        {competitorsSlot}
                    </div>
                    <span className="absolute flex inset-0 justify-end flex-row w-full -z-10 text-[220px] font-bold dark:text-accent text-primary/10 select-none pointer-events-none overflow-hidden pr-4">
                        B{index + 1}
                    </span>
                </CardContent>
            </div>
        </ClickableListCard>
    );
}