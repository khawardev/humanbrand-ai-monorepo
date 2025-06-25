import UserMenu from "@/components/header/user-menu";
import SavedSessions from "../aiag-components/reusable-components/session/saved-sessions";
import { SigninButtonDesktop } from "../aiag-components/reusable-components/auth/signin-button";
import MobileHeader from "./mobile-header";
import { Suspense } from "react";
import { getSession } from "@/lib/get-session";



const DesktopHeaderServer = async () => {
    const session = await getSession();

    if (!session) {
        return <SigninButtonDesktop />;
    }


    return (
        <>
            <SavedSessions />
            <UserMenu user={session?.user} />
            <div className="sm:hidden block pl-2 border-l">
                <MobileHeader user={session?.user} />
            </div>
        </>
    );
};

export default DesktopHeaderServer;
