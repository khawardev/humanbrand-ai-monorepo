"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { eq } from "drizzle-orm"
import { getNewGenerationPrompts, getImageGenerationPrompt, getRevisionPrompts, getHyperRelevancePrompts, getExistingContentPrompts } from "@/lib/aiag/prompts"
import { generateNewContent, generateSessionTitle } from "@/actions/generate-new-content-actions"
import { cleanAndFlattenBulletsGoogle } from "@/lib/cleanMarkdown"
import { knowledgeBaseContent } from "@/lib/aiag/knowledge_base"
import { modelTabs, audiences, subjects, contentTypes, ctas, socialPlatforms } from "@/config/form-data"
import { savedSession } from "@/db/schema/saved-session-schema"


export async function createSession(data: any) {
    try {
        const selectedModelObj = modelTabs.find((tab) => tab.id === data.modelId)

        const selectedAudienceLabels = audiences.filter((a) => data.audienceIds.includes(a.id)).map((a) => a.label)
        const selectedSubjectObj = subjects.find((s) => s.id === data.subjectId)
        const selectedContentTypeLabels = contentTypes.filter((c) => data.contentTypeIds.includes(c.id)).map((c) => c.label)
        const selectedCtaLabels = ctas.filter((c) => data.ctaIds.includes(c.id)).map((c) => c.label)
        const selectedSocialPlatformObj = socialPlatforms.find((p) => p.id === data.socialPlatformId)

        ////////////////// changes explain comment start ////////////
        // 1. UPDATED: The key `userUploadedContent` now correctly reads from `data.referenceFilesData`.
        // Your frontend hook now sends the parsed text under the key `referenceFilesData`. This makes the data flow consistent.
        ////////////////// changes explain comment end ////////////
        const promptData = {
            selectedAudiences: selectedAudienceLabels,
            selectedSubject: selectedSubjectObj?.label || "",
            selectedContentTypes: selectedContentTypeLabels,
            selectedCtas: selectedCtaLabels,
            selectedSocialPlatform: selectedSocialPlatformObj?.label || "",
            userUploadedContent: data.referenceFilesData || '',
            additionalInstructions: data.additionalInstructions || '',
            contextualAwareness: data.contextualAwareness || '',
            knowledgeBaseContent: knowledgeBaseContent,
            selectedtone: data.tone,
        }

        const { systemPrompt, userPrompt } = getNewGenerationPrompts(promptData)
        const generateData = { modelAlias: selectedModelObj?.label, temperature: data.temperature, systemPrompt, userPrompt }

        const generatedResult = await generateNewContent(generateData)
        const cleanedMarkdown = cleanAndFlattenBulletsGoogle(generatedResult.generatedText)

        const titleResult = await generateSessionTitle({ modelAlias: selectedModelObj?.label, temperature: data.temperature, userPrompt: cleanedMarkdown })

        const imagePromptResult = await generateNewContent({ modelAlias: selectedModelObj?.label, temperature: data.temperature, userPrompt: getImageGenerationPrompt({ selectedAudiences: selectedAudienceLabels, selectedSubject: selectedSubjectObj?.label || "", contentGenerated: cleanedMarkdown }).finalImagePrompt })

        ////////////////// changes explain comment start ////////////
        // 2. UPDATED: The payload for the database insert is now explicitly constructed.
        // Instead of spreading `...data`, we now map the keys from your hook (`referenceFileInfos`, `referenceFilesData`)
        // to the correct database column names. This ensures the file information is saved correctly.
        ////////////////// changes explain comment end ////////////
        const sessionPayload = {
            userId: data.userId,
            sessionType: data.sessionType,
            title: titleResult.generatedText,
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
            imagePrompt: imagePromptResult.generatedText,
        };

        const newSession = await db.insert(savedSession).values(sessionPayload).returning({ id: savedSession.id })

        const sessionId = newSession[0].id
        if (!sessionId) throw new Error("Failed to create session.")

        revalidatePath(`/session/${sessionId}`)
        return { sessionId }
    } catch (error) {
        console.error("Error creating session:", error)
        return { error: "Could not create session." }
    }
}


