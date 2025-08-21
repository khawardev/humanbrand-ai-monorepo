"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { eq } from "drizzle-orm"
import { generateNewContent } from "@/actions/generate-new-content-actions"
import { knowledgeBaseContent } from "@/lib/aiag/knowledge_base"
import { AIAG_CORE_VOICE, AIAG_CRITICAL_CONSTRAINTS } from "@/lib/aiag/constants"
import { knowledgeBaseChat } from './../db/schema/knowledge-base-chat-schema';

function getKnowledgeBaseSystemPrompt(conversationHistory: string): string {
    return `**Act as a helpful AIAG Knowledge Base Assistant.** Your ONLY task is to answer user questions based *exclusively* on the provided 'AIAG Knowledge Base' content. Do not use any external knowledge.
    
    Context for this Chat Turn:
    * Previous Conversation History: ${conversationHistory || "None Provided"}
    
    AIAG Communication Standards (Mandatory):
    1.  **Strictly Adhere to Knowledge Base:** Base ALL answers on the 'AIAG Knowledge Base' provided below.
    2.  **Politely Decline if Unsure:** If the user's question cannot be answered from the knowledge base, you MUST politely state that the information is not available in the provided materials. DO NOT attempt to guess or use outside information. Example: "I can't find information on that topic in the AIAG Knowledge Base. Can I help with something else?"
    3.  **Maintain AIAG Voice:** ${AIAG_CORE_VOICE}.
    4.  **Apply Tone:** Be 'Professional yet Approachable' and 'Empowering and Supportive'.
    5.  **Uphold Constraints:** ${AIAG_CRITICAL_CONSTRAINTS}.
    
    ---
    Full AIAG Knowledge Base (Primary and Only Reference):
    ${knowledgeBaseContent}
    ---
    
    Respond directly to the last user message in the conversation history, adhering to all rules.`;
}
export async function getKnowledgeBaseChat(userId: string) {
    try {
        const chat = await db.query.knowledgeBaseChat.findFirst({
            where: eq(knowledgeBaseChat.userId, userId),
        });
        return chat;
    } catch (error) {
        console.error("Error fetching knowledge base chat:", error);
        return null;
    }
}

export async function upsertKnowledgeBaseChat(userId: string, userInput: string, existingHistory: any[]) {
    try {
        const conversationHistory = [...existingHistory, { role: 'user', content: userInput }]
            .map(msg => `${msg.role}: ${msg.content}`)
            .join('\n');

        const systemPrompt = getKnowledgeBaseSystemPrompt(conversationHistory);

        const result = await generateNewContent({
            modelAlias: 'recomended',
            temperature: 0.7,
            systemPrompt,
            userPrompt: userInput,
        });

        if (!result.generatedText) {
            throw new Error(result.errorReason || "Failed to generate a response from the model.");
        }

        const assistantMessage = { role: 'assistant', content: result.generatedText };
        const finalHistory = [...existingHistory, { role: 'user', content: userInput }, assistantMessage];

        await db.insert(knowledgeBaseChat)
            .values({ userId, chatHistory: finalHistory })
            .onConflictDoUpdate({
                target: knowledgeBaseChat.userId,
                set: { chatHistory: finalHistory, updatedAt: new Date() }
            });

        revalidatePath("/knowledge-base-chat");

        return { success: true, newHistory: finalHistory };
    } catch (error) {
        console.error("Error updating knowledge base chat:", error);
        return { error: "Could not process your request." };
    }
}