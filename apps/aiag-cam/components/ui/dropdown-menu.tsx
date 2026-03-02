'use client'

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { motion } from 'framer-motion'
import { Check, ChevronRight, Circle, X } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

// --- Hover Tracker Logic & Context ---

// --- Hover Tracker Logic & Context ---

type HoverVariant = 'default' | 'destructive'

interface HoverTrackerContextType {
  onHover: (element: HTMLElement, variant?: HoverVariant) => void
  onLeave: () => void
}

const HoverTrackerContext = React.createContext<HoverTrackerContextType | null>(null)

function useHoverTracker() {
  const [hoverStyle, setHoverStyle] = React.useState({
    top: 0,
    left: 0,
    height: 0,
    width: 0,
    opacity: 0,
    variant: 'default' as HoverVariant,
  })
  const containerRef = React.useRef<HTMLDivElement>(null)

  const onHover = React.useCallback((element: HTMLElement, variant: HoverVariant = 'default') => {
    if (!containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()

    setHoverStyle({
      top: elementRect.top - containerRect.top,
      left: elementRect.left - containerRect.left,
      height: elementRect.height,
      width: elementRect.width,
      opacity: 1,
      variant,
    })
  }, [])

  const onLeave = React.useCallback(() => {
    setHoverStyle((prev) => ({ ...prev, opacity: 0 }))
  }, [])

  return { hoverStyle, onHover, onLeave, containerRef }
}

function HoverTrackerBackground({ hoverStyle }: { hoverStyle: any }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute z-0 rounded-lg transition-all duration-300 ease-out',
        hoverStyle.variant === 'destructive'
          ? 'bg-destructive/10'
          : 'bg-accent dark:bg-border'
      )}
      style={{
        top: hoverStyle.top,
        left: hoverStyle.left,
        width: hoverStyle.width,
        height: hoverStyle.height,
        opacity: hoverStyle.opacity,
      }}
    />
  )
}

// --- Components ---

