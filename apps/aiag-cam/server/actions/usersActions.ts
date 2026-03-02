"use server";

import { db } from "@/server/db";
import { getSession } from "@/server/actions/getSession";
import { desc, eq, like } from "drizzle-orm";
import { user } from "@/server/db/schema/usersSchema";
import { savedSession } from "@/server/db/schema/savedSessionSchema";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";

type SessionData = {
  user: typeof auth.$Infer.Session.user;
  session: typeof auth.$Infer.Session;
} | null;

export const getUser = cache(async () => {
  const session = await getSession() as SessionData;

  if (!session?.user?.id) {
    return null;
  }

  const currentUser = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id));

  return currentUser[0] ?? null;
});

export const getUserWithSavedSessions = cache(async () => {
  const session = await getSession() as SessionData;

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

export async function getCompanyUsers() {
  try {
    const companyUsers = await db.query.user.findMany({
      where: like(user.email, "%@aiag.org"),
      orderBy: [desc(user.createdAt)],
    });
    return companyUsers;
  } catch (error) {
    console.error("Error fetching company users:", error);
    return [];
  }
}

export async function updateUserVerification(userId: string, isVerified: boolean) {
  try {
    await db
      .update(user)
      .set({ adminVerified: isVerified, updatedAt: new Date() })
      .where(eq(user.id, userId));

    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard", "layout");
  } catch (error) {
    console.error("Error updating user verification status:", error);
    throw new Error("Failed to update user status.");
  }
}

export async function deleteUserById(userId: string) {
  try {
    await db.delete(savedSession).where(eq(savedSession.userId, userId));
    await db.delete(user).where(eq(user.id, userId));
    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user." };
  }
}

export async function toggleUserAdminStatus(userId: string, isAdmin: boolean) {
  try {
    await db
      .update(user)
      .set({ isAdmin: isAdmin, updatedAt: new Date() })
      .where(eq(user.id, userId));

    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error updating user admin status:", error);
    return { success: false, error: "Failed to update user admin status." };
  }
}

export async function updateUserPreferredModel(userId: string, modelId: number) {
  try {
    await db
      .update(user)
      .set({ preferredModel: modelId, updatedAt: new Date() })
      .where(eq(user.id, userId));

    revalidatePath("/dashboard/ai-chat");
    return { success: true };
  } catch (error) {
    console.error("Error updating user preferred model:", error);
    return { success: false, error: "Failed to update user preferred model." };
  }
}

export const getUserModelAlias = cache(async (userId: string) => {
  try {
    const currentUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });

    const { modelTabs } = await import("@/config/formData"); 

    const preferredModelId = currentUser?.preferredModel || 2;
    const selectedModel = modelTabs.find(m => m.id === preferredModelId);
    return selectedModel?.label || 'openai';
  } catch (error) {
    console.error("Error fetching user model alias:", error);
    return 'openai';
  }
});