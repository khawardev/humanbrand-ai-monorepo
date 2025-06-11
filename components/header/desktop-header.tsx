"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import Logo from "@/shared/logo";
import { usePathname } from "next/navigation";
import { RepuraiConfig } from "@/config/repurai-config";
import { ThemeSwitcher } from "../ui/theme-switcher";
import MobileHeader from "./mobile-header";

export default function DesktopHeader() {
    const pathname = usePathname();
    if (pathname.includes('/dashboard')) {
        return null;
    }


    return (
        <header className="z-30 sticky top-0   w-full pt-5 md:pb-20 pb-15  ">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 ">
                <div className="flex h-14 items-center rounded-xl justify-between gap-3  bg-accent/50 px-3  border backdrop-blur supports-[backdrop-filter]:bg-background/85">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <div className="flex aspect-square size-5 items-center justify-center ">
                            <span className="size-7"><Logo /></span>
                        </div>
                        <span className=" text-[20px]   font-extrabold  hidden">
                            Repurai
                        </span>
                    </Link>
                    <ul className="flex flex-1 items-center justify-end md:gap-3 gap-2">
                        <li className="lg:pr-4 md:not-sr-only sr-only">
                            <div className="space-y-6 text-base lg:flex lg:gap-6 lg:space-y-0 lg:text-sm">
                                {RepuraiConfig.mainNav.map((item: any, index: any) => (
                                    <div key={index}>
                                        <Link
                                            href={item.href}
                                            className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                            <span>{item.title}</span>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </li>

                        <li className="md:inline-block hidden md:border-l pl-4">
                            <Link href="/signin">
                                <Button size={'sm'} variant={'ghost'}>
                                    Sign In
                                </Button>
                            </Link>
                        </li>
                        <li className="md:inline-block hidden">
                            <Link href="/signup">
                                <Button size={'sm'}>
                                    Register
                                </Button>
                            </Link>
                        </li>
                        <ThemeSwitcher />
                        <span className="sm:hidden block"><MobileHeader /></span>
                    </ul>
                </div>
            </div>
        </header>
    );
}
