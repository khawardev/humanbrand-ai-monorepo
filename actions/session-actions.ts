"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db"
import { savedSession } from "@/db/schema/session-schema"

export async function createSession(data: any) {
    try {
        const newSession = await db
            .insert(savedSession)
            .values(data)
            .returning()

        const sessionId = newSession[0].id
        if (!sessionId) {
            throw new Error("Failed to create session.")
        }
        revalidatePath(`/session/${sessionId}`)
        return { sessionId }
        
    } catch (error) {
        console.error("Error creating session:", error)
        return { error: "Could not create session." }
    }
}

export async function updateSession(
    sessionId: string,
    data: any,
) {
    try {
        await db
            .update(savedSession)
            .set(data)
            .where(eq(savedSession.id, sessionId))

        revalidatePath(`/session/${sessionId}`)
        return { success: true }
    } catch (error) {
        console.error("Error updating session:", error)
        return { error: "Could not update session." }
    }
}

export async function getSessionById(sessionId: string) {
    try {
        const result = await db.select().from(savedSession).where(eq(savedSession.id, sessionId))
        return result[0]
    } catch (error) {
        console.error("Error fetching session:", error)
        return null
    }
}