function DropdownMenu({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

const MotionTrigger = motion.create(DropdownMenuPrimitive.Trigger)

function DropdownMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <MotionTrigger
      className={cn(
        "outline-none focus-visible:ring-0 active:scale-[0.98]",
        className,
      )}
      data-slot="dropdown-menu-trigger"
      {...(props as any)}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  const { hoverStyle, onHover, onLeave, containerRef } = useHoverTracker()

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        className={cn(
          'relative z-50 min-w-[8rem] overflow-hidden rounded-2xl border bg-popover p-2 text-popover-foreground shadow-black/5 shadow-xl dark:bg-accent',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=open]:animate-in',
          className
        )}
        data-slot="dropdown-menu-content"
        onMouseLeave={onLeave}
        ref={containerRef}
        sideOffset={sideOffset}
        {...props}
      >
        <HoverTrackerBackground hoverStyle={hoverStyle} />
        <HoverTrackerContext.Provider value={{ onHover, onLeave }}>
          {children}
        </HoverTrackerContext.Provider>
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

const MotionItem = motion.create(DropdownMenuPrimitive.Item)

function DropdownMenuItem({
  className,
  inset,
  variant = 'default',
  onMouseEnter,
  onFocus,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: 'default' | 'destructive'
}) {
  const context = React.useContext(HoverTrackerContext)

  const handleInteraction = (e: any) => {
    context?.onHover(e.currentTarget, variant)
  }

  return (
    <MotionItem
      className={cn(
        'relative z-10 flex cursor-pointer select-none items-center gap-3 rounded-lg px-2 py-2 outline-none transition-colors active:scale-[0.98]',
        'focus:bg-transparent focus:text-accent-foreground',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
        'data-inset:pl-8',
        '[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground',
        variant === 'destructive' &&
        'text-destructive focus:text-destructive [&>svg]:text-destructive',
        className
      )}
      data-inset={inset}
      data-slot="dropdown-menu-item"
      data-variant={variant}
      onFocus={(e) => {
        onFocus?.(e)
        handleInteraction(e)
      }}
      onMouseEnter={(e) => {
        onMouseEnter?.(e)
        handleInteraction(e)
      }}
      {...(props as any)}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  onMouseEnter,
  onFocus,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  const context = React.useContext(HoverTrackerContext)

  const handleInteraction = (e: any) => {
    context?.onHover(e.currentTarget)
  }

  return (
    <DropdownMenuPrimitive.CheckboxItem
      checked={checked}
      className={cn(
        'relative z-10 flex cursor-default select-none items-center gap-3 rounded-lg py-2.5 pr-2 pl-8 text-sm outline-none transition-colors focus:bg-transparent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      data-slot="dropdown-menu-checkbox-item"
      onFocus={(e) => {
        onFocus?.(e)
        handleInteraction(e)
      }}
      onMouseEnter={(e) => {
        onMouseEnter?.(e)
        handleInteraction(e)
      }}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />
}

function DropdownMenuRadioItem({
  className,
  children,
  onMouseEnter,
  onFocus,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  const context = React.useContext(HoverTrackerContext)

  const handleInteraction = (e: any) => {
    context?.onHover(e.currentTarget)
  }

  return (
    <DropdownMenuPrimitive.RadioItem
      className={cn(
        'relative z-10 flex cursor-default select-none items-center gap-3 rounded-lg py-2.5 pr-2 pl-8 text-sm outline-none transition-colors focus:bg-transparent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      data-slot="dropdown-menu-radio-item"
      onFocus={(e) => {
        onFocus?.(e)
        handleInteraction(e)
      }}
      onMouseEnter={(e) => {
        onMouseEnter?.(e)
        handleInteraction(e)
      }}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="h-2 w-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuLabel({
  className,
  inset,
  label,
  rootOpenSetter,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
  label: string
  rootOpenSetter?: (open: boolean) => void
}) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn(
        'flex items-center justify-between px-2 py-2 font-normal text-muted-foreground text-sm data-[inset]:pl-8',
        className
      )}
      data-inset={inset}
      data-slot="dropdown-menu-label"
      {...props}
    >
      <span>{label}</span>
      <X
        className="size-3 cursor-pointer hover:text-foreground"
        onClick={() => rootOpenSetter?.(false)}
      />
    </DropdownMenuPrimitive.Label>
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn('-mx-2 my-1 h-px bg-border/50', className)}
      data-slot="dropdown-menu-separator"
      {...props}
    />
  )
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn('ml-auto text-muted-foreground text-xs tracking-widest', className)}
      data-slot="dropdown-menu-shortcut"
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  onMouseEnter,
  onFocus,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  const context = React.useContext(HoverTrackerContext)

  const handleInteraction = (e: any) => {
    context?.onHover(e.currentTarget)
  }

  return (
    <DropdownMenuPrimitive.SubTrigger
      className={cn(
        'relative z-10 flex cursor-default select-none items-center gap-3 rounded-lg px-2 py-2.5 text-sm outline-none focus:bg-transparent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground',
        'data-[inset]:pl-8',
        className
      )}
      data-inset={inset}
      data-slot="dropdown-menu-sub-trigger"
      onFocus={(e) => {
        onFocus?.(e)
        handleInteraction(e)
      }}
      onMouseEnter={(e) => {
        onMouseEnter?.(e)
        handleInteraction(e)
      }}
      {...props}
    >
      {children}
      <ChevronRight className="ml-auto" />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

function DropdownMenuSubContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  const { hoverStyle, onHover, onLeave, containerRef } = useHoverTracker()

  return (
    <DropdownMenuPrimitive.SubContent
      className={cn(
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 mx-2 min-w-[8rem] overflow-hidden rounded-2xl border border-zinc-200 bg-popover p-2 text-popover-foreground shadow-lg data-[state=closed]:animate-out data-[state=open]:animate-in dark:border-border dark:bg-accent',
        className
      )}
      data-slot="dropdown-menu-sub-content"
      onMouseLeave={onLeave}
      ref={containerRef}
      {...props}
    >
      <HoverTrackerBackground hoverStyle={hoverStyle} />
      <HoverTrackerContext.Provider value={{ onHover, onLeave }}>
        {children}
      </HoverTrackerContext.Provider>
    </DropdownMenuPrimitive.SubContent>
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
