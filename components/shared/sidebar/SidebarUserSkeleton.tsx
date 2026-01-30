import { Skeleton } from '@/components/ui/skeleton'

export function SidebarUserSkeleton() {
	return (
		<div className="flex items-center gap-2 p-2">
			<Skeleton className="size-8 rounded-full" />
			<div className="grid flex-1 gap-1">
				<Skeleton className="h-4 w-24" />
				<Skeleton className="h-3 w-16" />
			</div>
			<Skeleton className="size-4" />
		</div>
	)
}
