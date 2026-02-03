"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/server/db"
import { eq, desc } from "drizzle-orm"
import { getNewGenerationPrompts, getImageGenerationPrompt, getRevisionPrompts, getHyperRelevancePrompts, getExistingContentPrompts, getCampaignContentPrompts, getKnowledgeBaseSystemPrompt, getRewriteSystemPrompt } from "@/lib/aiag/prompts"
import { generateNewContent, generateSessionTitle } from "@/server/actions/generateNewContentActions"
import { cleanAndFlattenBulletsGoogle } from "@/lib/cleanMarkdown"
import { knowledgeBaseContent } from "@/lib/aiag/knowledgeBase"
import { adjustToneAndCreativityData } from "@/config/formData"
import { savedSession } from "@/server/db/schema/savedSessionSchema"
import { knowledgeBaseChat } from "@/server/db/schema/knowledgeBaseChatSchema"
import { lookupFormData, buildPromptData } from "@/lib/aiag/formDataHelpers"
import { getSession } from "@/server/actions/getSession"

async function generateContentWithTitle(
    modelLabel: string | undefined,
    temperature: number,
    systemPrompt: string,
    userPrompt: string
) {
    const generateData = { modelAlias: modelLabel, temperature, systemPrompt, userPrompt }
    const generatedResult = await generateNewContent(generateData)
    const cleanedMarkdown = cleanAndFlattenBulletsGoogle(generatedResult.generatedText)
    const titleResult = await generateSessionTitle({ modelAlias: modelLabel, temperature, userPrompt: cleanedMarkdown })
    return { cleanedMarkdown, title: titleResult.generatedText }
}

async function generateImagePrompt(
    modelLabel: string | undefined,
    temperature: number,
    contentGenerated: string,
    selectedAudiences?: string[],
    selectedSubject?: string
) {
    const imagePromptData = getImageGenerationPrompt({
        selectedAudiences,
        selectedSubject,
        contentGenerated,
    })
    const imagePromptResult = await generateNewContent({
        modelAlias: modelLabel,
        temperature,
        userPrompt: imagePromptData.finalImagePrompt,
    })
    return imagePromptResult.generatedText
}

export async function createSession(data: any) {
    try {
        const lookup = lookupFormData({
            modelId: data.modelId,
            audienceIds: data.audienceIds,
            subjectId: data.subjectId,
            contentTypeIds: data.contentTypeIds,
            ctaIds: data.ctaIds,
            socialPlatformId: data.socialPlatformId,
        })

        const promptData = {
            ...buildPromptData(lookup, {
                referenceFilesData: data.referenceFilesData,
                additionalInstructions: data.additionalInstructions,
                contextualAwareness: data.contextualAwareness,
                tone: data.tone,
            }),
            knowledgeBaseContent,
        }

        const { systemPrompt, userPrompt } = getNewGenerationPrompts(promptData)
        const { cleanedMarkdown, title } = await generateContentWithTitle(
            lookup.selectedModelObj?.label,
            data.temperature,
            systemPrompt,
            userPrompt
        )

        const imagePrompt = await generateImagePrompt(
            lookup.selectedModelObj?.label,
            data.temperature,
            cleanedMarkdown,
            lookup.selectedAudienceLabels,
            lookup.selectedSubjectObj?.label
        )

        const sessionPayload = {
            userId: data.userId,
            sessionType: "New",
            title,
            modelId: data.modelId,
            audienceIds: data.audienceIds,
            subjectId: data.subjectId,
            contentTypeIds: data.contentTypeIds,
            ctaIds: data.ctaIds,
            socialPlatformId: data.socialPlatformId,
            referenceFileInfos: data.referenceFileInfos,
            referenceFilesData: data.referenceFilesData,
            additionalInstructions: data.additionalInstructions,
            contextualAwareness: data.contextualAwareness,
            tone: data.tone,
            temperature: data.temperature,
            generatedContent: cleanedMarkdown,
            imagePrompt,
        }

        const newSession = await db.insert(savedSession).values(sessionPayload).returning({ id: savedSession.id })
        const sessionId = newSession[0].id
        if (!sessionId) throw new Error("Failed to create session.")

        revalidatePath(`/dashboard/session/${sessionId}`)
        revalidatePath("/dashboard", "layout")
        return { sessionId }
    } catch (error) {
        console.error("Error creating session:", error)
        return { error: "Could not create session." }
    }
}

