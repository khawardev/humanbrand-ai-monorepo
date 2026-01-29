import { supabaseClient } from "@/lib/supabase/supabase-admin";

export async function uploadImageToSupabase(file: File): Promise<string> {
  const filePath = `${Date.now()}-${file.name}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await supabaseClient.storage
    .from("aiag-images")
    .upload(filePath, buffer, {
      contentType: file.type,
    });

  if (error) {
    console.error("Supabase Upload Error:", error);
    throw new Error("Image upload failed.");
  }

  const { data: publicUrlData } = supabaseClient.storage
    .from("aiag-images")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}