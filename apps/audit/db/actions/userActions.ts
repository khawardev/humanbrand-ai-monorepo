"use server";

import { db } from "@/db";
import { getSession } from "@/lib/auth/getSession";
import { desc, eq, count } from "drizzle-orm";
import { user, audit } from "@/db/schema";
import { cache } from "react";

export const getCurrentUser = cache(async () => {
    const session = await getSession();

    if (!session?.user?.id) {
        return null;
    }

    try {
        const currentUser = await db.query.user.findFirst({
            where: eq(user.id, session.user.id),
        });

        return currentUser ?? null;
    } catch (error) {
        console.error("Error fetching current user:", error);
        return null;
    }
});

export const getUserWithAudits = async ({ page = 1, pageSize = 9 } = {}) => {
    const session = await getSession();

    if (!session?.user?.id) {
        return null;
    }

    try {
        const userId = session.user.id;

        const [userCheck, totalAuditsResult, userAudits] = await Promise.all([
            db.query.user.findFirst({
                where: eq(user.id, userId),
                columns: { id: true }
            }),
            db.select({ value: count() }).from(audit).where(eq(audit.userId, userId)),
            db.query.audit.findMany({
                where: eq(audit.userId, userId),
                orderBy: [desc(audit.createdAt)],
                limit: pageSize,
                offset: (page - 1) * pageSize,
                columns: {
                    id: true,
                    url: true,
                    status: true,
                    createdAt: true,
                }
            })
        ]);

        if (!userCheck) {
            return null;
        }

        const totalAudits = totalAuditsResult[0]?.value ?? 0;

        return { ...userCheck, audits: userAudits, totalAudits };

    } catch (error) {
        console.error("Error fetching user with audits:", error);
        return null;
    }
};