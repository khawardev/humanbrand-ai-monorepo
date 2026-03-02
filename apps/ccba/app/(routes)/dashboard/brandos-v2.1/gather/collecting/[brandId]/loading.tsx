import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayoutHeading, DashboardInnerLayout } from "@/components/brandos-v2.1/shared/DashboardComponents";

export default function LoadingCollectingPage() {
    return (
        <div className="space-y-6">
            <DashboardLayoutHeading
                title="Loading..."
                subtitle="Checking collection status"
            />
            <DashboardInnerLayout>
                <div className="space-y-8 w-full pb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-5 w-64" />
                        </div>
                        <Skeleton className="h-10 w-28" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Skeleton className="h-32 w-full rounded-lg" />
                        <Skeleton className="h-32 w-full rounded-lg" />
                    </div>

                    <Skeleton className="h-10 w-40" />

                    <Skeleton className="h-24 w-full rounded-lg" />
                </div>
            </DashboardInnerLayout>
        </div>
    );
}
