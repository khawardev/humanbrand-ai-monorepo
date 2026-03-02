"use client"

import { useEffect, useState } from "react"

export function useScrollDirection() {
    const [scrollY, setScrollY] = useState(0)
    const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null)

    useEffect(() => {
        let lastScrollY = window.scrollY

        const updateScroll = () => {
            const currentScrollY = window.scrollY
            setScrollDirection(currentScrollY > lastScrollY ? "down" : "up")
            setScrollY(currentScrollY)
            lastScrollY = currentScrollY
        }

        window.addEventListener("scroll", updateScroll)
        return () => window.removeEventListener("scroll", updateScroll)
    }, [])

    return { scrollDirection, scrollY }
}