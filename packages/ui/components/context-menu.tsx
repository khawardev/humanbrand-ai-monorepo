"use client"

import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { motion } from "framer-motion"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@repo/lib/utils"

// --- Hover Tracker Logic & Context ---

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
    const containerRef = React.useRef<HTMLDivElement>(null)

    const onHover = React.useCallback((element: HTMLElement) => {
        if (!containerRef.current) return

        const containerRect = containerRef.current.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()

        setHoverStyle({
            top: elementRect.top - containerRect.top,
            left: elementRect.left - containerRect.left,
            height: elementRect.height,
            width: elementRect.width,
            opacity: 1,
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
            className="pointer-events-none absolute z-0 rounded-lg bg-accent transition-all duration-300 ease-out dark:bg-border"
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

const ContextMenu = ContextMenuPrimitive.Root

const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuPortal = ContextMenuPrimitive.Portal

const ContextMenuSub = ContextMenuPrimitive.Sub

const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

const ContextMenuSubTrigger = React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
        inset?: boolean
    }
>(({ className, inset, children, onMouseEnter, onFocus, ...props }, ref) => {
    const context = React.useContext(HoverTrackerContext)

    const handleInteraction = (e: any) => {
        context?.onHover(e.currentTarget)
    }

    return (
        <ContextMenuPrimitive.SubTrigger
            ref={ref}
            className={cn(
                "relative z-10 flex cursor-default select-none items-center gap-3 rounded-lg px-2 py-2.5 text-sm outline-none focus:bg-transparent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
                inset && "pl-8",
                className
            )}
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
        </ContextMenuPrimitive.SubTrigger>
    )
})
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

const ContextMenuSubContent = React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, children, ...props }, ref) => {
    const { hoverStyle, onHover, onLeave, containerRef } = useHoverTracker()

    // Merge refs
    const composedRef = React.useCallback(
        (node: HTMLDivElement) => {
            containerRef.current = node
            if (typeof ref === "function") {
                ref(node)
            } else if (ref) {
                ; (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
            }
        },
        [ref, containerRef]
    )

    return (
        <ContextMenuPrimitive.SubContent
            ref={composedRef}
            className={cn(
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 mx-2 min-w-[8rem] overflow-hidden rounded-2xl border border-zinc-200 bg-popover p-2 text-popover-foreground shadow-lg data-[state=closed]:animate-out data-[state=open]:animate-in dark:border-border dark:bg-accent",
                className
            )}
            onMouseLeave={onLeave}
            {...props}
        >
            <HoverTrackerBackground hoverStyle={hoverStyle} />
            <HoverTrackerContext.Provider value={{ onHover, onLeave }}>
                {children}
            </HoverTrackerContext.Provider>
        </ContextMenuPrimitive.SubContent>
    )
})
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

const ContextMenuContent = React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, children, ...props }, ref) => {
    const { hoverStyle, onHover, onLeave, containerRef } = useHoverTracker()

    // Merge refs
    const composedRef = React.useCallback(
        (node: HTMLDivElement) => {
            containerRef.current = node
            if (typeof ref === "function") {
                ref(node)
            } else if (ref) {
                ; (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
            }
        },
        [ref, containerRef]
    )

    return (
        <ContextMenuPrimitive.Portal>
            <ContextMenuPrimitive.Content
                ref={composedRef}
                className={cn(
                    "relative z-50 min-w-[8rem] overflow-hidden rounded-2xl border bg-popover p-2 text-popover-foreground shadow-black/5 shadow-xl dark:bg-accent",
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=open]:animate-in",
                    className
                )}
                onMouseLeave={onLeave}
                {...props}
            >
                <HoverTrackerBackground hoverStyle={hoverStyle} />
                <HoverTrackerContext.Provider value={{ onHover, onLeave }}>
                    {children}
                </HoverTrackerContext.Provider>
            </ContextMenuPrimitive.Content>
        </ContextMenuPrimitive.Portal>
    )
})
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

const MotionItem = motion.create(ContextMenuPrimitive.Item)

const ContextMenuItem = React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
        inset?: boolean
        variant?: "default" | "destructive"
    }
>(({ className, inset, variant = "default", onMouseEnter, onFocus, ...props }, ref) => {
    const context = React.useContext(HoverTrackerContext)

    const handleInteraction = (e: any) => {
        context?.onHover(e.currentTarget)
    }

    return (
        <MotionItem
            ref={ref}
            className={cn(
                "relative z-10 flex cursor-pointer select-none items-center gap-3 rounded-lg px-2 py-2 outline-none transition-colors active:scale-[0.98]",
                // Disabled default focus background to let HoverTracker handle it
                "focus:bg-transparent focus:text-accent-foreground",
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                inset && "pl-8",
                // Default Icon Styling
                "[&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground",
                // Destructive Variant Styling
                variant === "destructive" &&
                "text-destructive focus:bg-destructive/10 focus:text-destructive [&>svg]:text-destructive",
                className
            )}
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
})
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

const ContextMenuCheckboxItem = React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, onMouseEnter, onFocus, ...props }, ref) => {
    const context = React.useContext(HoverTrackerContext)

    const handleInteraction = (e: any) => {
        context?.onHover(e.currentTarget)
    }

    return (
        <ContextMenuPrimitive.CheckboxItem
            ref={ref}
            className={cn(
                "relative z-10 flex cursor-default select-none items-center gap-3 rounded-lg py-2.5 pr-2 pl-8 text-sm outline-none transition-colors focus:bg-transparent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
            checked={checked}
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
                <ContextMenuPrimitive.ItemIndicator>
                    <Check className="h-4 w-4" />
                </ContextMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </ContextMenuPrimitive.CheckboxItem>
    )
})
ContextMenuCheckboxItem.displayName =
    ContextMenuPrimitive.CheckboxItem.displayName

const ContextMenuRadioItem = React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, onMouseEnter, onFocus, ...props }, ref) => {
    const context = React.useContext(HoverTrackerContext)

    const handleInteraction = (e: any) => {
        context?.onHover(e.currentTarget)
    }

    return (
        <ContextMenuPrimitive.RadioItem
            ref={ref}
            className={cn(
                "relative z-10 flex cursor-default select-none items-center gap-3 rounded-lg py-2.5 pr-2 pl-8 text-sm outline-none transition-colors focus:bg-transparent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
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
                <ContextMenuPrimitive.ItemIndicator>
                    <Circle className="h-2 w-2 fill-current" />
                </ContextMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </ContextMenuPrimitive.RadioItem>
    )
})
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

const ContextMenuLabel = React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
        inset?: boolean
    }
>(({ className, inset, ...props }, ref) => (
    <ContextMenuPrimitive.Label
        ref={ref}
        className={cn(
            "flex items-center justify-between px-2 py-2 text-sm font-normal text-muted-foreground",
            inset && "pl-8",
            className
        )}
        {...props}
    />
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

const ContextMenuSeparator = React.forwardRef<
    React.ElementRef<typeof ContextMenuPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <ContextMenuPrimitive.Separator
        ref={ref}
        className={cn("-mx-2 my-1 h-px bg-border/50", className)}
        {...props}
    />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

const ContextMenuShortcut = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn(
                "ml-auto text-xs tracking-widest text-muted-foreground",
                className
            )}
            {...props}
        />
    )
}
ContextMenuShortcut.displayName = "ContextMenuShortcut"

export {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuCheckboxItem,
    ContextMenuRadioItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuGroup,
    ContextMenuPortal,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuRadioGroup,
}