'use server';

import { generateFormattedText } from "@/lib/aiag/services/llm";

export type ApiKeyStatus = {
    modelAlias: string;
    status: 'valid' | 'invalid';
    message?: string;
    responseData?: string | null;
};

export async function checkApiKeys(): Promise<ApiKeyStatus[]> {
    const modelsToCheck = ['recommended', 'openai', 'gemini', 'claude'];
    const results: ApiKeyStatus[] = [];

    const userPrompt = "Hi. Reply with 'OK'.";

    for (const modelAlias of modelsToCheck) {
        try {
            const { text, error } = await generateFormattedText(
                modelAlias,
                undefined,
                userPrompt,
                0.1
            );

            if (error) {
                results.push({
                    modelAlias,
                    status: 'invalid',
                    message: error,
                    responseData: null
                });
            } else if (!text || text.trim().length === 0) {
                results.push({
                    modelAlias,
                    status: 'invalid',
                    message: "Empty response received.",
                    responseData: text
                });
            } else {
                results.push({
                    modelAlias,
                    status: 'valid',
                    message: "API Key is valid and model is responding.",
                    responseData: text
                });
            }
        } catch (e) {
            results.push({
                modelAlias,
                status: 'invalid',
                message: e instanceof Error ? e.message : "Unknown error occurred.",
                responseData: null
            });
        }
    }

    return results;
}
