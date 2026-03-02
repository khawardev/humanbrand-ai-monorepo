'use server';

import { getKnowledgeBaseSystemPrompt } from "@/lib/aiag/prompts/chat";
import { getChatSystemPrompt } from "@/lib/aiag/prompts/chat";
import { getRAGChatSystemPrompt } from "@/lib/aiag/prompts/rag-chat-prompt";
import { knowledgeBaseContent } from "@/lib/aiag/KnowledgeBase/Knowledge_Base";
import { generateFormattedText } from "@/lib/aiag/services/llm";
import { ContentGenerationInput, ContentGenerationResult, SessionTitleInput } from "@/types/aiag/content-generation";

async function prepareSystemPrompt(data: ContentGenerationInput): Promise<string | undefined> {
    if (data.type === 'chat') {
        return getChatSystemPrompt({
            originalContent: data.originalContent,
            conversationHistory: data.conversationHistory,
            uploadedFileText: data.uploadedFileText,
            knowledgeBaseContent
        });
    }

    if (data.type === 'ai_chat') {
        let basePrompt = '';
        if (data.retrievalStrategy === 'rag') {
            const { getRelevantContext } = await import("@/server/actions/ai-chat/rag-chat");
            const ragContext = await getRelevantContext(data.userPrompt);
            basePrompt = getRAGChatSystemPrompt((data.conversationHistory as string) || "", ragContext);
        } else {
            basePrompt = getKnowledgeBaseSystemPrompt((data.conversationHistory as string) || "", knowledgeBaseContent);
        }

        if (data.uploadedFileText) {
            basePrompt += `\n\n--- USER UPLOADED FILE CONTENT ---\nThe user has uploaded a file. Here is its full parsed content. Use this content to answer any related questions:\n\n${data.uploadedFileText}\n--- END OF FILE CONTENT ---`;
        }

        return basePrompt;
    }

    return data.systemPrompt;
}

export async function generateNewContent(data: ContentGenerationInput): Promise<ContentGenerationResult> {
    try {
        const systemPrompt = await prepareSystemPrompt(data);

        const { text, error } = await generateFormattedText(
            data.modelAlias,
            systemPrompt,
            data.userPrompt,
            data.temperature,
            data.images
        );

        return {
            generatedText: text,
            errorReason: error,
        };
    } catch (error) {
        console.error('LLM Generation failed:', error);
        return {
            generatedText: null,
            errorReason: `LLM API call failed: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
}

export async function generateSessionTitle(data: SessionTitleInput): Promise<ContentGenerationResult> {
    try {
        const systemPrompt = "You are help full Analyzer and analyse the content and based on the content give 3-4 words Title , Do not add Precontext and Post Context , Just Output with the 3-4 Words Title";

        const { text, error } = await generateFormattedText(
            data.modelAlias,
            systemPrompt,
            data.userPrompt,
            data.temperature
        );

        return {
            generatedText: text,
            errorReason: error,
        };
    } catch (error) {
        console.error('LLM Generation failed:', error);
        return {
            generatedText: null,
            errorReason: `LLM API call failed: ${error instanceof Error ? error.message : String(error)}`,
        };
    }
}