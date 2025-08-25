import { supabaseAdmin } from '@/lib/supabase-admin';

export async function uploadImageToSupabase(file: File): Promise<string> {
    const filePath = `${Date.now()}-${file.name}`;

    const { data, error } = await supabaseAdmin.storage
        .from('aiag-images')
        .upload(filePath, file);

    if (error) {
        console.error('Supabase Upload Error:', error);
        throw new Error('Image upload failed.');
    }

    const { data: publicUrlData } = supabaseAdmin.storage
        .from('aiag-images')
        .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
}