import { getSessionById } from "@/actions/session-actions"
import { getUser } from "@/actions/user";
import { SessionClientPage } from "@/components/aiag-components/session/SessionClientPageComponent";
import { notFound } from "next/navigation"

const page = async ({ params }: any) => {
    const resolvedParams = await params;
    const sessionId = resolvedParams?.id;
    const sessionData = await getSessionById(sessionId)
    const user = await getUser()
    if (!sessionData) {
        notFound()
    }
    return <SessionClientPage user={user} initialData={sessionData} />
}

export default page

