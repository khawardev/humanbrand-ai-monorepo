import UserMenu from "@/components/header/user-menu";
import SavedSessions from "../aiag-components/reusable-components/session/saved-sessions";
import { getSession, getUserWithSessions } from "@/actions/user";
import { SigninButtonDesktop } from "../aiag-components/reusable-components/auth/signin-button";
import MobileHeader from "./mobile-header";
import { Suspense } from "react";
import { Spinner } from "@/shared/spinner";

export const revalidate = 0;

const Skeleton = () => (
    <div className="flex items-center gap-2 animate-pulse">
        <div className="size-8 rounded-md bg-card border flex items-center justify-center" /> 
    </div>
);

const AuthenticatedContent = async () => {
    const user: any = await getUserWithSessions();
    if (!user) return <Skeleton />;

    return (
        <>
            <SavedSessions savedSessions={user?.savedSessions} />
            <UserMenu user={user} />
            <div className="sm:hidden block pl-2 border-l">
                <MobileHeader user={user} />
            </div>
        </>
    );
};

const DesktopHeaderServer = async () => {
    const session = await getSession();

    if (!session) {
        return <SigninButtonDesktop />;
    }

    return (
        <Suspense fallback={<Skeleton />}>
            <AuthenticatedContent />
        </Suspense>
    );
};

export default DesktopHeaderServer;
