import Link from "next/link";
import { ThemeSwitcher } from "../ui/theme-switcher";
import { FullLogo, HalfLogo } from "@/shared/logo";
import NavigationMenuComp from "./navigation-menu";
import DesktopHeaderServer from "./desktop-header-server";
import { getUser } from "@/actions/users-actions";
import { OVERALL_ADMIN_EMAILS, AIAGConfig } from "@/config/aiag-config";
import MobileHeader from "./mobile-header";


const DesktopHeader = async () => {
    const user = await getUser();
    const isAdmin = user?.email ? OVERALL_ADMIN_EMAILS.includes(user.email) : false;

    const navLinks = AIAGConfig.mainNav.filter(({ title }:any) => {
        if (!user) return !['AI', 'Admin'].includes(title);
        if (title === 'AI') return true;
        return title !== 'Admin' || isAdmin;
    });

    return (
        <div className="sm:w-8/12 w-full mx-auto sm:px-0 px-4">
            <div className="flex h-22 items-center justify-between gap-4">
                <Link href="/" suppressHydrationWarning>
                    <FullLogo />
                </Link>
                <NavigationMenuComp navLinks={navLinks} />
                <div className="flex items-center justify-end gap-2">
                    <DesktopHeaderServer navLinks={navLinks} />
                    {!user && (
                        <div className="sm:hidden block pl-2 border-l">
                            <MobileHeader navLinks={navLinks} user={null} />
                        </div>
                    )}
                    <div className="md:pl-2 md:border-l">
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesktopHeader;