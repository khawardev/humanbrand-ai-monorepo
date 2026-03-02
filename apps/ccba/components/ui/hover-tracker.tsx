"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface HoverTrackerProps {
    children: React.ReactNode
    className?: string
}

export function HoverTracker({ children, className }: HoverTrackerProps) {
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
        <div
            className={cn("relative flex flex-col", className)}
            onMouseLeave={() => setHoveredIndex(null)}
        >
            <div
                className="absolute left-0 right-0 rounded-md bg-accent z-0 transition-all duration-300 ease-out pointer-events-none"
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
                    className: cn(
                        childElement.props.className,
                        "relative z-10 focus:bg-transparent data-[state=open]:bg-transparent hover:bg-transparent"
                    ),
                } as any)
            })}
        </div>
    )
}