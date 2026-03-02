'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useScroll } from 'motion/react'
import { cn } from '@/lib/utils'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'
import { FullLogo } from '../../shared/Logo'

export const HeroHeader = () => {
    const [scrolled, setScrolled] = React.useState(false)
    const { scrollYProgress } = useScroll()

    React.useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            setScrolled(latest > 0.1)
        })
        return () => unsubscribe()
    }, [scrollYProgress])

    return (
        <header className={`fixed w-full z-50 md:top-10 top-5 duration-250 transition-all ease-in-out ${scrolled && 'px-3'}`}>
            <nav
                className={cn(
                    'mx-auto max-w-6xl px-3 py-2 rounded-full duration-300 transition-all ease-in-out flex items-center justify-between',
                    scrolled ? 'bg-border/40 backdrop-blur-2xl ' : 'bg-transparent'
                )}
            >
                <Link href="/" aria-label="home" className="flex items-center">
                    <FullLogo />
                </Link>
               
                <div className='md:flex hidden items-center gap-2'>
                    <ThemeSwitcher />
                    <Button size={'sm'}   asChild>
                        <Link href="#">Get Started</Link>
                    </Button>
                </div>
                <div className=' md:hidden flex  items-center'>
                    <Button size={'sm'} asChild>
                        <Link href="#">Get Started</Link>
                    </Button>
                    <ThemeSwitcher />
                </div>
            </nav>
        </header>
    )
}
