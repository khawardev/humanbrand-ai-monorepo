"use server";

import { db } from "@/server/db";
import { getSession } from "@/server/actions/getSession";
import { getUser } from "@/server/actions/usersActions";
import { supportTicket } from "@/server/db/schema/supportSchema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { ADMIN_SUPPORT_EMAILS } from "@/config/aiagConfig";
import { getSupportTicketTemplate } from "@/lib/email/templates/support-ticket";
import { SupportTicketAdmin } from "@/types/admin";
import { auth } from "@/lib/auth/auth";

type SessionData = {
  user: typeof auth.$Infer.Session.user;
  session: typeof auth.$Infer.Session;
} | null;

export async function createSupportTicket(data: {
  subject: string;
  description: string;
  type: "bug_report" | "feature_request";
  attachments: string[];
}) {
  const session = await getSession() as SessionData;

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const [ticket] = await db
      .insert(supportTicket)
      .values({
        userId: session.user.id,
        subject: data.subject,
        description: data.description,
        type: data.type,
        attachments: data.attachments,
      })
      .returning();

    const html = getSupportTicketTemplate({
        subject: data.subject,
        description: data.description,
        type: data.type,
        attachments: data.attachments,
        user: {
            name: session.user.name,
            email: session.user.email
        }
    });

    // Send email with CC only for company users
    const isCompanyUser = session.user.email?.endsWith("@aiag.org");

    await sendEmail({
      to: ADMIN_SUPPORT_EMAILS.join(", "),
      cc: isCompanyUser ? ["john@humanbrand.ai", "aaron@humanbrand.ai"] : undefined,
      subject: `[Support Ticket] ${data.subject} - ${session.user.name}`,
      html,
    });

    revalidatePath("/dashboard/support");
    return { success: true, ticket };
  } catch (error) {
    console.error("Error creating support ticket:", error);
    return { success: false, error: "Failed to create support ticket." };
  }
}

export async function getUserSupportTickets() {
  const session = await getSession() as SessionData;

  if (!session?.user?.id) {
    return [];
  }

  try {
    const tickets = await db.query.supportTicket.findMany({
      where: eq(supportTicket.userId, session.user.id),
      orderBy: [desc(supportTicket.createdAt)],
    });
    return tickets;
  } catch (error) {
    console.error("Error fetching user support tickets:", error);
    return [];
  }
}

export async function getAllSupportTickets(): Promise<SupportTicketAdmin[]> {
  // Add admin check here if needed, but usually handled by route protection/UI hiding
  // For safety, let's check if user is admin
  const user = await getUser();
  if (!user?.isAdmin) {
     // Return empty or throw, but let's return empty to avoid breaking UI if called erroneously
     return [];
  }

  try {
    const tickets = await db.query.supportTicket.findMany({
      with: {
        user: true, 
      },
      orderBy: [desc(supportTicket.createdAt)],
    });
    return tickets as unknown as SupportTicketAdmin[];
  } catch (error) {
    console.error("Error fetching all support tickets:", error);
    return [];
  }
}

export async function updateSupportTicketStatus(
  ticketId: string,
  status: "pending" | "in_progress" | "completed" | "rejected",
  remarks?: string
) {
     const user = await getUser();
   if (!user?.isAdmin) {
      throw new Error("Unauthorized");
   }

  try {
    await db
      .update(supportTicket)
      .set({
        status,
        adminRemarks: remarks,
        updatedAt: new Date(),
      })
      .where(eq(supportTicket.id, ticketId));

    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/support");
    return { success: true };
  } catch (error) {
    console.error("Error updating support ticket:", error);
    return { success: false, error: "Failed to update support ticket." };
  }
}

export async function checkNewSupportTickets() {
  const user = await getUser();
  if (!user?.id) return { user: {}, admin: {} };

  try {
    const userTickets = await db.query.supportTicket.findMany({
      where: eq(supportTicket.userId, user.id),
      columns: { status: true },
    });

    const userCounts = userTickets.reduce(
      (acc: Record<string, number>, curr) => {
        const status = curr.status || "pending";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {}
    );

    let adminCounts: Record<string, number> = {};

    if (user.isAdmin) {
      const adminTickets = await db.query.supportTicket.findMany({
        columns: { status: true },
      });

      adminCounts = adminTickets.reduce(
        (acc: Record<string, number>, curr) => {
          const status = curr.status || "pending";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {}
      );
    }

    return {
      user: userCounts,
      admin: adminCounts,
    };
  } catch (error) {
    console.error("Error checking new support tickets:", error);
    return { user: {}, admin: {} };
  }
}
