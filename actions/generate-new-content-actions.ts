'use server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';

import { GEMINI_MODEL, OPENAI_MODEL, OPENAI_MODEL_5 } from '@/lib/aiag/constants';

function getModel(modelAlias: string) {
    if (modelAlias === 'recomended') return openai(OPENAI_MODEL);
    if (modelAlias === 'openai') return openai(OPENAI_MODEL_5);
    if (modelAlias === 'deepthink') return google(GEMINI_MODEL);
}

async function runGenerateText(model: any, system: string | undefined, prompt: string, skipTemperature: boolean) {
    const options: any = {
        model,
        system,
        prompt,
    };

    if (!skipTemperature) {
        options.temperature = 0.7;
    }

    return generateText(options);
}

const bedrock = createAmazonBedrock({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
});

export async function generateNewContent(data: any): Promise<any> {
    try {
        if (data.modelAlias === 'claude') {
            
            const { text } = await generateText({
                model: bedrock("us.anthropic.claude-opus-4-1-20250805-v1:0"),
                messages: [
                    { role: 'system', content: data.systemPrompt },
                    { role: 'user', content: data.userPrompt },
                ],
            });

            return {
                generatedText: text ?? null,
                errorReason: text ? null : `No text response received from model: ${data.modelAlias}`,
            };
        }

        const model = getModel(data.modelAlias);
        const skipTemperature = data.modelAlias === 'openai';

        const result = await runGenerateText(
            model,
            data.systemPrompt ?? undefined,
            data.userPrompt,
            skipTemperature
        );

        return {
            generatedText: result.text ?? null,
            errorReason: result.text ? null : `No text response received from model: ${data.modelAlias}`,
        };
    } catch (error) {
        console.error('LLM Generation failed:', error);
        return {
            generatedText: null,
            errorReason: `LLM API call failed: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
}

export async function generateSessionTitle(data: any): Promise<any> {
    try {
        if (data.modelAlias === 'claude') {
            const mergedPrompt = `System Instructions:
                                  --------------------
                                  You are help full Analyzer and analyse the content and based on the content give 3-4 words Title , Do not add Precontext and Post Context , Just Output with the 3-4 Words Title
                                          
                                  User Request:
                                  -------------
                                  ${data.userPrompt}
                                  `;
            const { text } = await generateText({
                model: bedrock("us.anthropic.claude-opus-4-1-20250805-v1:0"),
                prompt: mergedPrompt,
            });
            return {
                generatedText: text ?? null,
                errorReason: text ? null : `No text response received from model: ${data.modelAlias}`,
            };
        }


        const model = getModel(data.modelAlias);
        const skipTemperature = data.modelAlias === 'openai';

        const result = await runGenerateText(
            model,
            "You are help full Analyzer and analyse the content and based on the content give 3-4 words Title , Do not add Precontext and Post Context , Just Output with the 3-4 Words Title",
            data.userPrompt,
            skipTemperature
        );

        return {
            generatedText: result.text ?? null,
            errorReason: result.text ? null : `No text response received from model: ${data.modelAlias}`,
        };
    } catch (error) {
        console.error('LLM Generation failed:', error);
        return {
            generatedText: null,
            errorReason: `LLM API call failed: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
}