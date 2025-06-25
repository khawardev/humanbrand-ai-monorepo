'use client'

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { AIAGConfig } from "@/config/aiag-config"
import { usePathname } from "next/navigation"

const NavigationMenuComp = () => {
    const pathname = usePathname();
    return (
        <div className='sm:inline-block hidden'>
            <NavigationMenu>
                <NavigationMenuList className=" text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-full p-[3px]">
                    {AIAGConfig?.mainNav.map((link: any, index: number) => (
                        <NavigationMenuItem key={index}>
                            <NavigationMenuLink
                                href={link.href}
                                active={pathname === link.href}
                                className="text-muted-foreground px-4 rounded-full hover:text-primary py-1 font-medium"
                            >
                                {link.title}
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}
export default NavigationMenuComp