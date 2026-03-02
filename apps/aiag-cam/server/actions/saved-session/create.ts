"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/server/db"
import { getNewGenerationPrompts, getExistingContentPrompts, getCampaignContentPrompts } from "@/lib/aiag/prompts"
import { savedSession } from "@/server/db/schema/savedSessionSchema"
import { lookupFormData, buildPromptData } from "@/lib/aiag/formDataHelpers"
import { generateContentWithTitleService, generateImagePromptService } from "@/lib/aiag/services/content-generation"
import { SessionData, ExistingContentSessionData, CampaignContentSessionData } from "@/types/aiag/session"
import { knowledgeBaseContent } from "@/lib/aiag/KnowledgeBase/Knowledge_Base"

export async function createSession(data: SessionData) {
    try {
        const lookup = lookupFormData({
            modelId: Number(data.modelId),
            audienceIds: data.audienceIds,
            subjectId: Number(data.subjectId),
            contentTypeIds: data.contentTypeIds,
            ctaIds: data.ctaIds,
            socialPlatformId: data.socialPlatformId ? Number(data.socialPlatformId) : undefined,
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
        const { cleanedMarkdown, title } = await generateContentWithTitleService(
            lookup.selectedModelObj?.label,
            data.temperature,
            systemPrompt,
            userPrompt
        )

        const imagePrompt = await generateImagePromptService(
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
            modelId: Number(data.modelId),
            audienceIds: data.audienceIds,
            subjectId: Number(data.subjectId),
            contentTypeIds: data.contentTypeIds,
            ctaIds: data.ctaIds,
            socialPlatformId: data.socialPlatformId ? Number(data.socialPlatformId) : null,
            referenceFileInfos: data.referenceFileInfos,
            referenceFilesData: data.referenceFilesData,
            additionalInstructions: data.additionalInstructions,
            contextualAwareness: data.contextualAwareness,
            tone: data.tone,
            temperature: data.temperature.toString(),
            generatedContent: cleanedMarkdown,
            imagePrompt,
        }

        const newSession = await db.insert(savedSession).values(sessionPayload).returning({ id: savedSession.id })
        const sessionId = newSession[0]!.id
        if (!sessionId) throw new Error("Failed to create session.")

        revalidatePath(`/dashboard/session/${sessionId}`)
        revalidatePath("/dashboard", "layout")
        return { sessionId }
    } catch (error) {
        console.error("Error creating session:", error)
        return { error: "Could not create session." }
    }
}

export async function createExistingContentSession(data: ExistingContentSessionData) {
    try {
        const lookup = lookupFormData({ modelId: Number(data.modelId) })

        const promptData = {
            userUploadedContent: data.referenceFilesData || data.referencePdfData || '',
            additionalInstructions: data.additionalInstructions || '',
            contextualAwareness: data.contextualAwareness || '',
            knowledgeBaseContent,
            selectedtone: data.tone,
        }

        const { systemPrompt, userPrompt } = getExistingContentPrompts(promptData)
        const { cleanedMarkdown, title } = await generateContentWithTitleService(
            lookup.selectedModelObj?.label,
            data.temperature,
            systemPrompt,
            userPrompt
        )

        const imagePrompt = await generateImagePromptService(
            lookup.selectedModelObj?.label,
            data.temperature,
            cleanedMarkdown
        )

        const sessionPayload = {
            userId: data.userId,
            sessionType: "Existing",
            title,
            modelId: Number(data.modelId),
            referenceFileInfos: data.referenceFileInfos,
            referenceFilesData: data.referenceFilesData || data.referencePdfData,
            additionalInstructions: data.additionalInstructions,
            contextualAwareness: data.contextualAwareness,
            tone: data.tone,
            temperature: data.temperature.toString(),
            generatedContent: cleanedMarkdown,
            imagePrompt,
        }

        const newSession = await db.insert(savedSession).values(sessionPayload).returning({ id: savedSession.id })
        const sessionId = newSession[0]!.id
        if (!sessionId) throw new Error("Failed to create existing content session.")

        revalidatePath(`/dashboard/session/${sessionId}`)
        revalidatePath("/dashboard", "layout")
        return { sessionId }
    } catch (error) {
        console.error("Error creating existing content session:", error)
        return { error: "Could not create session from existing content." }
    }
}

export async function createCampaignContentSession(data: CampaignContentSessionData) {
    try {
        const { systemPrompt, userPrompt } = getCampaignContentPrompts({
            selectedCampaign: data.selectedCampaignLabel,
            additionalInstructions: data.additionalInstructions,
            referenceFilesData: data.referenceFilesData,
            knowledgeBaseContent,
        })

        const { cleanedMarkdown, title } = await generateContentWithTitleService(
            data.modelAlias,
            data.temperature,
            systemPrompt,
            userPrompt
        )

        const imagePrompt = await generateImagePromptService(
            data.modelAlias,
            data.temperature,
            cleanedMarkdown
        )

        const sessionPayload = {
            userId: data.userId,
            sessionType: "Campaign",
            title,
            modelId: Number(data.modelId),
            campaignTypeId: Number(data.campaignTypeId),
            referenceFileInfos: data.referenceFileInfos,
            referenceFilesData: data.referenceFilesData,
            additionalInstructions: data.additionalInstructions,
            generatedContent: cleanedMarkdown,
            temperature: data.temperature.toString(),
            imagePrompt,
        }

        const newSession = await db.insert(savedSession).values(sessionPayload).returning({ id: savedSession.id })
        const sessionId = newSession[0]!.id
        if (!sessionId) throw new Error("Failed to create campaign content session.")

        revalidatePath(`/dashboard/session/${sessionId}`)
        revalidatePath("/dashboard", "layout")

        return { sessionId }
    } catch (error) {
        console.error("Error creating campaign content session:", error)
        return { error: "Could not create session from campaign content." }
    }
}
