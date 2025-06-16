// actions/generate-image.ts

'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface ImageGenerationResult {
    success: boolean;
    imageUrl?: string;
    error?: string;
}

// Helper function to convert base64 to data URL
function base64ToDataUrl(base64: string, format: string = 'png'): string {
    return `data:image/${format};base64,${base64}`;
}

export async function generateImageAction(
    formData: FormData
): Promise<ImageGenerationResult> {
    const prompt = formData.get('prompt') as string;
    const imageFile = formData.get('image') as File | null;

    if (!prompt) {
        return { success: false, error: 'Prompt is required.' };
    }

    try {
        if (imageFile) {
            // Case 1: Edit existing image with prompt using gpt-image-1
            const response:any = await openai.images.edit({
                model: "gpt-image-1",
                image: imageFile,
                prompt: prompt,
                n: 1,
                size: '1024x1024',
                quality: 'high'
            });

            const base64Image = response.data[0]?.b64_json;
            if (!base64Image) {
                throw new Error('Image editing failed to return base64 data.');
            }

            // Convert base64 to data URL since gpt-image-1 returns base64
            const imageUrl = base64ToDataUrl(base64Image, 'png');
            return { success: true, imageUrl };

        } else {
            // Case 2: Generate new image from text prompt using gpt-image-1
            const response: any = await openai.images.generate({
                model: "gpt-image-1",
                prompt: prompt,
                n: 1,
                size: '1024x1024',
                quality: 'high'
            });

            const base64Image = response.data[0]?.b64_json;
            if (!base64Image) {
                throw new Error('Image generation failed to return base64 data.');
            }

            // Convert base64 to data URL since gpt-image-1 returns base64
            const imageUrl = base64ToDataUrl(base64Image, 'png');
            return { success: true, imageUrl };
        }
    } catch (error) {
        console.error('GPT-Image-1 generation failed:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            success: false,
            error: `API call failed: ${errorMessage}`,
        };
    }
}