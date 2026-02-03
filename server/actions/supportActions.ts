"use server";

import { db } from "@/server/db";
import { getSession } from "@/server/actions/getSession";
import { supportTicket } from "@/server/db/schema/supportSchema";
import { eq, desc, gt, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { ADMIN_EMAILS, ADMIN_SUPPORT_EMAILS } from "@/config/aiagConfig";

export async function createSupportTicket(data: {
  subject: string;
  description: string;
  type: "bug_report" | "feature_request";
  attachments: string[];
}) {
  const session: any = await getSession();

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

    
    // Construct email HTML
    // 1. PRE-CALCULATE LOGIC
    const currentYear = new Date().getFullYear();
    const formattedType = data.type.replace(/_/g, ' ');

    // Generate Attachment HTML
    const attachmentHtml = data.attachments.length > 0
      ? `
    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #111827;">
        Attachments (${data.attachments.length})
      </p>
      <div>
        ${data.attachments.map((url, index) => `
          <a href="${url}" target="_blank" style="display: inline-block; background-color: #f3f4f6; color: #4b5563; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; margin-right: 10px; margin-bottom: 10px; border: 1px solid #e5e7eb; font-weight: 500;">
            📎 View Attachment ${index + 1}
          </a>
        `).join('')}
      </div>
    </div>`
      : '';

    // 2. THE TEMPLATE
    const html = `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <title>New Support Ticket</title>
  
  <!-- IMPORT INTER FONT -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!--[if mso]>
  <style>
    /* Outlook Fallback Font */
    body, table, td, h1, h2, h3, p, div, span, a { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->

  <style>
    /* Global Resets */
    body { margin: 0; padding: 0; word-spacing: normal; background-color: #ffffff; }
    table, td { border-collapse: collapse !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    
    /* Font Settings */
    body, table, td, div, p, a, span {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #333333;
    }

    /* Mobile Responsive */
    @media screen and (max-width: 600px) {
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .header-text { font-size: 20px !important; }
    }

    /* Dark Mode Support */
    @media (prefers-color-scheme: dark) {
      body { background-color: #1a1a1a !important; }
      .header-bg { background-color: #000000 !important; }
      .content-text { color: #ffffff !important; }
      .label-text { color: #9ca3af !important; }
      .description-box { background-color: #262626 !important; border-color: #404040 !important; color: #e5e7eb !important; }
      .footer-bg { background-color: #111111 !important; border-top-color: #333333 !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#ffffff;">

  <!-- PREHEADER -->
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    New Ticket: ${data.subject}
  </div>

  <!-- FULL WIDTH HEADER -->
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" class="header-bg" style="background-color: #111827; width: 100%;">
    <tr>
      <td class="mobile-padding" style="padding: 25px 40px; text-align: left;">
        <h1 class="header-text" style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600; letter-spacing: -0.02em;">
          Support System
        </h1>
      </td>
    </tr>
  </table>

  <!-- FULL WIDTH CONTENT -->
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; background-color: #ffffff;">
    <tr>
      <td class="mobile-padding" style="padding: 40px 40px;">
        
        <!-- Intro -->
        <div style="margin-bottom: 30px;">
          <h2 class="content-text" style="margin: 0 0 10px 0; font-size: 24px; font-weight: 700; color: #111827;">New Ticket Received</h2>
          <p class="content-text" style="margin: 0; font-size: 16px; color: #6b7280;">
            A new support request has been submitted. Details are below.
          </p>
        </div>

        <!-- Info Grid (Full Width Table) -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 30px; border-bottom: 1px solid #e5e7eb;">
          <tr>
            <td style="padding-bottom: 20px; border-bottom: 1px solid #f3f4f6; width: 150px; vertical-align: top;">
              <span class="label-text" style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Subject</span>
            </td>
            <td class="content-text" style="padding-bottom: 20px; border-bottom: 1px solid #f3f4f6; padding-left: 20px; font-size: 16px; font-weight: 500; color: #111827;">
              ${data.subject}
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 0; border-bottom: 1px solid #f3f4f6; vertical-align: top;">
              <span class="label-text" style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Submitted By</span>
            </td>
            <td class="content-text" style="padding: 20px 0 20px 20px; border-bottom: 1px solid #f3f4f6; font-size: 15px; color: #374151;">
              <span style="font-weight: 600; color: #111827;">${session.user.name}</span> 
              <span style="color: #9ca3af;">&bull;</span> 
              <a href="mailto:${session.user.email}" style="color: #2563eb; text-decoration: none;">${session.user.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 0; vertical-align: center;">
              <span class="label-text" style="font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280;">Type</span>
            </td>
            <td style="padding: 20px 0 20px 20px;">
              <span style="background-color: #e0f2fe; color: #0369a1; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; text-transform: capitalize; letter-spacing: 0.02em;">
                ${formattedType}
              </span>
            </td>
          </tr>
        </table>

        <!-- Description -->
        <div style="margin-bottom: 8px;">
          <span class="content-text" style="font-weight: 600; font-size: 15px; color: #111827;">Description</span>
        </div>
        
        <div class="description-box" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; font-size: 15px; line-height: 1.6; color: #374151; white-space: pre-wrap; font-family: 'Inter', sans-serif;">${data.description}</div>

        <!-- Attachments Section (Injected) -->
        ${attachmentHtml}

      </td>
    </tr>
  </table>

  <!-- FULL WIDTH FOOTER -->
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" class="footer-bg" style="background-color: #f9fafb; width: 100%; border-top: 1px solid #e5e7eb;">
    <tr>
      <td class="mobile-padding" style="padding: 30px 40px; text-align: left;">
        <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px;">
          &copy; ${currentYear} HumanBrand AI. All rights reserved.
        </p>
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
          Please do not reply directly to this automated email.
        </p>
      </td>
    </tr>
  </table>

</body>
</html>
`;

    // Send email with CC
    await sendEmail({
      to: ADMIN_SUPPORT_EMAILS.join(", "),
      cc: ["john@humanbrand.ai", "aaron@humanbrand.ai"],
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
  const session: any = await getSession();

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

export async function getAllSupportTickets() {
  // Add admin check here if needed, but usually handled by route protection/UI hiding
  // For safety, let's check if user is admin
  const session: any = await getSession();
   if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
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
    return tickets;
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
     const session: any = await getSession();
   if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
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
    const session: any = await getSession();
    if (!session?.user?.id) return { hasNewUserTickets: false, hasNewAdminTickets: false };

    // Calculate time 24 hours ago
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
        const userNewTickets = await db.query.supportTicket.findFirst({
            where: (tickets, { and, eq, gt }) => and(
                eq(tickets.userId, session.user.id),
                gt(tickets.createdAt, oneDayAgo)
            )
        });

        const adminNewTickets = await db.query.supportTicket.findFirst({
            where: (tickets, { gt }) => gt(tickets.createdAt, oneDayAgo)
        });

        return {
            hasNewUserTickets: !!userNewTickets,
            hasNewAdminTickets: !!adminNewTickets
        };
    } catch (error) {
        console.error("Error checking new support tickets:", error);
        return { hasNewUserTickets: false, hasNewAdminTickets: false };
    }
}
