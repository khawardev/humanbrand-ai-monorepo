'use client'

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion } from 'framer-motion'
import * as React from 'react'
import { CgToolbarLeft } from 'react-icons/cg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useIsMobile } from '@/hooks/useMobile'
import { useSwipeGesture } from '@/hooks/useSwipeGesture'
import { cn } from '@/lib/utils'
import { CgToolbarRight } from "react-icons/cg";

const SIDEBAR_COOKIE_NAME = 'sidebar_state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = '18rem'
const SIDEBAR_WIDTH_MOBILE = '18rem'
const SIDEBAR_WIDTH_ICON = '3rem'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

interface SidebarContextProps {
    state: 'expanded' | 'collapsed'
    open: boolean
    setOpen: (open: boolean) => void
    openMobile: boolean
    setOpenMobile: (open: boolean) => void
    isMobile: boolean
    toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
    const context = React.useContext(SidebarContext)
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider.')
    }

    return context
}

function SidebarProvider({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
}: React.ComponentProps<'div'> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
}) {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
        (value: boolean | ((value: boolean) => boolean)) => {
            const openState = typeof value === 'function' ? value(open) : value
            if (setOpenProp) {
                setOpenProp(openState)
            } else {
                _setOpen(openState)
            }

            document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
        },
        [setOpenProp, open]
    )

    const toggleSidebar = React.useCallback(() => {
        return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
                event.preventDefault()
                toggleSidebar()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [toggleSidebar])

    React.useEffect(() => {
        if (isMobile && openMobile) {
            document.body.style.overflow = 'hidden'
            document.body.style.touchAction = 'none'
        } else {
            document.body.style.overflow = ''
            document.body.style.touchAction = ''
        }
        return () => {
            document.body.style.overflow = ''
            document.body.style.touchAction = ''
        }
    }, [isMobile, openMobile])

    useSwipeGesture({
        onSwipeRight: () => {
            if (!openMobile) {
                setOpenMobile(true)
            }
        },
        onSwipeLeft: () => {
            if (openMobile) {
                setOpenMobile(false)
            }
        },
        threshold: 40,
        requireEdgeStart: false,
        preventScroll: false,
        enabled: true,
    })

    const state = open ? 'expanded' : 'collapsed'

    const contextValue = React.useMemo<SidebarContextProps>(
        () => ({
            state,
            open,
            setOpen,
            isMobile,
            openMobile,
            setOpenMobile,
            toggleSidebar,
        }),
        [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
        <SidebarContext.Provider value={contextValue}>
            <TooltipProvider delayDuration={0}>
                <div
                    className={cn(
                        'group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar',
                        className
                    )}
                    data-slot="sidebar-wrapper"
                    style={
                        {
                            '--sidebar-width': SIDEBAR_WIDTH,
                            '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
                            ...style,
                        } as React.CSSProperties
                    }
                    {...props}
                >
                    {children}
                </div>
            </TooltipProvider>
        </SidebarContext.Provider>
    )
}

function Sidebar({
    side = 'left',
    variant = 'sidebar',
    collapsible = 'offcanvas',
    className,
    children,
    ...props
}: React.ComponentProps<'div'> & {
    side?: 'left' | 'right'
    variant?: 'sidebar' | 'floating' | 'inset'
    collapsible?: 'offcanvas' | 'icon' | 'none'
}) {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === 'none') {
        return (
            <div
                className={cn(
                    'flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground',
                    className
                )}
                data-slot="sidebar"
                {...props}
            >
                {children}
            </div>
        )
    }

    if (isMobile) {
        return (
            <>
                {openMobile && (
                    <div
                        aria-hidden="true"
                        className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
                        onClick={() => setOpenMobile(false)}
                        onTouchMove={(e) => e.preventDefault()}
                    />
                )}
                <div
                    className={cn(
                        'fixed inset-y-0 left-0 z-50 flex h-svh flex-col overflow-hidden overscroll-contain bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-out',
                        openMobile ? 'translate-x-0' : '-translate-x-full',
                        className
                    )}
                    data-mobile="true"
                    data-open={openMobile}
                    data-sidebar="sidebar"
                    data-slot="sidebar"
                    style={
                        {
                            '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
                            width: SIDEBAR_WIDTH_MOBILE,
                            touchAction: 'pan-x',
                        } as React.CSSProperties
                    }
                    {...props}
                >
                    <div className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden overscroll-contain">
                        {children}
                    </div>
                </div>
            </>
        )
    }

    return (
        <div
            className="group peer hidden text-sidebar-foreground md:block"
            data-collapsible={state === 'collapsed' ? collapsible : ''}
            data-side={side}
            data-slot="sidebar"
            data-state={state}
            data-variant={variant}
        >
            <div
                className={cn(
                    'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
                    'group-data-[collapsible=offcanvas]:w-0',
                    'group-data-[side=right]:rotate-180',
                    variant === 'floating' || variant === 'inset'
                        ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
                        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)'
                )}
                data-slot="sidebar-gap"
            />
            <div
                className={cn(
                    'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex',
                    side === 'left'
                        ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
                        : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
                    variant === 'floating' || variant === 'inset'
                        ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
                        : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
                    className
                )}
                data-slot="sidebar-container"
                {...props}
            >
                <div
                    className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm"
                    data-sidebar="sidebar"
                    data-slot="sidebar-inner"
                >
                    {children}
                </div>
            </div>
        </div>
    )
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
    const { toggleSidebar, open } = useSidebar()

    return (
        <Button
            className={cn("rounded-md", className)}
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            onClick={(event) => {
                onClick?.(event);
                toggleSidebar();
            }}
            size="icon"
            variant="ghost"
            {...props}
        >
            {open ? (
                <CgToolbarLeft className="size-4.5" />
            ) : (
                <CgToolbarRight className="size-4.5" />
            )}
            <span className="sr-only">Toggle Sidebar</span>
        </Button>
    );
}

