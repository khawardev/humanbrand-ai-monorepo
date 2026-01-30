"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/server/db"
import { eq, desc } from "drizzle-orm"
import { getNewGenerationPrompts, getImageGenerationPrompt, getRevisionPrompts, getHyperRelevancePrompts, getExistingContentPrompts, getCampaignContentPrompts } from "@/lib/aiag/prompts"
import { generateNewContent, generateSessionTitle } from "@/server/actions/generateNewContentActions"
import { cleanAndFlattenBulletsGoogle } from "@/lib/cleanMarkdown"
import { knowledgeBaseContent } from "@/lib/aiag/knowledgeBase"
import { adjustToneAndCreativityData } from "@/config/formData"
import { savedSession } from "@/server/db/schema/savedSessionSchema"
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