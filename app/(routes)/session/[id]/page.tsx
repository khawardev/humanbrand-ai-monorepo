import { getSessionById } from "@/server/actions/savedSessionActions"
import { getUser } from "@/server/actions/usersActions";
import { SessionPageComponent } from "@/components/aiag-components/session/session-component";

const page = async ({ params }: any) => {
    const resolvedParams = await params;
    const sessionId = resolvedParams?.id;
    const sessionData = await getSessionById(sessionId)
    const user = await getUser()

    return <SessionPageComponent user={user} initialData={sessionData} />
}

export default page