function SidebarRail({ className, ...props }: React.ComponentProps<'button'>) {
    const { toggleSidebar } = useSidebar()

    return (
        <button
            aria-label="Toggle Sidebar"
            className={cn(
                'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex',
                'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize',
                '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
                'group-data-[collapsible=offcanvas]:translate-x-0 hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:after:left-full',
                '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
                '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
                className
            )}
            data-sidebar="rail"
            data-slot="sidebar-rail"
            onClick={toggleSidebar}
            tabIndex={-1}
            title="Toggle Sidebar"
            {...props}
        />
    )
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
    const { openMobile, isMobile } = useSidebar()

    return (
        <main
            className={cn(
                'relative flex min-h-svh min-w-0 flex-1 flex-col border dark:bg-accent/40 bg-background transition-transform duration-300 ease-out',
                'peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-2xl md:peer-data-[variant=inset]:shadow-sm',
                isMobile && openMobile && 'pointer-events-none overflow-hidden',
                className
            )}
            data-mobile-open={openMobile}
            data-slot="sidebar-inset"
            style={
                isMobile && openMobile
                    ? {
                        transform: `translateX(${SIDEBAR_WIDTH_MOBILE})`,
                        touchAction: 'none',
                    }
                    : undefined
            }
            {...props}
        />
    )
}

function SidebarInput({ className, ...props }: React.ComponentProps<typeof Input>) {
    return (
        <Input
            className={cn(
                'h-8 w-full border-input/90 bg-input/20 focus:border-primary/40 focus:ring-primary/40',
                className
            )}
            data-sidebar="input"
            data-slot="sidebar-input"
            {...props}
        />
    )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn('flex flex-col gap-2 p-2', className)}
            data-sidebar="header"
            data-slot="sidebar-header"
            {...props}
        />
    )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn('flex flex-col gap-2 p-2', className)}
            data-sidebar="footer"
            data-slot="sidebar-footer"
            {...props}
        />
    )
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
    return (
        <Separator
            className={cn('mx-2 w-auto bg-sidebar-border', className)}
            data-sidebar="separator"
            data-slot="sidebar-separator"
            {...props}
        />
    )
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn(
                'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
                className
            )}
            data-sidebar="content"
            data-slot="sidebar-content"
            {...props}
        />
    )
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
            data-sidebar="group"
            data-slot="sidebar-group"
            {...props}
        />
    )
}

