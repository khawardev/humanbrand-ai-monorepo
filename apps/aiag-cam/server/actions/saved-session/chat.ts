"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/server/db"
import { eq } from "drizzle-orm"
import { getRewriteSystemPrompt } from "@/lib/aiag/prompts"
import { generateNewContent, generateSessionTitle } from "@/server/actions/generateNewContentActions"
import { savedSession } from "@/server/db/schema/savedSessionSchema"
import { user } from "@/server/db/schema/usersSchema"
import { getSessionById } from "@/server/actions/saved-session/read"
import { getUserModelAlias } from "@/server/actions/usersActions"

export async function saveUserMessage(
    sessionId: string | null,
    userId: string,
    userInput: string,
    existingHistory: any[],
    attachments?: string[],
    fileText?: string,
) {
    try {
        const userMessage: any = { role: 'user', content: userInput };
        if (attachments && attachments.length > 0) {
            userMessage.images = attachments;
        }
        if (fileText) {
            userMessage.fileText = fileText;
        }

        const newHistory = [...existingHistory, userMessage];
        let finalSessionId = sessionId;

        if (!sessionId) {
            const newSession = await db.insert(savedSession).values({
                userId,
                sessionType: 'ai_chat',
                title: 'New AI Chat',
                chatHistory: newHistory,
                updatedAt: new Date()
            }).returning({ id: savedSession.id });

            finalSessionId = newSession[0]!.id;
        } else {
            await db.update(savedSession).set({
                chatHistory: newHistory,
                updatedAt: new Date()
            }).where(eq(savedSession.id, sessionId));
        }

        if (finalSessionId) {
            revalidatePath(`/dashboard/ai-chat/${finalSessionId}`);
            revalidatePath("/dashboard", "layout");
        }

        return { success: true, sessionId: finalSessionId, history: newHistory };
    } catch (error) {
        console.error("Error saving user message:", error);
        return { error: "Could not save message." };
    }
}

export async function generateChatResponse(
    sessionId: string,
    userId: string,
    currentHistory: any[],
    retrievalStrategy: 'knowledgeBase' | 'rag' = 'knowledgeBase',
) {
    try {
        const historyContext = currentHistory.slice(0, -1);
        const lastUserMessage = currentHistory[currentHistory.length - 1];

        const conversationHistory = historyContext
            .map(msg => `${msg.role}: ${msg.content}`)
            .join('\n');

        const modelAlias = await getUserModelAlias(userId);

        let userPrompt = lastUserMessage.content || "";
        const hasFileText = !!lastUserMessage.fileText;

        if (!userPrompt.trim() && hasFileText) {
            userPrompt = "Please analyze the uploaded file and provide a summary of its key content.";
        } else if (!userPrompt.trim()) {
            userPrompt = "Continue";
        }

        const result = await generateNewContent({
            type: 'ai_chat',
            modelAlias: modelAlias as any,
            temperature: 0.7,
            conversationHistory,
            userPrompt,
            retrievalStrategy,
            images: lastUserMessage.images,
            uploadedFileText: lastUserMessage.fileText,
        });

        if (!result.generatedText) {
            throw new Error(result.errorReason || "Failed to generate a response.");
        }

        const assistantMessage = { role: 'assistant', content: result.generatedText };
        const finalHistory = [...currentHistory, assistantMessage];

        await db.update(savedSession).set({
            chatHistory: finalHistory,
            updatedAt: new Date()
        }).where(eq(savedSession.id, sessionId));

        if (finalHistory.length <= 2) {
            const titlePrompt = lastUserMessage.content || (hasFileText ? "Uploaded file analysis" : "AI Chat");
            generateSessionTitle({ modelAlias: modelAlias as any, temperature: 0.7, userPrompt: titlePrompt })
                .then(async (titleRes) => {
                    const title = titleRes.generatedText || "AI Chat";
                    await db.update(savedSession).set({ title }).where(eq(savedSession.id, sessionId));
                    revalidatePath("/dashboard", "layout");
                })
                .catch((err) => console.error("Error generating title:", err));
        }

        return { success: true, newHistory: finalHistory };
    } catch (error) {
        console.error("Error generating chat response:", error);
        return { error: "Could not generate response." };
    }
}

