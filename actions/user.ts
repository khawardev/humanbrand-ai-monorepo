"use server";

import { db } from "@/db";
import { savedSession } from "@/db/schema/session-schema";
import { user } from "@/db/schema/users-schema";
import { auth } from "@/lib/auth";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getUser(){
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
   return null;
  }

  return (await db.select().from(user).where(eq(user.id, session.user.id)))[0];
}


export async function getUserWithSessions() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user?.id) {
    console.warn("No session or user ID in session");
    return null;
  }

  const results = await db
    .select({
      user: user,
      sessions: savedSession
    })
    .from(user)
    .leftJoin(savedSession, eq(user.id, savedSession.userId))
    .where(eq(user.id, session.user.id))
    .orderBy(desc(savedSession.updatedAt)); 

  const userData = results[0]?.user;
  const sessions = results.filter(row => row.sessions !== null).map(row => row.sessions);

  return {
    ...userData,
    savedSessions: sessions
  };
}