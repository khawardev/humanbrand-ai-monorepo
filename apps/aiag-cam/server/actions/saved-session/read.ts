"use server"

import { db } from "@/server/db"
import { eq, desc } from "drizzle-orm"
import { savedSession } from "@/server/db/schema/savedSessionSchema"
import { getSession } from "@/server/actions/getSession"
import { cache } from "react"

export async function getSessionById(sessionId: string) {
    try {
        const result = await db.select().from(savedSession).where(eq(savedSession.id, sessionId))
        return result[0]
    } catch (error) {
        console.error("Error fetching session:", error)
        return null
    }
}

export const getSavedSessions = cache(async () => {
    try {
        const session: any = await getSession();
        if (!session?.user?.id) return []

        const sessions = await db.select({
            id: savedSession.id,
            title: savedSession.title,
            sessionType: savedSession.sessionType,
            updatedAt: savedSession.updatedAt,
        }).from(savedSession)
            .where(eq(savedSession.userId, session.user.id))
            .orderBy(desc(savedSession.updatedAt))
        return sessions
    } catch (error) {
        console.error("Error fetching sessions:", error)
        return []
    }
})
