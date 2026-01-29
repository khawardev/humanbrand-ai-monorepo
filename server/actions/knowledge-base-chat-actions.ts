"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/server/db"
import { eq } from "drizzle-orm"
import { generateNewContent } from "@/server/actions/generate-new-content-actions"
import { knowledgeBaseChat } from '../db/schema/knowledge-base-chat-schema';
import { getKnowledgeBaseSystemPrompt, getRewriteSystemPrompt } from "@/lib/aiag/prompts"

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

        revalidatePath("/");

        return { success: true, newHistory: finalHistory };
    } catch (error) {
        console.error("Error updating knowledge base chat:", error);
        return { error: "Could not process your request." };
    }
}

export async function rewriteAssistantMessage(
    userId: string,
    messageIndex: number,
    originalContent: string,
    selectedText: string,
    rewritePrompt: string
) {
    try {
        const systemPrompt = getRewriteSystemPrompt();
        const userPrompt = `ORIGINAL CONTENT:\n"""\n${originalContent}\n"""\n\nSELECTED TEXT TO REWRITE:\n"""\n${selectedText}\n"""\n\nINSTRUCTIONS:\n"""\n${rewritePrompt}\n"""`;

        const result = await generateNewContent({
            modelAlias: 'recomended',
            temperature: 0.5,
            systemPrompt,
            userPrompt,
        });

        if (!result.generatedText) {
            throw new Error(result.errorReason || "Failed to generate rewritten content.");
        }

        const rewrittenSnippet = result.generatedText;
        const newFullContent = originalContent.replace(selectedText, rewrittenSnippet);

        const chat = await getKnowledgeBaseChat(userId);
        const currentHistory: any = chat?.chatHistory || [];

        const userRewriteMessage = { role: 'user', content: rewritePrompt };
        const newAssistantMessage = { role: 'assistant', content: newFullContent };

        const finalHistory = [...currentHistory, userRewriteMessage, newAssistantMessage];

        await db.insert(knowledgeBaseChat)
            .values({ userId, chatHistory: finalHistory })
            .onConflictDoUpdate({
                target: knowledgeBaseChat.userId,
                set: { chatHistory: finalHistory, updatedAt: new Date() }
            });

        revalidatePath("/");

        return { success: true, newHistory: finalHistory };
    } catch (error) {
        console.error("Error rewriting message:", error);
        return { error: "Could not rewrite your message." };
    }
}