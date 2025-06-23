import UserMenu from "@/components/header/user-menu";
import SavedSessions from "../aiag-components/reusable-components/session/saved-sessions";
import { getUserWithSessions } from "@/actions/user";
import { SigninButtonDesktop } from "../aiag-components/reusable-components/auth/signin-button";
import MobileHeader from "./mobile-header";

export const revalidate = 0;

const DesktopHeaderServer = async () => {
    const user:any = await getUserWithSessions();
    return (
        <>
            {!user && <SigninButtonDesktop />}
            {user && (
                <>
                    <SavedSessions savedSessions={user?.savedSessions} />
                    <UserMenu user={user} />
                </>
            )}
            <div className="sm:hidden block pl-2 border-l">
                <MobileHeader user={user} />
            </div>
        </>
    );
};

export default DesktopHeaderServer;