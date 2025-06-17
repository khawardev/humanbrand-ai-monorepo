'use client'
import { useId } from "react"

import UserMenu from "@/components/header/user-menu"
import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Bookmark, FileText } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeSwitcher } from "../ui/theme-switcher"
import MobileHeader from "./mobile-header"
import { AIAGConfig } from "@/config/aiag-config"
import { FullBlackLogo, FullGreenLogo, HalfBlackLogo, HalfGreenLogo } from "@/shared/logo"
import { useTheme } from "next-themes"
export default function DesktopHeader() {
    const id = useId()
    const pathname = usePathname()
    const { resolvedTheme } = useTheme();
    
    return (
        <header className="border-b ">
            <div className="sm:w-8/12 w-full mx-auto sm:px-0 px-4">
                <div className="flex h-16 items-center justify-between gap-4 ">
                    <Link href="/" className="md:flex hidden items-center space-x-1">
                        {resolvedTheme === 'dark' ? <FullGreenLogo /> : <FullBlackLogo />}
                    </Link>
                    <Link href="/" className="md:hidden flex  items-center space-x-1">
                        {resolvedTheme === 'dark' ? <HalfGreenLogo /> : <HalfBlackLogo />}
                    </Link>
                    <div className='sm:inline-block hidden'>
                        <NavigationMenu>
                            <NavigationMenuList className=" bg-accent border text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-full p-[3px]">
                                {AIAGConfig.mainNav.map((link: any, index: number) => (
                                    <NavigationMenuItem key={index}>
                                        <Link href={link.href} passHref>
                                            <NavigationMenuLink
                                                active={pathname === link.href}
                                                className="text-muted-foreground px-4 rounded-full hover:text-primary py-1 font-medium"
                                            >
                                                {link.title}
                                            </NavigationMenuLink>
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>



                    {/* Right side */}
                    <div className="flex  items-center justify-end gap-2">

                        <li className="md:inline-block hidden ">
                            <Link href="/signin">
                                <Button size={'sm'} variant={'ghost'}>
                                    Sign In
                                </Button>
                            </Link>
                        </li>
                        <li className="md:inline-block hidden md:border-r pr-2">
                            <Link href="/signup">
                                <Button size={'sm'}>
                                    Register
                                </Button>
                            </Link>
                        </li>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size={'icon'} className="ml-2 ring-0">
                                    <Bookmark />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-w-64" align="end">
                                <DropdownMenuLabel className="flex gap-2 items-center min-w-0 ">
                                    <div className=" flex flex-col" >
                                        <span className="text-foreground truncate text-sm font-medium">
                                            Saved Sessions
                                        </span>
                                        <span className="text-muted-foreground truncate text-xs font-normal">
                                            Your previously saved content sessions.
                                        </span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <div className="flex items-center justify-between  w-full">
                                        <div className="flex items-center space-x-2">
                                            <FileText size={16} className="opacity-60" aria-hidden="true" />
                                            <span>Social Media Post</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">Now</span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center space-x-2">
                                            <FileText size={16} className="opacity-60" aria-hidden="true" />
                                            <span>Member Email Draft</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">2h ago</span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <div className="flex items-center justify-between  w-full">
                                        <div className="flex items-center space-x-2">
                                            <FileText size={16} className="opacity-60" aria-hidden="true" />
                                            <span>Press Release</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">Yesterday</span>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div className=" pr-2  flex items-center"><UserMenu /></div>
                        <div className="sm:hidden block pl-2 border-l"><MobileHeader /></div>
                        <div className=" md:pl-2 md:border-l"><ThemeSwitcher /></div>
                    </div>
                </div>
            </div>
        </header>
    )
}