export async function createExistingContentSession(data: any) {
    try {
        const selectedModelObj = modelTabs.find((tab) => tab.id === data.modelId);

        ////////////////// changes explain comment start ////////////
        // 3. UPDATED: Correctly reads from `data.referenceFilesData` as sent by the hook.
        ////////////////// changes explain comment end ////////////
        const promptData = {
            userUploadedContent: data.referenceFilesData || '',
            additionalInstructions: data.additionalInstructions || '',
            contextualAwareness: data.contextualAwareness || '',
            knowledgeBaseContent: knowledgeBaseContent,
            selectedtone: data.tone,
        };

        const { systemPrompt, userPrompt } = getExistingContentPrompts(promptData);
        const generateData = { modelAlias: selectedModelObj?.label, temperature: data.temperature, systemPrompt, userPrompt };

        const generatedResult = await generateNewContent(generateData);
        const cleanedMarkdown = cleanAndFlattenBulletsGoogle(generatedResult.generatedText);

        const titleResult = await generateSessionTitle({ modelAlias: selectedModelObj?.label, temperature: data.temperature, userPrompt: cleanedMarkdown });
        const imagePromptResult = await generateNewContent({ modelAlias: selectedModelObj?.label, temperature: data.temperature, userPrompt: getImageGenerationPrompt({ contentGenerated: cleanedMarkdown }).finalImagePrompt });

        ////////////////// changes explain comment start ////////////
        // 4. UPDATED: Explicitly constructs the database payload to match the new schema.
        ////////////////// changes explain comment end ////////////
        const sessionPayload = {
            userId: data.userId,
            sessionType: data.sessionType,
            title: titleResult.generatedText,
            modelId: data.modelId,
            referenceFileInfos: data.referenceFileInfos,
            referenceFilesData: data.referenceFilesData,
            additionalInstructions: data.additionalInstructions,
            contextualAwareness: data.contextualAwareness,
            tone: data.tone,
            temperature: data.temperature,
            generatedContent: cleanedMarkdown,
            imagePrompt: imagePromptResult.generatedText,
        };

        const newSession = await db.insert(savedSession).values(sessionPayload).returning({ id: savedSession.id });

        const sessionId = newSession[0].id;
        if (!sessionId) throw new Error("Failed to create existing content session.");

        revalidatePath(`/session/${sessionId}`);
        return { sessionId };

    } catch (error) {
        console.error("Error creating existing content session:", error);
        return { error: "Could not create session from existing content." };
    }
}


export async function getSessionById(sessionId: string) {
    try {
        const result = await db.select().from(savedSession).where(eq(savedSession.id, sessionId))
        // This function is correct. It will return the object with the new field names from the database,
        // which the `useSessionContentGenerator` hook is now expecting.
        return result[0]
    } catch (error) {
        console.error("Error fetching session:", error)
        return null
    }
}

