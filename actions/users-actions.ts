"use server";

import { db } from "@/db";
import { getSession } from "@/lib/get-session";
import { desc, eq } from "drizzle-orm";
import { user } from "@/db/schema/users-schema";
import { savedSession } from "@/db/schema/saved-session-schema";
import { cache } from "react";
import { revalidatePath } from "next/cache";

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

export async function getAllUsers() {
  try {
    const allUsers = await db.query.user.findMany({
      orderBy: [desc(user.createdAt)],
    });
    return allUsers;
  } catch (error) {
    console.error("Error fetching all users:", error);
    return [];
  }
}

export async function updateUserVerification(userId: string, isVerified: boolean) {
  try {
    await db
      .update(user)
      .set({ adminVerified: isVerified, updatedAt: new Date() })
      .where(eq(user.id, userId));

    revalidatePath("/admin");
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error("Error updating user verification status:", error);
    throw new Error("Failed to update user status.");
  }
}