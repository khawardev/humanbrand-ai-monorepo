import Link from "next/link";
import { ThemeSwitcher } from "../ui/theme-switcher";
import { FullLogo, HalfLogo } from "@/components/shared/Logo";
import NavigationMenuComp from "./NavigationMenu";
import DesktopHeaderServer from "./DesktopHeaderServer";
import { getUser } from "@/server/actions/usersActions";
import { ADMIN_EMAILS, AIAGConfig } from "@/config/aiagConfig";
import MobileHeader from "./MobileHeader";


const DesktopHeader = async () => {
    const user = await getUser();
    const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false;

    const navLinks = user
        ? AIAGConfig.mainNav.filter((nav: any) => {
            if (nav.title === 'Admin') return isAdmin;
            return true;
        })
        : [];

    return (
        <div className="sm:w-9/12 w-full mx-auto sm:px-0 px-4">
            <div className="flex h-22 items-center justify-between gap-4">
                <Link href="/" suppressHydrationWarning>
                    <FullLogo />
                </Link>
                {/* <NavigationMenuComp navLinks={navLinks} /> */}
                <div className="flex items-center justify-end gap-2">
                    {/* <DesktopHeaderServer navLinks={navLinks} /> */}
                    {/* {!user && (
                        <div className="sm:hidden block pl-2 border-l">
                            <MobileHeader navLinks={navLinks} user={null} />
                        </div>
                    )} */}
                    <div className="md:pl-2 md:border-l">
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DesktopHeader;