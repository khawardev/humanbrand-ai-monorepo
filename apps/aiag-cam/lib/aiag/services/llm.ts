import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { GEMINI_MODEL, OPENAI_MODEL, OPENAI_MODEL_5, CLAUDE_MODEL } from '@/lib/aiag/constants';

function resolveModel(modelAlias: string) {
    switch (modelAlias) {
        case 'recommended':
            return { model: openai(OPENAI_MODEL), skipTemperature: true };
        case 'openai':
            return { model: openai(OPENAI_MODEL_5), skipTemperature: true };
        case 'gemini':
            return { model: google(GEMINI_MODEL), skipTemperature: false };
        default:
            throw new Error(`Unknown model alias: ${modelAlias}`);
    }
}

function buildUserContent(userPrompt: string, images?: string[]) {
    if (!images || images.length === 0) {
        return userPrompt;
    }

    const parts: any[] = [
        { type: 'text', text: userPrompt },
        ...images.map(image => ({ type: 'image' as const, image })),
    ];

    return parts;
}

async function generateWithBedrockProxy(
    systemPrompt: string | undefined,
    userPrompt: string,
    temperature: number,
    images?: string[]
): Promise<{ text: string | null; error: string | null }> {
    const proxyUrl = process.env.CLAUDE_API_KEY;

    if (!proxyUrl) {
        return { text: null, error: "CLAUDE_API_KEY environment variable (Bedrock Proxy URL) is not set" };
    }

    let finalPrompt = userPrompt;

    if (images && images.length > 0) {
        try {
            const analysis = await analyzeImagesWithVision(images, userPrompt);
            finalPrompt = `${userPrompt}\n\n[Image Analysis]\n${analysis}`;
        } catch (err) {
            return { text: null, error: "Failed to analyze uploaded images for Claude." };
        }
    }

    const mergedPrompt = systemPrompt
        ? `System Instructions:\n--------------------\n${systemPrompt}\n\nUser Request:\n-------------\n${finalPrompt}`
        : finalPrompt;

    const formData = new FormData();
    formData.append('prompt', mergedPrompt);
    formData.append('model_id', CLAUDE_MODEL);
    formData.append('temperature', String(temperature));
    formData.append('max_tokens', '8000');

    const res = await fetch(proxyUrl, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const errorBody = await res.text().catch(() => '');
        return { text: null, error: `Claude Bedrock proxy failed with status ${res.status}: ${errorBody}` };
    }

    const data = await res.json();
    const text = data.response || null;

    return {
        text,
        error: text ? null : "No text response received from Claude.",
    };
}

async function analyzeImagesWithVision(images: string[], userContext: string): Promise<string> {
    const model = openai(OPENAI_MODEL_5);

    const result = await generateText({
        model,
        messages: [
            {
                role: 'user',
                content: [
                    { type: 'text', text: `Analyze these images in detail. Describe visual content, text, diagrams, or any elements present. Focus on details relevant to: "${userContext}"` },
                    ...images.map(image => ({ type: 'image' as const, image })),
                ],
            },
        ],
    });

    return result.text;
}

async function generateWithSdk(
    modelAlias: string,
    systemPrompt: string | undefined,
    userPrompt: string,
    temperature: number,
    images?: string[]
): Promise<{ text: string | null; error: string | null }> {
    const { model, skipTemperature } = resolveModel(modelAlias);
    const userContent = buildUserContent(userPrompt, images);

    const options: any = {
        model,
        system: systemPrompt,
    };

    if (typeof userContent === 'string') {
        options.prompt = userContent;
    } else {
        options.messages = [
            { role: 'user', content: userContent },
        ];
    }

    if (!skipTemperature) {
        options.temperature = temperature;
    }

    const result = await generateText(options);

    return {
        text: result.text ?? null,
        error: result.text ? null : `No text response received from model: ${modelAlias}`,
    };
}

export async function generateFormattedText(
    modelAlias: string,
    systemPrompt: string | undefined,
    userPrompt: string,
    temperature?: number,
    images?: string[]
): Promise<{ text: string | null; error: string | null }> {
    try {
        const finalTemperature = temperature ?? 0.7;

        if (modelAlias === 'claude') {
            return await generateWithBedrockProxy(systemPrompt, userPrompt, finalTemperature, images);
        }

        return await generateWithSdk(modelAlias, systemPrompt, userPrompt, finalTemperature, images);
    } catch (error) {
        console.error(`LLM Generation failed for model ${modelAlias}:`, error);
        return {
            text: null,
            error: `LLM API call failed: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
}
