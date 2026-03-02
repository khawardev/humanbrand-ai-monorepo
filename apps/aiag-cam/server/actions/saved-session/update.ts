"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/server/db"
import { eq } from "drizzle-orm"
import { getNewGenerationPrompts, getRevisionPrompts, getHyperRelevancePrompts } from "@/lib/aiag/prompts"
import { generateNewContent } from "@/server/actions/generateNewContentActions"
import { cleanAndFlattenBulletsGoogle } from "@/lib/cleanMarkdown"
import { knowledgeBaseContent } from "@/lib/aiag/KnowledgeBase/Knowledge_Base"
import { savedSession } from "@/server/db/schema/savedSessionSchema"
import { lookupFormData, buildPromptData } from "@/lib/aiag/formDataHelpers"
import { generateImagePromptService } from "@/lib/aiag/services/content-generation"


export async function updateSessionContent(sessionId: string, data: any) {
    try {
        const { feedback, ...formData } = data
        const lookup = lookupFormData({
            modelId: Number(formData.modelId),
            audienceIds: formData.audienceIds,
            subjectId: Number(formData.subjectId),
            contentTypeIds: formData.contentTypeIds,
            ctaIds: formData.ctaIds,
            socialPlatformId: formData.socialPlatformId ? Number(formData.socialPlatformId) : undefined,
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
            // Note: getRevisionPrompts returns { systemPrompt, userPrompt } based on its signature in prompts file
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
            modelAlias: lookup.selectedModelObj?.label as any,
            temperature: formData.temperature,
            systemPrompt,
            userPrompt,
        })
        const cleanedMarkdown = cleanAndFlattenBulletsGoogle(generatedResult.generatedText || "")

        const imagePrompt = await generateImagePromptService(
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
        const cleanedMarkdown = cleanAndFlattenBulletsGoogle(result.generatedText || "")

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
