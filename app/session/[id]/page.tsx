import { notFound } from "next/navigation"
import { getSessionById } from "@/lib/actions/session.actions"
import { SessionComponent } from "@/components/session/session-component"

type SessionPageProps = {
    params: {
        id: string
    }
}

export default async function SessionPage({ params }: SessionPageProps) {
    const sessionData = await getSessionById(params.id)

    if (!sessionData) {
        notFound()
    }

    return <SessionComponent initialData={sessionData} />
}