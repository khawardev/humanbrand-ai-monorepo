'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cva } from 'class-variance-authority'
import type * as React from 'react'
import { cn } from '@/lib/utils'

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

const tooltipVariants = cva(
  'fade-in-0 data-[state=closed]:fade-out-0 z-50 mb-2 w-fit max-w-sm origin-(--radix-tooltip-content-transform-origin) animate-in select-none rounded-lg border bg-popover px-2.5 py-1.5 font-medium text-xs shadow-sm backdrop-blur data-[state=closed]:animate-out dark:bg-accent',
  {
    variants: {
      variant: {
        default: 'bg-popover text-foreground dark:bg-accent',
        success: 'border-green-700 bg-green-600 text-white',
        warning: 'border-yellow-600 bg-yellow-500 text-black',
        error: 'border-red-700 bg-red-600 text-white',
        info: 'border-blue-700 bg-blue-600 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function TooltipContent({
  className,
  sideOffset = 0,
  variant,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={cn(tooltipVariants({ variant }), className)}
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
