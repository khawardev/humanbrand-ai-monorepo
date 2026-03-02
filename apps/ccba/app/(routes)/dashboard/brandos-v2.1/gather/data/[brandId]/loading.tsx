import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayoutHeading, DashboardInnerLayout } from "@/components/brandos-v2.1/shared/DashboardComponents";
import { Separator } from "@/components/ui/separator";

export default function LoadingDataPage() {
    return (
        <div className="space-y-6">
            <DashboardInnerLayout>
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-5 w-64" />
                </div>
            </DashboardInnerLayout>
            <Separator className="mb-6" />
            <DashboardInnerLayout>
                <div className="space-y-8 w-full pb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-5 w-64" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-28" />
                        </div>
                    </div>

                    <Skeleton className="h-10 w-80" />

                    <div className="space-y-6">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                </div>
            </DashboardInnerLayout>
        </div>
    );
}
