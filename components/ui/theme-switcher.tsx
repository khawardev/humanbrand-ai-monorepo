'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const themes = [
    {
        key: 'system',
        icon: Monitor,
        label: 'System',
    },
    {
        key: 'light',
        icon: Sun,
        label: 'Light',
    },
    {
        key: 'dark',
        icon: Moon,
        label: 'Dark',
    },
] as const

export interface ThemeSwitcherProps {
    className?: string
}

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    const handleThemeClick = useCallback(
        (themeKey: 'light' | 'dark' | 'system') => {
            setTheme(themeKey)
        },
        [setTheme]
    )

    if (!mounted) {
        return null
    }

    return (
        <div
            className={cn(
                'relative isolate flex w-fit items-center rounded-full bg-popover p-0.5 border',
                className
            )}
        >
            {themes.map(({ key, icon: Icon, label }) => {
                const isActive = theme === key

                return (
                    <button
                        aria-label={label}
                        className={cn(
                            'relative flex items-center gap-2 rounded-full px-1.5 py-1.5 transition-colors duration-150',
                            isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                        )}
                        key={key}
                        onClick={() => handleThemeClick(key)}
                        type="button"
                    >
                        {isActive && (
                            <motion.div
                                className="absolute inset-0 rounded-full bg-accent"
                                layoutId="activeTheme"
                            />
                        )}
                        <Icon className="relative z-10 h-4 w-4" />
                    </button>
                )
            })}
        </div>
    )
}
