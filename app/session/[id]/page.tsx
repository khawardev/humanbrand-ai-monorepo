import { getSessionById } from "@/actions/saved-session-actions"
import { getUser } from "@/actions/users-actions";
import { SessionPageComponent } from "@/components/aiag-components/session/session-component";
import { notFound } from "next/navigation"

const page = async ({ params }: any) => {
    const resolvedParams = await params;
    const sessionId = resolvedParams?.id;
    const sessionData = await getSessionById(sessionId)
    const user = await getUser()
    if (!sessionData) {
        notFound()
    }
    return <SessionPageComponent user={user} initialData={sessionData} />
}

export default page

