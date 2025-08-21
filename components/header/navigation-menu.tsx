'use client'

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavigationMenuComp = ({ navLinks }: { navLinks: any[] }) => {
    const pathname = usePathname();
    return (
        <div className='sm:inline-block hidden'>
            <NavigationMenu>
                <NavigationMenuList className=" border text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-full p-[3px]">
                    {navLinks.map((link: any, index: number) => (
                        <NavigationMenuItem key={link.href} >
                            <NavigationMenuLink
                                active={pathname === link.href}
                                asChild
                                className="text-muted-foreground px-4 rounded-full hover:text-primary py-1 font-medium"
                            >
                                <Link className="rounded-full"  href={link.href}>
                                    {link.title}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}
export default NavigationMenuComp;