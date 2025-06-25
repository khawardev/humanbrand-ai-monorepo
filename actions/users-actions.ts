// "use server";

// import { db } from "@/db";
// import { savedSession } from "@/db/schema/session-schema";
// import { auth } from "@/lib/auth";
// import { authClient } from "@/lib/auth-client";
// import { desc, eq } from "drizzle-orm";
// import { headers } from "next/headers";
// import { user, session as sessionTable } from "@/db/schema/users-schema";
// import { getSession } from "@/lib/get-session";

// export async function getUser(){
//   const session = await auth.api.getSession({ headers: await headers() });
//   if (!session) {
//    return null;
//   }

//   return (await db.select().from(user).where(eq(user.id, session.user.id)))[0];
// }


// export async function getUserWithSavedSessions() {
//   const session = await getSession();

//   if (!session) {
//     console.warn("No session or user ID in session");
//     return null;
//   }

//   const results = await db
//     .select({
//       user: user,
//       sessions: savedSession
//     })
//     .from(user)
//     .leftJoin(savedSession, eq(user.id, savedSession.userId))
//     .where(eq(user.id, session.user.id))
//     .orderBy(desc(savedSession.updatedAt)); 

//   const userData = results[0]?.user;
//   const sessions = results.filter(row => row.sessions !== null).map(row => row.sessions);

//   return {
//     ...userData,
//     savedSessions: sessions
//   };
// }










"use server";

import { db } from "@/db";
import { getSession } from "@/lib/get-session";
import { desc, eq } from "drizzle-orm";
import { user } from "@/db/schema/users-schema";
import { savedSession } from "@/db/schema/saved-session-schema";

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

export const getUserWithSavedSessions = async () => {
  const session: any = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  try {
    console.log(`<-> trying userWithSavedSessions .... <->`);

    // const userWithSavedSessions = await db
    //   .select({
    //     user: user,
    //     sessions: savedSession
    //   })
    //   .from(user)
    //   .leftJoin(savedSession, eq(user.id, savedSession.userId))
    //   .where(eq(user.id, session.user.id))
    //   .orderBy(desc(savedSession.updatedAt));

    // const userData = userWithSavedSessions[0]?.user;
    // const sessions = userWithSavedSessions.filter(row => row.sessions !== null).map(row => row.sessions);
    // console.log(userWithSavedSessions, `<-> userWithSavedSessions <->`);

    // return {
    //   ...userData,
    //   savedSessions: sessions
    // };


    const userWithSavedSessions = await db.query.user.findFirst({
      where: eq(user?.email, session?.user?.email),
      with: {
        savedSessions: {
          orderBy: [desc(savedSession?.updatedAt)],
        },
      },
    });
    console.log(userWithSavedSessions, `<-> userWithSavedSessions <->`);

    return userWithSavedSessions ?? null;
  } catch (error) {
    console.error("Error fetching user with saved sessions:", error);
    return null;
  }













};