function SidebarGroupLabel({
    className,
    asChild = false,
    ...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'div'

    return (
        <Comp
            className={cn(
                'flex h-8 shrink-0 items-center mb-3 rounded-md px-2 font-medium text-sidebar-foreground/70 text-xs outline-none ring-sidebar-ring transition-[margin,opa] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
                'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
                className
            )}
            data-sidebar="group-label"
            data-slot="sidebar-group-label"
            {...props}
        />
    )
}

function SidebarGroupAction({
    className,
    asChild = false,
    ...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'button'

    return (
        <Comp
            className={cn(
                'absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
                'after:absolute after:-inset-2 md:after:hidden',
                'group-data-[collapsible=icon]:hidden',
                className
            )}
            data-sidebar="group-action"
            data-slot="sidebar-group-action"
            {...props}
        />
    )
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn('w-full text-sm', className)}
            data-sidebar="group-content"
            data-slot="sidebar-group-content"
            {...props}
        />
    )
}

function SidebarMenu({ className, children, ...props }: React.ComponentProps<'ul'>) {
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
    const [hoverStyle, setHoverStyle] = React.useState({ top: 0, height: 0, opacity: 0 })
    const itemsRef = React.useRef<(HTMLElement | null)[]>([])

    itemsRef.current = []

    React.useEffect(() => {
        if (hoveredIndex !== null) {
            const element = itemsRef.current[hoveredIndex]
            if (element) {
                setHoverStyle({
                    top: element.offsetTop,
                    height: element.offsetHeight,
                    opacity: 1,
                })
            }
        } else {
            setHoverStyle((prev) => ({ ...prev, opacity: 0 }))
        }
    }, [hoveredIndex])

    return (
        <ul
            className={cn(
                'relative flex w-full min-w-0 flex-col gap-1',
                // Override child button hovers so the tracker is visible
                '[&_[data-sidebar=menu-button]]:hover:bg-transparent [&_[data-sidebar=menu-button]]:focus:bg-transparent',
                className
            )}
            data-sidebar="menu"
            data-slot="sidebar-menu"
            onMouseLeave={() => setHoveredIndex(null)}
            {...props}
        >
            <div
                className="pointer-events-none absolute right-0 left-0 z-0 rounded-md bg-sidebar-accent transition-all duration-300 ease-out"
                style={{
                    top: hoverStyle.top,
                    height: hoverStyle.height,
                    opacity: hoverStyle.opacity,
                }}
            />

            {React.Children.map(children, (child, index) => {
                if (!React.isValidElement(child)) return null
                const childElement = child as React.ReactElement<any>
                return React.cloneElement(childElement, {
                    ref: (el: HTMLElement | null) => (itemsRef.current[index] = el),
                    onMouseEnter: () => setHoveredIndex(index),
                    onFocus: () => setHoveredIndex(index),
                    className: cn(childElement.props.className, 'relative z-10'),
                } as any)
            })}
        </ul>
    )
}

const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
    ({ className, ...props }, ref) => {
        return (
            <li
                className={cn('group/menu-item relative', className)}
                data-sidebar="menu-item"
                data-slot="sidebar-menu-item"
                ref={ref}
                {...props}
            />
        )
    }
)
SidebarMenuItem.displayName = 'SidebarMenuItem'

