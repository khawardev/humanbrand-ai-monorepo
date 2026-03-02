import { Skeleton } from "@/components/ui/skeleton";

export const ReportDataViewerSkeleton = () => {
  return (
    <div className="flex flex-col space-y-4 mt-4">
      <div className="space-y-2">
        <Skeleton className="h-7 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="pt-6 space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
};
