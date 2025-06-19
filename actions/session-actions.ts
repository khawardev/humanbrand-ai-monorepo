// "use server"

// import { revalidatePath } from "next/cache"
// import { redirect } from "next/navigation"
// import { and, eq } from "drizzle-orm"

// import { db } from "@/db"
// import { savedSession } from "@/db/schema/session-schema"

// export async function createSession(data: any) {
//     try {
//         const newSession = await db
//             .insert(savedSession)
//             .values(data)
//             .returning()

//         const sessionId = newSession[0].id
//         if (!sessionId) {
//             throw new Error("Failed to create session.")
//         }
//         revalidatePath(`/session/${sessionId}`)
//         return { sessionId }
        
//     } catch (error) {
//         console.error("Error creating session:", error)
//         return { error: "Could not create session." }
//     }
// }

// export async function updateSession(
//     sessionId: string,
//     data: any,
// ) {
//     try {
//         await db
//             .update(savedSession)
//             .set(data)
//             .where(eq(savedSession.id, sessionId))

//         revalidatePath(`/session/${sessionId}`)
//         return { success: true }
//     } catch (error) {
//         console.error("Error updating session:", error)
//         return { error: "Could not update session." }
//     }
// }

// export async function getSessionById(sessionId: string) {
//     try {
//         const result = await db.select().from(savedSession).where(eq(savedSession.id, sessionId))
//         return result[0]
//     } catch (error) {
//         console.error("Error fetching session:", error)
//         return null
//     }
// }











"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { eq } from "drizzle-orm"
import { getNewGenerationPrompts, getImageGenerationPrompt, getRevisionPrompts, getHyperRelevancePrompts, getChatSystemPrompt } from "@/lib/aiag/prompts"
import { generateNewContent, generateSessionTitle } from "@/actions/generate-new-content"
import { cleanAndFlattenBulletsGoogle } from "@/lib/cleanMarkdown"
import { knowledgeBaseContent } from "@/lib/aiag/knowledge_base"
import { modelTabs, audiences, subjects, contentTypes, ctas, socialPlatforms } from "@/config/form-data"
import { savedSession } from "@/db/schema/session-schema"

export async function createSession(data: any) {
    try {
        const selectedModelObj = modelTabs.find((tab) => tab.id === data.modelId)

        const selectedAudienceLabels = audiences.filter((a) => data.audienceIds.includes(a.id)).map((a) => a.label)
        const selectedSubjectObj = subjects.find((s) => s.id === data.subjectId)
        const selectedContentTypeLabels = contentTypes.filter((c) => data.contentTypeIds.includes(c.id)).map((c) => c.label)
        const selectedCtaLabels = ctas.filter((c) => data.ctaIds.includes(c.id)).map((c) => c.label)
        const selectedSocialPlatformObj = socialPlatforms.find((p) => p.id === data.socialPlatformId)

        const promptData = {
            selectedAudiences: selectedAudienceLabels,
            selectedSubject: selectedSubjectObj?.label || "",
            selectedContentTypes: selectedContentTypeLabels,
            selectedCtas: selectedCtaLabels,
            selectedSocialPlatform: selectedSocialPlatformObj?.label || "",
            userUploadedContent: data.referencePdfInfo?.parsedText || '',
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

        const sessionPayload = {
            ...data,
            title: titleResult.generatedText,
            generatedContent: cleanedMarkdown,
            imagePrompt: imagePromptResult.generatedText,
        }

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
                userUploadedContent: formData.referencePdfInfo?.parsedText || '',
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
            generatedContent: cleanedMarkdown,
            imagePrompt: imagePromptResult.generatedText,
            personaContent: null,
            imageUrls: null,
            imageReferenceFileInfo: null,
            chatHistory: null,
            chatPdfInfo: null,
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
            chatPdfInfo: data.chatPdfInfo
        }).where(eq(savedSession.id, sessionId));

        revalidatePath(`/session/${sessionId}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating chat:", error);
        return { error: "Could not update chat." };
    }
}