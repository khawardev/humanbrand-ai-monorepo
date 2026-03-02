"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/server/db"
import { eq } from "drizzle-orm"
import { savedSession } from "@/server/db/schema/savedSessionSchema"

export async function deleteSession(sessionId: string) {
    try {
        await db.delete(savedSession).where(eq(savedSession.id, sessionId))
        revalidatePath("/dashboard")
        revalidatePath("/dashboard", "layout")
        return { success: true }
    } catch (error) {
        console.error("Error deleting session:", error)
        return { error: "Could not delete session." }
    }
}