export async function createExistingContentSession(data: any) {
    try {
        const lookup = lookupFormData({ modelId: data.modelId })

        const promptData = {
            userUploadedContent: data.referenceFilesData || data.referencePdfData || '',
            additionalInstructions: data.additionalInstructions || '',
            contextualAwareness: data.contextualAwareness || '',
            knowledgeBaseContent,
            selectedtone: data.tone,
        }

        const { systemPrompt, userPrompt } = getExistingContentPrompts(promptData)
        const { cleanedMarkdown, title } = await generateContentWithTitle(
            lookup.selectedModelObj?.label,
            data.temperature,
            systemPrompt,
            userPrompt
        )

        const imagePrompt = await generateImagePrompt(
            lookup.selectedModelObj?.label,
            data.temperature,
            cleanedMarkdown
        )

        const sessionPayload = {
            userId: data.userId,
            sessionType: "Existing",
            title,
            modelId: data.modelId,
            referenceFileInfos: data.referenceFileInfos,
            referenceFilesData: data.referenceFilesData || data.referencePdfData,
            additionalInstructions: data.additionalInstructions,
            contextualAwareness: data.contextualAwareness,
            tone: data.tone,
            temperature: data.temperature,
            generatedContent: cleanedMarkdown,
            imagePrompt,
        }

        const newSession = await db.insert(savedSession).values(sessionPayload).returning({ id: savedSession.id })
        const sessionId = newSession[0].id
        if (!sessionId) throw new Error("Failed to create existing content session.")

        revalidatePath(`/dashboard/session/${sessionId}`)
        revalidatePath("/dashboard", "layout")
        return { sessionId }
    } catch (error) {
        console.error("Error creating existing content session:", error)
        return { error: "Could not create session from existing content." }
    }
}

export async function createCampaignContentSession(data: any) {
    try {
        const { systemPrompt, userPrompt } = getCampaignContentPrompts({
            selectedCampaign: data.selectedCampaignLabel,
            additionalInstructions: data.additionalInstructions,
            referenceFilesData: data.referenceFilesData,
        })
        
        const { cleanedMarkdown, title } = await generateContentWithTitle(
            data.modelAlias,
            data.temperature,
            systemPrompt,
            userPrompt
        )

        const sessionPayload = {
            userId: data.userId,
            sessionType: "Campaign",
            title,
            modelId: data.modelId,
            campaignTypeId: data.campaignTypeId,
            referenceFileInfos: data.referenceFileInfos,
            referenceFilesData: data.referenceFilesData,
            additionalInstructions: data.additionalInstructions,
            generatedContent: cleanedMarkdown,
            temperature: data.temperature,
        }

        const newSession = await db.insert(savedSession).values(sessionPayload).returning({ id: savedSession.id })
        const sessionId = newSession[0].id
         if (!sessionId) throw new Error("Failed to create campaign content session.")

        revalidatePath(`/dashboard/session/${sessionId}`)
        revalidatePath("/dashboard", "layout")

        return { sessionId, generatedContent: cleanedMarkdown }
    } catch (error) {
        console.error("Error creating campaign content session:", error)
        return { error: "Could not create session from campaign content." }
    }
}

export async function getSessionById(sessionId: string) {
    try {
        const result = await db.select().from(savedSession).where(eq(savedSession.id, sessionId))
        return result[0]
    } catch (error) {
        console.error("Error fetching session:", error)
        return null
    }
}

export async function updateSessionContent(sessionId: string, data: any) {
    try {
        const { feedback, ...formData } = data
        const lookup = lookupFormData({
            modelId: formData.modelId,
            audienceIds: formData.audienceIds,
            subjectId: formData.subjectId,
            contentTypeIds: formData.contentTypeIds,
            ctaIds: formData.ctaIds,
            socialPlatformId: formData.socialPlatformId,
        })

        let systemPrompt, userPrompt

        if (feedback) {
            const promptData = {
                selectedAudiences: lookup.selectedAudienceLabels,
                selectedSubject: lookup.selectedSubjectObj?.label || "",
                selectedContentTypes: lookup.selectedContentTypeLabels,
                selectedCtas: lookup.selectedCtaLabels,
                selectedSocialPlatform: lookup.selectedSocialPlatformObj?.label || "",
                additionalInstructions: formData.additionalInstructions || '',
                knowledgeBaseContent,
                revisionInstructions: feedback,
                originalContent: formData.originalContent,
            };
            ({ systemPrompt, userPrompt } = getRevisionPrompts(promptData))
        } else {
            const promptData = {
                ...buildPromptData(lookup, {
                    referenceFilesData: formData.referenceFilesData,
                    additionalInstructions: formData.additionalInstructions,
                    contextualAwareness: formData.contextualAwareness,
                    tone: formData.tone,
                }),
                knowledgeBaseContent,
            };
            ({ systemPrompt, userPrompt } = getNewGenerationPrompts(promptData))
        }

        const generatedResult = await generateNewContent({
            modelAlias: lookup.selectedModelObj?.label,
            temperature: formData.temperature,
            systemPrompt,
            userPrompt,
        })
        const cleanedMarkdown = cleanAndFlattenBulletsGoogle(generatedResult.generatedText)

        const imagePrompt = await generateImagePrompt(
            lookup.selectedModelObj?.label,
            formData.temperature,
            cleanedMarkdown,
            lookup.selectedAudienceLabels,
            lookup.selectedSubjectObj?.label
        )

        await db.update(savedSession).set({
            ...formData,
            referenceFileInfos: formData.referenceFileInfos,
            referenceFilesData: formData.referenceFilesData,
            generatedContent: cleanedMarkdown,
            imagePrompt,
        }).where(eq(savedSession.id, sessionId))

        revalidatePath(`/dashboard/session/${sessionId}`)
        return { success: true }
    } catch (error) {
        console.error("Error updating session content:", error)
        return { error: "Could not update session content." }
    }
}

