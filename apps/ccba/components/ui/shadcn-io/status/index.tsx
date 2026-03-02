import type { ComponentProps, HTMLAttributes } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export type StatusProps = ComponentProps<typeof Badge> & {
  status: 'pending' | 'not-available' | 'available'
}

export const Status = ({ className, status, ...props }: StatusProps) => (
  <Badge
    className={cn('flex items-center gap-2', 'group', status, className)}
    variant='outline'
    {...props}
  />
)

export type StatusIndicatorProps = HTMLAttributes<HTMLSpanElement>

export const StatusIndicator = ({ className, ...props }: StatusIndicatorProps) => (
  <span className="relative flex h-2 w-2" {...props}>
    <span
      className={cn(
        'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
        'group-[.available]:bg-[#71EA01]',
        'group-[.pending]:bg-amber-500',
        'group-[.not-available]:bg-gray-400'
      )}
    />
    <span
      className={cn(
        'relative inline-flex h-2 w-2 rounded-full',
        'group-[.available]:bg-[#71EA01]',
        'group-[.pending]:bg-amber-500',
        'group-[.not-available]:bg-gray-400'
      )}
    />
  </span>
)

export type StatusLabelProps = HTMLAttributes<HTMLSpanElement>

export const StatusLabel = ({ className, children, ...props }: StatusLabelProps) => (
  <span className={cn('text-muted-foreground', className)} {...props}>
    {children ?? (
      <>
        <span className="hidden group-[.available]:block">Available</span>
        <span className="hidden group-[.pending]:block">Pending</span>
        <span className="hidden group-[.not-available]:block">Not Available</span>
      </>
    )}
  </span>
)