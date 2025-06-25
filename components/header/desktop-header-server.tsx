import UserMenu from "@/components/header/user-menu";
import SavedSessions from "../aiag-components/reusable-components/session/saved-sessions";
import { SigninButtonDesktop } from "../aiag-components/reusable-components/auth/signin-button";
import MobileHeader from "./mobile-header";
import { Suspense } from "react";
import { getSession } from "@/lib/get-session";


const Skeleton = () => (
    <div className="flex items-center gap-2 animate-pulse">
        <div className="size-8 rounded-md bg-card border flex items-center justify-center" />
    </div>
);

const DesktopHeaderServer = async () => {
    const session = await getSession();

    if (!session) {
        return <SigninButtonDesktop />;
    }


    return (
        <>
            <Suspense fallback={<Skeleton />}>
                <SavedSessions />
            </Suspense>
            <UserMenu user={session?.user} />
            <div className="sm:hidden block pl-2 border-l">
                <MobileHeader user={session?.user} />
            </div>
        </>
    );
};

export default DesktopHeaderServer;
