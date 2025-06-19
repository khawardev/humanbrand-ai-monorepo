import { getSessionById } from "@/actions/session-actions"
import { SessionComponent } from "@/components/aiag-components/session/session-component"
import { notFound } from "next/navigation"

const page = async ({ params }: any) => {
    const resolvedParams = await params;
    const sessionId = resolvedParams?.id;
    const sessionData = await getSessionById(sessionId)
    if (!sessionData) {
        notFound()
    }
    console.log(sessionData, `<-> sessionData <->`);
    return <SessionComponent initialData={sessionData} />
}

export default page
