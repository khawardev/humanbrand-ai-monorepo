import { createClient } from '@supabase/supabase-js';

export async function uploadImageToSupabase(file: File): Promise<string> {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! 
    );

    const filePath = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
        .from("aiag-images")
        .upload(filePath, file);

    if (error) {
        console.error("Supabase Upload Error:", error.message);
        throw new Error("Image upload failed.");
    }

    const { data: publicUrlData } = supabase.storage
        .from("aiag-images")
        .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
}
