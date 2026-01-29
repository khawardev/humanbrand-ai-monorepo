import UserMenu from "@/components/header/user-menu";
import SavedSessions from "../aiag-components/reusable-components/session/saved-sessions";
import { SigninButtonDesktop } from "../aiag-components/reusable-components/auth/signin-button";
import MobileHeader from "./mobile-header";
import { Suspense } from "react";
import { getSession } from "@/server/actions/get-session";
import { getUserWithSavedSessions } from "@/server/actions/users-actions";
import AuthButtons from "../aiag-components/reusable-components/auth/AuthButtons";

export const revalidate = 0;

const Skeleton = () => (
    <div className="flex items-center gap-2 animate-pulse">
        <div className="size-8 rounded-md bg-card border flex items-center justify-center" />
    </div>
);

const AuthenticatedContent = async ({ navLinks }: any) => {
    const rawUser: any = await getUserWithSavedSessions();

    if (!rawUser) {
        return null;
    }

    const user = JSON.parse(JSON.stringify(rawUser));

    return (
        <>
            <SavedSessions savedSessions={user?.savedSessions} />
            <UserMenu user={user} />
            <div className="sm:hidden block pl-2 border-l">
                <MobileHeader navLinks={navLinks} user={user} />
            </div>
        </>
    );
};

const DesktopHeaderServer = async ({ navLinks }: any) => {
    const session = await getSession();
    if (!session) {
        return <AuthButtons />;
    }

    return (
        <Suspense fallback={<Skeleton />}>
            <AuthenticatedContent navLinks={navLinks} />
        </Suspense>
    );
};

export default DesktopHeaderServer;