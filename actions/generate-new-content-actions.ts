'use server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { GEMINI_MODEL_NAME, OPENAI_MODEL_NAME } from '@/lib/aiag/constants';


export async function generateNewContent(
   data:any
): Promise<any> {
    try {
        let model;

        if (data.modelAlias === 'recomended') {
            model = openai(OPENAI_MODEL_NAME);
        } else {
            model = google(GEMINI_MODEL_NAME);
        }

        const result = await generateText({
            model,
            temperature: 0.7,
            system: data.systemPrompt ?? undefined,
            prompt: data.userPrompt,
        });

        if (result.text) {
            return {
                generatedText: result.text,
                errorReason: null,
            };
        } else {
            return {
                generatedText: null,
                errorReason: `No text response received from model: ${data.modelAlias}`,
            };
        }
    } catch (error) {
        console.error('LLM Generation failed:', error);
        return {
            generatedText: null,
            errorReason: `LLM API call failed: ${error instanceof Error ? error.message : String(error)
                }`,
        };
    }
}



export async function generateSessionTitle(
    data: any
): Promise<any> {
    try {
        let model;

        if (data.modelAlias === 'recomended') {
            model = openai(OPENAI_MODEL_NAME);
        } else {
            model = google(GEMINI_MODEL_NAME);
        }

        const result = await generateText({
            model,
            temperature: 0.7,
            system: "You are help full Analyzer and analyse the content and based on the content give 3-4 words Title , Do not add Precontext and Post Context , Just Output with the 3-4 Words Title",
            prompt: data.userPrompt,
        });

        if (result.text) {
            return {
                generatedText: result.text,
                errorReason: null,
            };
        } else {
            return {
                generatedText: null,
                errorReason: `No text response received from model: ${data.modelAlias}`,
            };
        }
    } catch (error) {
        console.error('LLM Generation failed:', error);
        return {
            generatedText: null,
            errorReason: `LLM API call failed: ${error instanceof Error ? error.message : String(error)
                }`,
        };
    }
}
