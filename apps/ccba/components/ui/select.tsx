"use client"

import * as SelectPrimitive from "@radix-ui/react-select"
import { motion } from "framer-motion"
import { Check, ChevronDown, ChevronUp } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

// --- Hover Tracker Logic & Context ---

type HoverVariant = "default" | "destructive"

interface HoverTrackerContextType {
  onHover: (element: HTMLElement, variant?: HoverVariant) => void
  onLeave: () => void
}

const HoverTrackerContext = React.createContext<HoverTrackerContextType | null>(
  null
)

function useHoverTracker() {
  const [hoverStyle, setHoverStyle] = React.useState({
    top: 0,
    left: 0,
    height: 0,
    width: 0,
    opacity: 0,
    variant: "default" as HoverVariant,
  })
  const containerRef = React.useRef<HTMLDivElement>(null)

  const onHover = React.useCallback(
    (element: HTMLElement, variant: HoverVariant = "default") => {
      setHoverStyle({
        top: element.offsetTop,
        left: element.offsetLeft,
        height: element.offsetHeight,
        width: element.offsetWidth,
        opacity: 1,
        variant,
      })
    },
    []
  )

  const onLeave = React.useCallback(() => {
    setHoverStyle((prev) => ({ ...prev, opacity: 0 }))
  }, [])

  return { hoverStyle, onHover, onLeave, containerRef }
}

function HoverTrackerBackground({ hoverStyle }: { hoverStyle: any }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute z-0 rounded-lg transition-all duration-300 ease-out",
        hoverStyle.variant === "destructive"
          ? "bg-destructive/10"
          : "bg-accent dark:bg-border"
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

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const MotionTrigger = motion.create(SelectPrimitive.Trigger)

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <MotionTrigger
    ref={ref}
    className={cn(
      "flex h-10 w-full cursor-pointer select-none items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium shadow-xs backdrop-blur-sm outline-none transition-colors hover:bg-background/90 hover:text-foreground focus:outline-none  active:bg-background/95 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 dark:border-white/20 data-[state=open]:bg-accent",
      className
    )}
    {...(props as any)}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 opacity-50 transition-transform duration-200" />
    </SelectPrimitive.Icon>
  </MotionTrigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1 opacity-50 hover:opacity-100",
      className
    )}
    {...props}
  >
    <ChevronUp className="size-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1 opacity-50 hover:opacity-100",
      className
    )}
    {...props}
  >
    <ChevronDown className="size-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => {
  const { hoverStyle, onHover, onLeave, containerRef } = useHoverTracker()

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-50 max-h-96 min-w-[8rem] overflow-hidden text-[15px] rounded-2xl border bg-popover text-popover-foreground shadow-black/5 shadow-xl dark:bg-accent",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=open]:animate-in",
          position === "popper" &&
          "data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "relative p-2",
            position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
          ref={containerRef}
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
})
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-2 font-semibold text-muted-foreground text-xs", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const MotionItem = motion.create(SelectPrimitive.Item)

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
    variant?: "default" | "destructive"
  }
>(({ className, children, variant = "default", ...props }, ref) => {
  const context = React.useContext(HoverTrackerContext)

  const handleInteraction = (e: any) => {
    context?.onHover(e.currentTarget, variant)
  }

  return (
    <MotionItem
      ref={ref}
      className={cn(
        "relative z-10 flex w-full cursor-pointer select-none items-center gap-3 rounded-lg py-2 pl-2 pr-8 outline-none transition-colors  data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        // Disable default hover/focus backgrounds so the tracker is visible
        "focus:bg-transparent focus:text-accent-foreground",
        variant === "destructive" &&
        "text-destructive focus:text-destructive [&>svg]:text-destructive",
        className
      )}
      onFocus={(e) => {
        handleInteraction(e)
      }}
      onMouseEnter={(e) => {
        handleInteraction(e)
      }}
      {...(props as any)}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
    </MotionItem>
  )
})
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-2 my-1 h-px bg-border/50", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
