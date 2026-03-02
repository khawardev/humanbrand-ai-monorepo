import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function UserNavSkeleton() {
  return (
    <Button variant="ghost" size="icon" disabled>
      <Skeleton className="h-8 w-8 rounded" />
    </Button>
  );
}

