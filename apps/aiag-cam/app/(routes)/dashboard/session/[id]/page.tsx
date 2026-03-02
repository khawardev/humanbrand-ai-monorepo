import { Suspense } from "react"
import { SessionPageComponent } from "@/components/routes/session/SessionPageComponent"
import { DashboardInnerLayout } from "@/components/shared/DashboardComponents"
import { Hero } from "@/components/shared/reusable/Hero"
import { getSessionById } from "@/server/actions/savedSessionActions"
import { getUser } from "@/server/actions/usersActions"
import { LineSpinner } from "@/components/shared/Spinner"

const SessionPage = async ({ params }: any) => {
    const resolvedParams = await params;
    const sessionId = resolvedParams?.id;
    const sessionData = await getSessionById(sessionId)
    const user = await getUser()

    return (
        <DashboardInnerLayout>
            <Hero />
            <Suspense fallback={<LineSpinner>Loading Session...</LineSpinner>}>
                <SessionPageComponent user={user} initialData={sessionData} />
            </Suspense>
        </DashboardInnerLayout>
    )
}

export default SessionPage
