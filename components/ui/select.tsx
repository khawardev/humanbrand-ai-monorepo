'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

// --- Hover Tracker Logic ---

interface HoverTrackerContextType {
  onHover: (element: HTMLElement) => void
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
  })

  const onHover = React.useCallback((element: HTMLElement) => {
    setHoverStyle({
      top: element.offsetTop,
      left: element.offsetLeft,
      height: element.offsetHeight,
      width: element.offsetWidth,
      opacity: 1,
    })
  }, [])

  const onLeave = React.useCallback(() => {
    setHoverStyle((prev) => ({ ...prev, opacity: 0 }))
  }, [])

  return { hoverStyle, onHover, onLeave }
}

function HoverTrackerBackground({ hoverStyle }: { hoverStyle: any }) {
  return (
    <div
      className="pointer-events-none absolute z-0 rounded-lg bg-accent transition-all duration-300 ease-out"
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

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        'flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
        className
      )}
      data-slot="select-trigger"
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 shrink-0 opacity-50 transition-transform duration-200" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const { hoverStyle, onHover, onLeave } = useHoverTracker()

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border border-border/50 bg-popover text-popover-foreground shadow-black/5 shadow-xl data-[state=closed]:animate-out data-[state=open]:animate-in',
          position === 'popper' &&
          'data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
          className
        )}
        data-slot="select-content"
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'relative p-1',
            position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
          )}
          onMouseLeave={onLeave}
        >
          <HoverTrackerBackground hoverStyle={hoverStyle} />
          <HoverTrackerContext.Provider value={{ onHover, onLeave }}>
            {children}
          </HoverTrackerContext.Provider>
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn('px-2 py-1.5 font-semibold text-muted-foreground text-xs', className)}
      data-slot="select-label"
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const context = React.useContext(HoverTrackerContext)

  const handleInteraction = (e: React.SyntheticEvent<HTMLElement>) => {
    context?.onHover(e.currentTarget)
  }

  return (
    <SelectPrimitive.Item
      className={cn(
        'relative z-10 flex w-full cursor-pointer select-none items-center rounded-lg py-1.5 pr-8 pl-2 text-sm outline-none transition-colors active:scale-[0.96] data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        // Disable default hover/focus backgrounds so the tracker is visible
        'hover:bg-transparent focus:bg-transparent',
        className
      )}
      data-slot="select-item"
      onFocus={handleInteraction}
      onMouseEnter={handleInteraction}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4 " />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={cn('-mx-1 my-1 h-px bg-muted', className)}
      data-slot="select-separator"
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cn(
        'flex cursor-default items-center justify-center py-1 opacity-50 hover:opacity-100',
        className
      )}
      data-slot="select-scroll-up-button"
      {...props}
    >
      <ChevronUp className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cn(
        'flex cursor-default items-center justify-center py-1 opacity-50 hover:opacity-100',
        className
      )}
      data-slot="select-scroll-down-button"
      {...props}
    >
      <ChevronDown className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
