"use server";

import { db } from "@/db";
import { getSession } from "@/lib/get-session";
import { desc, eq } from "drizzle-orm";
import { user } from "@/db/schema/users-schema";
import { savedSession } from "@/db/schema/saved-session-schema";
import { cache } from "react";

export async function getUser() {
  const session: any = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  const currentUser = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));

  return currentUser[0] ?? null;
}

export const getUserWithSavedSessions = cache(async () => {
  const session: any = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  try {

    const userWithSavedSessions = await db.query.user.findFirst({
      where: eq(user.email, session.user.email), 
      with: {
        savedSessions: {
          orderBy: [desc(savedSession.updatedAt)], 
        },
      },
    });

    return userWithSavedSessions ?? null;
  } catch (error) {
    console.error("Error fetching user with saved sessions:", error);
    return null;
  }
});