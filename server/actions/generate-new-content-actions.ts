'use server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

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

export async function generateClaudeContent(prompt: string) {
    const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY!;
    
    try {
        const formData = new FormData();
        formData.append("prompt", prompt);
        formData.append("model_id", "claude-4-1-opus");
        formData.append("temperature", "0.7");
        const res = await fetch(CLAUDE_API_KEY , {
            method: "POST",
            headers: { Accept: "application/json" },
            body: formData,
        });


        if (!res.ok) {
            throw new Error(`Failed with status ${res.status}`);
        }

        const data = await res.json();
        return data.response; 
    } catch (err) {
        console.error("Error generating content:", err);
        throw err;
    }
}

export async function generateNewContent(data: any): Promise<any> {
    try {
        if (data.modelAlias === 'claude') {
            const mergedPrompt = `System Instructions:
                                  --------------------
                                  ${data.systemPrompt}
                                          
                                  User Request:
                                  -------------
                                  ${data.userPrompt}
                                  `;
            const response = await generateClaudeContent(mergedPrompt);
            return {
                generatedText: response ?? null,
                errorReason: response ? null : `No text response received from model: ${data.modelAlias}`,
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
            
            const response = await generateClaudeContent(mergedPrompt);
            return {
                generatedText: response ?? null,
                errorReason: response ? null : `No text response received from model: ${data.modelAlias}`,
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