import { getCurrentUser } from "@/db/actions/userActions";
import { appConfig } from "@/config/site";
import ConfigTrayClient from "./ConfigTrayClient";

export const revalidate = 0;

const ConfigTray = async () => {
    const user = await getCurrentUser();

    return <ConfigTrayClient user={user} appConfig={appConfig} />;
};

export default ConfigTray;
