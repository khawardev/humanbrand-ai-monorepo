import { getSessionById } from "@/actions/session-actions"
import { SessionComponent } from "@/components/aiag-components/session/session-component"
import { SessionClientPage } from "@/components/aiag-components/session/SessionClientPageComponent";
import { notFound } from "next/navigation"

const page = async ({ params }: any) => {
    const resolvedParams = await params;
    const sessionId = resolvedParams?.id;
    const sessionData = await getSessionById(sessionId)
    if (!sessionData) {
        notFound()
    }
    return <SessionClientPage initialData={sessionData} />
}

export default page

