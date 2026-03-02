"use server";

import { db } from "@/server/db";
import { loomVideo } from "@/server/db/schema/loomVideosSchema";
import { user } from "@/server/db/schema/usersSchema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/server/actions/getSession";
import { auth } from "@/lib/auth/auth";
import { LoomVideo } from "@/types/admin";

type SessionData = {
  user: typeof auth.$Infer.Session.user;
  session: typeof auth.$Infer.Session;
} | null;

async function checkAdmin() {
  const session = await getSession() as SessionData;
  if (!session?.user?.id) {
    return false;
  }
  
  const currentUser = await db
    .select({ isAdmin: user.isAdmin })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  return currentUser[0]?.isAdmin ?? false;
}

export async function getLoomVideos(): Promise<LoomVideo[]> {
  try {
    const videos = await db
      .select()
      .from(loomVideo)
      .orderBy(desc(loomVideo.createdAt));
    return videos;
  } catch (error) {
    console.error("Error fetching Loom videos:", error);
    return [];
  }
}

export async function createLoomVideo(url: string) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return { success: false, error: "Unauthorized" };
    }

    // Fetch video metadata from Loom oEmbed
    const oembedUrl = `https://www.loom.com/v1/oembed?url=${url}`;
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
        console.error("Loom oEmbed error:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("Loom oEmbed response:", errorText);
        return { success: false, error: "Invalid Loom URL or video not found" };
    }

    let data;
    try {
        data = await response.json();
    } catch (e) {
        console.error("Failed to parse oEmbed JSON", e);
        return { success: false, error: "Failed to parse Loom response" };
    }

    await db.insert(loomVideo).values({
      title: data.title || "Loom Video",
      url: url,
      description: data.description || "",
      html: data.html,
      thumbnailUrl: data.thumbnail_url
    });
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/support");
    revalidatePath("/dashboard/instructions");
    return { success: true };
  } catch (error) {
    console.error("Error creating Loom video:", error);
    return { success: false, error: "Failed to create Loom video" };
  }
}

export async function deleteLoomVideo(id: string) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return { success: false, error: "Unauthorized" };
    }

    await db.delete(loomVideo).where(eq(loomVideo.id, id));
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/support");
    revalidatePath("/dashboard/instructions");
    return { success: true };
  } catch (error) {
    console.error("Error deleting Loom video:", error);
    return { success: false, error: "Failed to delete Loom video" };
  }
}