const sidebarMenuButtonVariants = cva(
    'peer/menu-button group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 flex w-full items-center gap-2 overflow-hidden rounded-lg p-2 text-left text-base outline-none transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground',
    {
        variants: {
            variant: {
                default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                outline:
                    'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
            },
            size: {
                default: 'h-10',
                sm: 'h-7 text-xs',
                lg: 'group-data-[collapsible=icon]:!p-0 h-12 text-sm',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

const MotionSlot = motion.create(Slot)

function SidebarMenuButton({
    asChild = false,
    isActive = false,
    variant = 'default',
    size = 'default',
    tooltip,
    className,
    ...props
}: React.ComponentProps<'button'> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
} & VariantProps<typeof sidebarMenuButtonVariants>) {
    const Comp = asChild ? MotionSlot : motion.button
    const { isMobile, state } = useSidebar()

    const button = (
        <Comp
            className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
            data-active={isActive}
            data-sidebar="menu-button"
            data-size={size}
            data-slot="sidebar-menu-button"
            {...(props as any)}
        />
    )

    if (!tooltip) {
        return button
    }

    if (typeof tooltip === 'string') {
        tooltip = {
            children: tooltip,
        }
    }

    return (
        <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent
                align="start"
                hidden={state !== 'collapsed' || isMobile}
                side="right"
                sideOffset={6}
                {...tooltip}
            />
        </Tooltip>
    )
}

function SidebarMenuAction({
    className,
    asChild = false,
    showOnHover = false,
    ...props
}: React.ComponentProps<'button'> & {
    asChild?: boolean
    showOnHover?: boolean
}) {
    const Comp = asChild ? Slot : 'button'

    return (
        <Comp
            className={cn(
                'absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0',
                'after:absolute after:-inset-2 md:after:hidden',
                'peer-data-[size=sm]/menu-button:top-1',
                'peer-data-[size=default]/menu-button:top-1.5',
                'peer-data-[size=lg]/menu-button:top-2.5',
                'group-data-[collapsible=icon]:hidden',
                showOnHover &&
                'cursor-pointer opacity-100 group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0',
                className
            )}
            data-sidebar="menu-action"
            data-slot="sidebar-menu-action"
            {...props}
        />
    )
}

function SidebarMenuBadge({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn(
                'pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 font-medium text-sidebar-foreground text-xs tabular-nums',
                'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
                'peer-data-[size=sm]/menu-button:top-1',
                'peer-data-[size=default]/menu-button:top-1.5',
                'peer-data-[size=lg]/menu-button:top-2.5',
                'group-data-[collapsible=icon]:hidden',
                className
            )}
            data-sidebar="menu-badge"
            data-slot="sidebar-menu-badge"
            {...props}
        />
    )
}

function SidebarMenuSkeleton({
    className,
    showIcon = false,
    ...props
}: React.ComponentProps<'div'> & {
    showIcon?: boolean
}) {
    const width = React.useMemo(() => {
        return `${Math.floor(Math.random() * 40) + 50}%`
    }, [])

    return (
        <div
            className={cn('flex h-8 items-center gap-2 rounded-md px-2', className)}
            data-sidebar="menu-skeleton"
            data-slot="sidebar-menu-skeleton"
            {...props}
        >
            {showIcon && <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />}
            <Skeleton
                className="h-4 max-w-(--skeleton-width) flex-1"
                data-sidebar="menu-skeleton-text"
                style={
                    {
                        '--skeleton-width': width,
                    } as React.CSSProperties
                }
            />
        </div>
    )
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<'ul'>) {
    return (
        <ul
            className={cn(
                'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 py-0.5 pl-2.5',
                'group-data-[collapsible=icon]:hidden',
                className
            )}
            data-sidebar="menu-sub"
            data-slot="sidebar-menu-sub"
            {...props}
        />
    )
}

function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<'li'>) {
    return (
        <li
            className={cn('group/menu-sub-item relative', className)}
            data-sidebar="menu-sub-item"
            data-slot="sidebar-menu-sub-item"
            {...props}
        />
    )
}

function SidebarMenuSubButton({
    asChild = false,
    size = 'md',
    isActive = false,
    className,
    ...props
}: React.ComponentProps<'a'> & {
    asChild?: boolean
    size?: 'sm' | 'md'
    isActive?: boolean
}) {
    const Comp = asChild ? MotionSlot : motion.a

    return (
        <Comp
            className={cn(
                "mt-1 flex h-9 min-w-0 text-base -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
                "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
                size === "sm" && "text-xs",
                size === "md" && "text-sm",
                "group-data-[collapsible=icon]:hidden",
                className,
            )}
            data-active={isActive}
            data-sidebar="menu-sub-button"
            data-size={size}
            data-slot="sidebar-menu-sub-button"
            {...(props as any)}
        />
    );
}

export {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
}
