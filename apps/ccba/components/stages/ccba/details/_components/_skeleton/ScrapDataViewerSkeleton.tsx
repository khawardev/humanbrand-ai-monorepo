import { CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PostItemSkeleton = () => {
  return (
    <div className="flex space-x-4 p-1">
      <div className="space-y-2 flex-1">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/6" />
        </div>
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-24 w-5/6" />
        <div className="flex items-center gap-4 pt-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  );
};

const PlatformCardSkeleton = () => {
  return (
    <div className='flex flex-col space-y-6 px-0'>
      <CardHeader className='px-1'>
        <Skeleton className="h-7 w-28 rounded-full" />
      </CardHeader>
      <CardContent className='px-0'>
        <div className="flex flex-col space-y-6 w-full">
          {Array.from({ length: 1 }).map((_, index) => (
            <PostItemSkeleton key={index} />
          ))}
        </div>
      </CardContent>
    </div>
  );
};

const SocialDataViewSkeleton = () => {
  return (
    <div className="columns-1 md:columns-2 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="break-inside-avoid mb-6">
          <PlatformCardSkeleton />
        </div>
      ))}
    </div>
  );
};

const ScrapDataViewerSkeleton = () => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24 rounded-md" />
          <div className="h-6 w-px bg-border" />
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-40 rounded-md" />
          <Skeleton className="h-10 w-36 rounded-md" />
          <Skeleton className="h-10 w-[140px] rounded-md" />
        </div>
      </div>
      <SocialDataViewSkeleton />
    </div>
  );
};

export default ScrapDataViewerSkeleton;