export async function adaptPersonaForSession(sessionId: string, data: any) {
    try {
        const { originalContent, personasText, uploadedPersonaFileData, modelAlias, temperature } = data
        const promptData = {
            originalContent,
            personasText,
            uploadedFilesData: uploadedPersonaFileData,
            knowledgeBaseContent
        }
        const { systemPrompt, userPrompt } = getHyperRelevancePrompts(promptData)
        const result = await generateNewContent({ modelAlias, temperature, systemPrompt, userPrompt })
        const cleanedMarkdown = cleanAndFlattenBulletsGoogle(result.generatedText)

        await db.update(savedSession).set({ personaContent: cleanedMarkdown }).where(eq(savedSession.id, sessionId))
        revalidatePath(`/dashboard/session/${sessionId}`)
        return { success: true }
    } catch (error) {
        console.error("Error adapting persona:", error)
        return { error: "Could not adapt persona." }
    }
}

export async function manageImageForSession(sessionId: string, data: any) {
    try {
        await db.update(savedSession).set({
            reference_image: data.reference_image,
            imagePrompt: data.imagePrompt,
            imageUrls: data.imageUrls,
            imageReferenceFileInfo: data.imageReferenceFileInfo
        }).where(eq(savedSession.id, sessionId))

        revalidatePath(`/dashboard/session/${sessionId}`)
        return { success: true }
    } catch (error) {
        console.error("Error managing image:", error)
        return { error: "Could not manage image." }
    }
}

export async function deleteSession(sessionId: string) {
    try {
        await db.delete(savedSession).where(eq(savedSession.id, sessionId))
        revalidatePath("/dashboard")
        revalidatePath("/dashboard", "layout")
        return { success: true }
    } catch (error) {
        console.error("Error deleting session:", error)
        return { error: "Could not delete session." }
    }
}

export async function getSavedSessions() {
    try {
        const session: any = await getSession();
         if (!session?.user?.id) return []

        // Attempt migration of legacy chat if it exists
        await migrateLegacyChatIfNeeded(session.user.id);


        const sessions = await db.query.savedSession.findMany({
            where: eq(savedSession.userId, session.user.id),
            orderBy: [desc(savedSession.updatedAt)],
        })
        return sessions
    } catch (error) {
        console.error("Error fetching sessions:", error)
        return []
    }
}

