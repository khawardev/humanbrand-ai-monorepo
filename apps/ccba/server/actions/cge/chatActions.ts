"use server";

import { brandRequest } from "@/server/api/brandRequest";
import { getCurrentUser } from "@/server/actions/authActions";


export async function chat(payload: any) {
  try {
    const user = await getCurrentUser();

    const { success, data, error } = await brandRequest( `/cam/chat/`, "POST",
      { client_id: user.client_id, ...payload }
    );

    if (!success) return { success: false, message: error };

    return { success: true, message: "Message sent successfully", data };
  } catch {
    return { success: false, message: "Failed to send message" };
  }
}
