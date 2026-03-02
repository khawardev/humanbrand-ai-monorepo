'use server';

import OpenAI from 'openai';
import { IMAGE_MODEL_TO_USE } from '@/lib/aiag/constants';
import { uploadBase64ToSupabase } from '@/lib/supabase/uploadBase64ToSupabase';
import { sanitizePrompt } from '@/lib/aiag/utils/sanitization';

// Ideally, OpenAI client should be initialized once in a shared location if used across multiple files.
// But LLMService uses 'ai' SDK which manages its own instances. Here we use direct OpenAI client.
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export interface ImageGenerationResult {
    success: boolean;
    imageUrl?: string;
    error?: string;
}

export async function generateImageAction(formData: FormData): Promise<ImageGenerationResult> {
    const prompt = formData.get('prompt') as string;
    const imageUrl = formData.get('imageUrl') as string | null;

    if (!prompt) return { success: false, error: 'Prompt is required.' };

    const sanitizedPrompt = sanitizePrompt(prompt);

    try {
        let response: OpenAI.Images.ImagesResponse;

        if (imageUrl) {
            // Fetch the image from URL to convert to appropriate format for OpenAI edit endpoint
            const imageRes = await fetch(imageUrl);
            if (!imageRes.ok) throw new Error("Failed to fetch source image for editing");
            
            const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
            
            // OpenAI requires dall-e-2 for edits/inpainting as dall-e-3 doesn't support it yet
            response = await openai.images.edit({
                model: 'dall-e-2',
                image: imageBuffer as any,
                prompt: sanitizedPrompt,
                n: 1,
                size: '1024x1024',
                response_format: 'b64_json'
            });
        } else {
            response = await openai.images.generate({
                model: IMAGE_MODEL_TO_USE, // default is dall-e-3 now in constants
                prompt: sanitizedPrompt,
                n: 1,
                size: '1024x1024',
                response_format: 'b64_json',
                quality: 'standard'
            });
        }

        const base64Image = response?.data?.[0]?.b64_json;
        if (!base64Image) {
            throw new Error('Image generation failed to return base64 data.');
        }

        const uploadedImageUrl = await uploadBase64ToSupabase(base64Image);
        return { success: true, imageUrl: uploadedImageUrl };

    } catch (error: any) {
        console.error('Image generation failed:', error);

        // Check for specific OpenAI error codes regarding safety
        if (error?.code === 'content_policy_violation' || error?.message?.toLowerCase().includes('moderation')) {
             return {
                success: false,
                error: 'Your request was blocked due to safety filters. Please try a different description.',
            };
        }

        return {
            success: false,
            error: `Image generation failed: ${error.message || 'Unknown error'}`,
        };
    }
}
