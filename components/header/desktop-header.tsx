import UserMenu from "@/components/header/user-menu"
import Link from "next/link"
import { ThemeSwitcher } from "../ui/theme-switcher"
import MobileHeader from "./mobile-header"
import { FullLogo, FullLogoMobile, HalfLogo } from "@/shared/logo"
import SavedSessions from "../aiag-components/reusable-components/session/saved-sessions"
import { getUser, getUserWithSessions } from "@/actions/user"
import { SigninButtonDesktop } from "../aiag-components/reusable-components/auth/signin-button"
import NavigationMenuComp from "./navigation-menu"

export const revalidate = 0
const DesktopHeader = async () => {
    const user: any = await getUserWithSessions()
    return (
        <header className="border-b ">
            <div className="sm:w-8/12 w-full mx-auto sm:px-0 px-4">
                <div className="flex h-18 items-center justify-between gap-4 ">
                    <Link href="/">
                        <span className=" md:block hidden"><FullLogo /></span>
                        <span className=" md:hidden block "><FullLogoMobile /></span>
                    </Link>
                    <NavigationMenuComp />
                    <div className="flex  items-center justify-end gap-2">
                        {!user && <SigninButtonDesktop />}
                        {user && <SavedSessions savedSessions={user?.savedSessions} />}
                        {user && <UserMenu user={user} />}
                        <div className="sm:hidden block pl-2 border-l"><MobileHeader user={user} /></div>
                        <div className=" md:pl-2 md:border-l"><ThemeSwitcher /></div>
                    </div>
                </div>
            </div>
        </header>
    )
}
export default DesktopHeader