export async function rewriteSessionAssistantMessage(
    sessionId: string,
    messageIndex: number,
    originalContent: string,
    selectedText: string,
    rewritePrompt: string,
) {
    try {
        const systemPrompt = getRewriteSystemPrompt();
        const userPrompt = `ORIGINAL CONTENT:\n"""\n${originalContent}\n"""\n\nSELECTED TEXT TO REWRITE:\n"""\n${selectedText}\n"""\n\nINSTRUCTIONS:\n"""\n${rewritePrompt}\n"""`;

        const session = await getSessionById(sessionId);
        if (!session) throw new Error("Session not found");

        const userId = session.userId;
        const modelAlias = await getUserModelAlias(userId);

        const result = await generateNewContent({
            modelAlias: modelAlias as any,
            temperature: 0.5,
            systemPrompt,
            userPrompt,
        });

        if (!result.generatedText) {
            throw new Error(result.errorReason || "Failed to generate rewritten content.");
        }

        const rewrittenSnippet = result.generatedText;
        const newFullContent = originalContent.replace(selectedText, rewrittenSnippet);

        const currentHistory: any = session.chatHistory || [];

        if (messageIndex < 0 || messageIndex >= currentHistory.length) {
            throw new Error("Invalid message index");
        }

        const updatedHistory = [...currentHistory];
        updatedHistory[messageIndex] = { ...updatedHistory[messageIndex], content: newFullContent };

        await db.update(savedSession).set({
            chatHistory: updatedHistory,
            updatedAt: new Date()
        }).where(eq(savedSession.id, sessionId));

        revalidatePath(`/dashboard/ai-chat/${sessionId}`);

        return { success: true, newHistory: updatedHistory };
    } catch (error) {
        console.error("Error rewriting session message:", error);
        return { error: "Could not rewrite your message." };
    }
}

export async function editUserMessage(
    sessionId: string,
    messageIndex: number,
    newContent: string,
) {
    try {
        const session = await getSessionById(sessionId);
        if (!session) throw new Error("Session not found");

        const currentHistory: any = session.chatHistory || [];
        const truncatedHistory = currentHistory.slice(0, messageIndex);
        const newHistory = [...truncatedHistory, { role: 'user', content: newContent }];

        await db.update(savedSession).set({
            chatHistory: newHistory,
            updatedAt: new Date()
        }).where(eq(savedSession.id, sessionId));

        revalidatePath(`/dashboard/ai-chat/${sessionId}`);

        return { success: true, history: newHistory };
    } catch (error) {
        console.error("Error editing user message:", error);
        return { error: "Could not edit message." };
    }
}

export async function deleteSessionMessage(
    sessionId: string,
    messageIndex: number,
) {
    try {
        const session = await getSessionById(sessionId);
        if (!session) throw new Error("Session not found");

        const currentHistory: any = session.chatHistory || [];
        const targetMessage = currentHistory[messageIndex];
        let newHistory = [...currentHistory];

        if (targetMessage.role === 'user') {
            const hasFollowingAssistant =
                messageIndex + 1 < newHistory.length &&
                newHistory[messageIndex + 1].role === 'assistant';
            newHistory.splice(messageIndex, hasFollowingAssistant ? 2 : 1);
        } else {
            newHistory.splice(messageIndex, 1);
        }

        await db.update(savedSession).set({
            chatHistory: newHistory,
            updatedAt: new Date()
        }).where(eq(savedSession.id, sessionId));

        revalidatePath(`/dashboard/ai-chat/${sessionId}`);

        return { success: true, newHistory };
    } catch (error) {
        console.error("Error deleting message:", error);
        return { error: "Could not delete message." };
    }
}

export async function rateSessionMessage(
    sessionId: string,
    messageIndex: number,
    feedback: 'up' | 'down' | null,
) {
    try {
        const session = await getSessionById(sessionId);
        if (!session) throw new Error("Session not found");

        const currentHistory: any = session.chatHistory || [];

        if (messageIndex < 0 || messageIndex >= currentHistory.length) {
            throw new Error("Invalid message index");
        }

        const updatedHistory = [...currentHistory];
        updatedHistory[messageIndex] = { ...updatedHistory[messageIndex], feedback };

        await db.update(savedSession).set({
            chatHistory: updatedHistory,
            updatedAt: new Date()
        }).where(eq(savedSession.id, sessionId));

        revalidatePath(`/dashboard/ai-chat/${sessionId}`);

        return { success: true, newHistory: updatedHistory };
    } catch (error) {
        console.error("Error rating message:", error);
        return { error: "Could not rate message." };
    }
}
