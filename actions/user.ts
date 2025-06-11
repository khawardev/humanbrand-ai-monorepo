"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getUser(){
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return 'null';
  }

  return (await db.select().from(user).where(eq(user.id, session.user.id)))[0];
}
