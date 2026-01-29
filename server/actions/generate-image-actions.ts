'use server';

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

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

interface ImageGenerationResult {
    success: boolean;
    imageUrl?: string;
    error?: string;
}

async function uploadToSupabase(base64Data: string): Promise<string> {
    const buffer = Buffer.from(base64Data, 'base64');
    const filePath = `${Date.now()}-generated-image.png`;

    const { data, error } = await supabase.storage
        .from("aiag-images")
        .upload(filePath, buffer, {
            contentType: 'image/png'
        });

    if (error) {
        console.error("Upload failed:", error.message);
        throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
        .from("aiag-images")
        .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
}

function sanitizePrompt(prompt: string): string {
    return prompt
        .replace(/\b(nude|naked|nsfw|explicit|sexual|porn|adult)\b/gi, '')
        .replace(/\b(violence|weapon|gun|knife|blood|death)\b/gi, '')
        .replace(/\b(hate|racist|offensive|inappropriate)\b/gi, '')
        .trim();
}

export async function generateImageAction(formData: FormData): Promise<ImageGenerationResult> {
    const prompt = formData.get('prompt') as string;
    const imageUrl = formData.get('imageUrl') as string | null;

    if (!prompt) return { success: false, error: 'Prompt is required.' };

    const sanitizedPrompt = sanitizePrompt(prompt);

    try {
        let response: any;

        if (imageUrl) {
            const imageRes = await fetch(imageUrl);
            const imageBlob = await imageRes.blob();
            const file = new File([imageBlob], "image.png", { type: "image/png" });

            response = await openai.images.edit({
                model: "gpt-image-1",
                image: file,
                prompt: sanitizedPrompt,
                n: 1,
                size: '1024x1024',
                quality: 'high'
            });
        } else {
            response = await openai.images.generate({
                model: "gpt-image-1",
                prompt: sanitizedPrompt,
                n: 1,
                size: '1024x1024',
                quality: 'high'
            });
        }

        const base64Image = response.data[0]?.b64_json;
        if (!base64Image) {
            throw new Error('Image generation failed to return base64 data.');
        }

        const uploadedImageUrl = await uploadToSupabase(base64Image);
        return { success: true, imageUrl: uploadedImageUrl };

    } catch (error: any) {
        console.error('GPT-Image-1 generation failed:', error);

        if (error?.code === 'moderation_blocked' || error?.status === 400) {
            return {
                success: false,
                error: 'Your request was blocked. Please try a safer description.',
            };
        }

        return {
            success: false,
            error: `Image generation failed: ${error.message || error.toString()}`,
        };
    }
}
