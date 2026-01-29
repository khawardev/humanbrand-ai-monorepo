import { Skeleton } from '@/components/ui/skeleton'

export function SidebarListSkeleton() {
	return (
		<div className="px-2">
			<div className="pt-4">
				<Skeleton className="mb-4 h-4 w-20" />
				<div className="space-y-2">
					{Array.from({ length: 4 }).map((_, i) => (
						<div className="space-y-1" key={i}>
							<Skeleton className="h-8 w-full rounded-md" />
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
