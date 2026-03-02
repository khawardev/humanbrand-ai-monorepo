import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayoutHeading } from '@/components/brandos-v2.1/shared/DashboardComponents';
import { DashboardInnerLayout } from '@/components/stages/ccba/dashboard/shared/DashboardComponents';
import { Badge } from "@/components/ui/badge";

export default function GatherPageLoading() {
    return (
        <div>
            <DashboardLayoutHeading
                title="Data Gathering"
                subtitle="Manage data collection and view captured content for your brands."
            />
            <div className="w-full">
                <DashboardInnerLayout >
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-8 mt-4 w-48" />
                </DashboardInnerLayout>

                {[1, 2, 3].map((i) => (
                    <div key={i} >
                        <BrandItemSkeleton />
                    </div>
                ))}
            </div>
        </div>
    );
}

function BrandItemSkeleton() {
    return (
        <div className="border-b md:px-10 px-4 py-8 space-y-4">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                </div>
            </div>

            <div>
                <Skeleton className="h-5 w-24 mb-2" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            </div>

            <div>
                <Skeleton className="h-5 w-28 mb-2" />
                <div className="space-y-2">
                    <div className="flex gap-4">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="flex gap-4">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                </div>
            </div>
        </div>
    );
}

