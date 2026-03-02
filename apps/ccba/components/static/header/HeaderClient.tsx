'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "./UserNav"
import { UserNavSkeleton } from "./UserNavSkeleton"
import { FullLogo } from "../../shared/Logo"
import { ThemeSwitcher } from "../../ui/theme-switcher"
import { usePathname } from "next/navigation"
import { BrandOSConfig } from "@/config/brandos-sidebar-config"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function HeaderClient({user}:any) {
  const pathname = usePathname()
  
  // If we are on the login page, forcedly treat user as null to avoid stale layout state showing "logged in" headers
  // right after a middleware redirect (which deletes cookies but might leave the layout cache active).
  const effectiveUser = pathname === '/login' ? null : user;

  if (pathname.startsWith("/dashboard")) return null

  return (
    <header className="z-30 fixed top-5 w-full">
      <div className="flex flex-row h-11 px-2 items-center mx-auto max-w-6xl justify-between gap-3    ">
        <Link href="/">
          <FullLogo />
        </Link>
        <ul className={`flex px-2 h-11  items-center justify-end gap-2 rounded-full backdrop-blur-2xl`}>
          {effectiveUser &&
            BrandOSConfig.mainNav.map((item: any, index: number) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className=" rounded-full"
                      variant={pathname === item.href ? "outline" : "ghost"}
                      size="sm"
                    >
                      <Link href={item.href}>
                        <span>{item.title}</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={15} side="bottom">
                    <p>{item.desc}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          <div className={`${effectiveUser && 'md:border-l pl-4'}  flex items-center gap-2`}>
            {!effectiveUser ? (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            ) : (
              <UserNav user={effectiveUser} />
            )}
            <ThemeSwitcher />
          </div>
        </ul>
      </div>
    </header>
  )
}