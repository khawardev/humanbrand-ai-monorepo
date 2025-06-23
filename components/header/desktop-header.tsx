import Link from "next/link";
import { ThemeSwitcher } from "../ui/theme-switcher";
import { FullLogo, FullLogoMobile } from "@/shared/logo";
import NavigationMenuComp from "./navigation-menu";
import DesktopHeaderServer from "./desktop-header-server";
import { Suspense } from "react";

const Skeleton = () => (
    <div className="flex items-center gap-2 animate-pulse">
        <div className="size-8 rounded-md " />
        <div className="size-8 rounded-md " />
    </div>
);
const DesktopHeader = () => {
    return (
        <header className="border-b">
            <div className="sm:w-8/12 w-full mx-auto sm:px-0 px-4">
                <div className="flex h-18 items-center justify-between gap-4">
                    <Link href="/">
                        <span className="md:block hidden"><FullLogo /></span>
                        <span className="md:hidden block"><FullLogoMobile /></span>
                    </Link>
                    <NavigationMenuComp />
                    <div className="flex items-center justify-end gap-2">
                        <Suspense fallback={<Skeleton />}>
                            <DesktopHeaderServer />
                        </Suspense>
                        <div className="md:pl-2 md:border-l">
                            <ThemeSwitcher />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DesktopHeader;