export async function updateSessionContent(sessionId: string, data: any) {
    try {
        const { feedback, ...formData } = data;
        const selectedModelObj = modelTabs.find((tab) => tab.id === formData.modelId);

        const selectedAudienceLabels = audiences.filter((a: any) => formData.audienceIds.includes(a.id)).map((a: any) => a.label);
        const selectedSubjectObj = subjects.find((s: any) => s.id === formData.subjectId);
        const selectedContentTypeLabels = contentTypes.filter((c: any) => formData.contentTypeIds.includes(c.id)).map((c: any) => c.label);
        const selectedCtaLabels = ctas.filter((c: any) => formData.ctaIds.includes(c.id)).map((c: any) => c.label);
        const selectedSocialPlatformObj = socialPlatforms.find((p: any) => p.id === formData.socialPlatformId);

        let systemPrompt, userPrompt;

        if (feedback) {
            const promptData = {
                selectedAudiences: selectedAudienceLabels,
                selectedSubject: selectedSubjectObj?.label || "",
                selectedContentTypes: selectedContentTypeLabels,
                selectedCtas: selectedCtaLabels,
                selectedSocialPlatform: selectedSocialPlatformObj?.label || "",
                additionalInstructions: formData.additionalInstructions || '',
                knowledgeBaseContent: knowledgeBaseContent,
                revisionInstructions: feedback,
                originalContent: formData.originalContent,
            };
            ({ systemPrompt, userPrompt } = getRevisionPrompts(promptData));
            
        } else {
            const promptData = {
                selectedAudiences: selectedAudienceLabels,
                selectedSubject: selectedSubjectObj?.label || "",
                selectedContentTypes: selectedContentTypeLabels,
                selectedCtas: selectedCtaLabels,
                selectedSocialPlatform: selectedSocialPlatformObj?.label || "",
                userUploadedContent: formData.referenceFilesData || '',
                additionalInstructions: formData.additionalInstructions || '',
                contextualAwareness: formData.contextualAwareness || '',
                knowledgeBaseContent: knowledgeBaseContent,
                selectedtone: formData.tone,
            };
            ({ systemPrompt, userPrompt } = getNewGenerationPrompts(promptData));
        }

        const generatedResult = await generateNewContent({ modelAlias: selectedModelObj?.label, temperature: formData.temperature, systemPrompt, userPrompt });
        const cleanedMarkdown = cleanAndFlattenBulletsGoogle(generatedResult.generatedText);

        const imagePromptResult = await generateNewContent({ modelAlias: selectedModelObj?.label, temperature: formData.temperature, userPrompt: getImageGenerationPrompt({ selectedAudiences: selectedAudienceLabels, selectedSubject: selectedSubjectObj?.label || "", contentGenerated: cleanedMarkdown }).finalImagePrompt });
        await db.update(savedSession).set({
            ...formData, 
            referenceFileInfos: formData.referenceFileInfos,
            referenceFilesData: formData.referenceFilesData,
            generatedContent: cleanedMarkdown,
            imagePrompt: imagePromptResult.generatedText,
        }).where(eq(savedSession.id, sessionId));

        revalidatePath(`/session/${sessionId}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating session content:", error);
        return { error: "Could not update session content." };
    }
}

export async function adaptPersonaForSession(sessionId: string, data: any) {
    try {
        const { originalContent, personasText, uploadedPersonaFileData, modelAlias, temperature } = data;
        const promptData = {
            originalContent,
            personasText,
            uploadedFilesData: uploadedPersonaFileData,
            knowledgeBaseContent
        };
        const { systemPrompt, userPrompt } = getHyperRelevancePrompts(promptData);
        const result = await generateNewContent({ modelAlias, temperature, systemPrompt, userPrompt });
        const cleanedMarkdown = cleanAndFlattenBulletsGoogle(result.generatedText);

        await db.update(savedSession).set({ personaContent: cleanedMarkdown }).where(eq(savedSession.id, sessionId));
        revalidatePath(`/session/${sessionId}`);
        return { success: true };
    } catch (error) {
        console.error("Error adapting persona:", error);
        return { error: "Could not adapt persona." };
    }
}

export async function manageImageForSession(sessionId: string, data: any) {
    try {
        await db.update(savedSession).set({
            reference_image: data.reference_image,
            imagePrompt: data.imagePrompt,
            imageUrls: data.imageUrls,
            imageReferenceFileInfo: data.imageReferenceFileInfo
        }).where(eq(savedSession.id, sessionId));

        revalidatePath(`/session/${sessionId}`);
        return { success: true };
    } catch (error) {
        console.error("Error managing image:", error);
        return { error: "Could not manage image." };
    }
}

export async function updateChatForSession(sessionId: string, data: any) {
    try {
        await db.update(savedSession).set({
            chatHistory: data.chatHistory,
            chatFileInfos: data.chatFileInfos,
            chatFilesData: data.chatFilesData,
        }).where(eq(savedSession.id, sessionId));

        revalidatePath(`/session/${sessionId}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating chat:", error);
        return { error: "Could not update chat." };
    }
}