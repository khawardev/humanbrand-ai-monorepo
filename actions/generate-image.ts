// actions/generate-image.ts

'use server';

import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateImageAction(
    formData: FormData
): Promise<{ success: boolean; imageUrl?: string; error?: string }> {
    const prompt = formData.get('prompt') as string;
    const imageFile = formData.get('image') as File | null;

    if (!prompt) {
        return { success: false, error: 'Prompt is required.' };
    }

    try {
        if (imageFile) {
            // Case 1: Generate a variation of an uploaded image
            const response:any = await openai.images.createVariation({
                image: imageFile,
                n: 1,
                size: '1024x1024',
                model: 'dall-e-2',
            });

            const imageUrl = response && response?.data[0]?.url;
            if (!imageUrl) {
                throw new Error('Image variation generation failed to return a URL.');
            }
            return { success: true, imageUrl };
        } else {
            // Case 2: Generate a new image from a text prompt
            const response: any = await openai.images.generate({
                model: "dall-e-3",
                prompt: prompt,
                size: '1024x1024',
                quality: 'standard',
                n: 1,
            });

            const imageUrl = response?.data[0]?.url;
            if (!imageUrl) {
                throw new Error('Image generation failed to return a URL.');
            }
            return { success: true, imageUrl };
        }
    } catch (error) {
        console.error('Image generation failed:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            success: false,
            error: `API call failed: ${errorMessage}`,
        };
    }
}