export async function updateChatForSession(sessionId: string, data: any) {
    try {
        await db.update(savedSession).set({
            chatHistory: data.chatHistory,
            chatFileInfos: data.chatFileInfos,
            chatFilesData: data.chatFilesData,
        }).where(eq(savedSession.id, sessionId))

        revalidatePath(`/dashboard/session/${sessionId}`)
        return { success: true }
    } catch (error) {
        console.error("Error updating chat:", error)
        return { error: "Could not update chat." }
    }
}
export async function saveUserMessage(
    sessionId: string | null,
    userId: string,
    userInput: string,
    existingHistory: any[]
) {
    try {
        const newHistory = [...existingHistory, { role: 'user', content: userInput }];
        
        let finalSessionId = sessionId;

        if (!sessionId) {
             const newSession = await db.insert(savedSession).values({
                 userId,
                 sessionType: 'ai_chat',
                 title: 'New AI Chat',
                 chatHistory: newHistory,
                 updatedAt: new Date()
             }).returning({ id: savedSession.id });
             
             finalSessionId = newSession[0].id;
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
    currentHistory: any[]
) {
    try {
        // Construct conversation history for prompt
        const conversationHistory = currentHistory
            .map(msg => `${msg.role}: ${msg.content}`)
            .join('\n');

        // Call LLM
        const result = await generateNewContent({
            type: 'ai_chat',
            modelAlias: 'recomended',
            temperature: 0.7,
            conversationHistory,
            userPrompt: currentHistory[currentHistory.length - 1].content || "Continue", // Use last user message
        });

        if (!result.generatedText) {
            throw new Error(result.errorReason || "Failed to generate a response.");
        }

        const assistantMessage = { role: 'assistant', content: result.generatedText };
        const finalHistory = [...currentHistory, assistantMessage];

        // Update DB with AI response
        await db.update(savedSession).set({
            chatHistory: finalHistory,
            updatedAt: new Date()
        }).where(eq(savedSession.id, sessionId));

        // Generate title if it's the first exchange (e.g. length is 2: User + AI)
        if (finalHistory.length <= 2) {
             generateSessionTitle({ modelAlias: 'recomended', temperature: 0.7, userPrompt: currentHistory[0].content })
                .then(async (titleRes) => {
                    const title = titleRes.generatedText || "AI Chat";
                    await db.update(savedSession).set({ title }).where(eq(savedSession.id, sessionId));
                    revalidatePath("/dashboard", "layout");
                }).catch(err => console.error("Error generating title:", err));
        }


        
        return { success: true, newHistory: finalHistory };

    } catch (error) {
        console.error("Error generating chat response:", error);
        return { error: "Could not generate response." };
    }
}


async function migrateLegacyChatIfNeeded(userId: string) {
    try {
        const legacyChat = await db.query.knowledgeBaseChat.findFirst({
            where: eq(knowledgeBaseChat.userId, userId),
        });

        if (legacyChat && legacyChat.chatHistory && (legacyChat.chatHistory as any[]).length > 0) {
            // Migrate to savedSession
            await db.insert(savedSession).values({
                userId,
                sessionType: 'ai_chat',
                title: 'Legacy Chat Archive',
                chatHistory: legacyChat.chatHistory,
                updatedAt: legacyChat.updatedAt || new Date(),
                createdAt: legacyChat.createdAt || new Date(),
            });

            // Delete legacy chat
            await db.delete(knowledgeBaseChat).where(eq(knowledgeBaseChat.userId, userId));
            
            return true;
        }
    } catch (error) {
        console.error("Error migrating legacy chat:", error);
    }
    return false;
}

export async function rewriteSessionAssistantMessage(
    sessionId: string,
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

        const session = await getSessionById(sessionId);
        if (!session) throw new Error("Session not found");

        const currentHistory: any = session.chatHistory || [];
        
        // Ensure index is valid
        if (messageIndex < 0 || messageIndex >= currentHistory.length) {
            throw new Error("Invalid message index");
        }

        const updatedHistory = [...currentHistory];
        updatedHistory[messageIndex] = { ...updatedHistory[messageIndex], content: newFullContent };

        // Optionally, one could append the rewrite instruction as a user message, but here we just update in place as requested 
        // "rewrite the content in assistant message"
        
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
    newContent: string
) {
    try {
        const session = await getSessionById(sessionId);
        if (!session) throw new Error("Session not found");

        const currentHistory: any = session.chatHistory || [];

        // Truncate history up to the edited message
        // Keep messages 0 to messageIndex (exclusive), then add edited message
        const truncatedHistory = currentHistory.slice(0, messageIndex);
        const newHistory = [...truncatedHistory, { role: 'user', content: newContent }];

        // Update DB with truncated history
        await db.update(savedSession).set({
            chatHistory: newHistory,
            updatedAt: new Date()
        }).where(eq(savedSession.id, sessionId));

        revalidatePath(`/dashboard/ai-chat/${sessionId}`);

        // Trigger regeneration logic similar to generateChatResponse
        // We can just return success here and let the client trigger generation, 
        // OR call generateChatResponse internally.
        // Calling generateChatResponse is better for single-action flow, 
        // but generateChatResponse expects history to be in DB. We just put it there.
        
        // However, generateChatResponse generates response based on LAST message.
        // So passing the sessionId is enough.

        // We return the new history so client can update state immediately
        return { success: true, history: newHistory };

    } catch (error) {
         console.error("Error editing user message:", error);
         return { error: "Could not edit message." };
    }
}

export async function deleteSessionMessage(
    sessionId: string,
    messageIndex: number
) {
    try {
         const session = await getSessionById(sessionId);
         if (!session) throw new Error("Session not found");
 
         const currentHistory: any = session.chatHistory || [];
        
         // If deleting a user message, we likely want to delete the following assistant message too
         // If deleting an assistant message, just delete that? 
         // Typically in chat interfaces:
         // - Delete User Msg -> Delete that msg AND the subsequent assistant response.
         // - Delete Assistant Msg -> Just delete that msg (or maybe not allowed usually).
         
         // Assuming user wants to delete their query and the response.
         
         const targetMessage = currentHistory[messageIndex];
         let newHistory = [...currentHistory];

         if (targetMessage.role === 'user') {
             // Check if next is assistant
             if (messageIndex + 1 < newHistory.length && newHistory[messageIndex + 1].role === 'assistant') {
                 newHistory.splice(messageIndex, 2); // Remove user msg and next assistant msg
             } else {
                 newHistory.splice(messageIndex, 1); // Just remove user msg
             }
         } else {
             // Deleting assistant message
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
    feedback: 'up' | 'down' | null
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
