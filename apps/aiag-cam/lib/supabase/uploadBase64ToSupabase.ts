
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function uploadBase64ToSupabase(base64Data: string, bucketName: string = "aiag-images"): Promise<string> {
    const buffer = Buffer.from(base64Data, 'base64');
    const filePath = `${Date.now()}-generated-image.png`;

    const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, buffer, {
            contentType: 'image/png'
        });

    if (error) {
        console.error("Upload failed:", error.message);
        throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
}
