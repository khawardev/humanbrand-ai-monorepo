'use client'

import { useState, useEffect } from "react"
import { modelTabs, contentTypes, subjects, audiences, ctas, socialPlatforms } from "@/config/form-data"
import { getNewGenerationPrompts, getImageGenerationPrompt, getRevisionPrompts, getHyperRelevancePrompts } from "@/lib/aiag/prompts"
import { knowledgeBaseContent } from "@/lib/aiag/knowledge_base"
import { generateNewContent, generateSessionTitle } from "@/actions/generate-new-content"
import { cleanAndFlattenBulletsGoogle } from "@/lib/cleanMarkdown"
import { adjustToneAndCreativityData } from "@/config/form-data"
import { getUser } from "@/actions/user"
import { createSession } from "@/actions/session-actions"
import { toast } from "sonner"

export function useNewContentGenerator() {
    const [selectedModel, setSelectedModel] = useState<number>(modelTabs[0].id)
    const [selectedAudiences, setSelectedAudiences] = useState<number[]>([])
    const [selectedSubjects, setSelectedSubjects] = useState<number | null>(null)
    const [selectedContentTypes, setSelectedContentTypes] = useState<number[]>([])
    const [selectedCtas, setSelectedCtas] = useState<number[]>([])
    const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<number | null>(null)
    const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([])
    const [referenceMaterial, setReferenceMaterial] = useState<string>()
    const [additionalInstructions, setAdditionalInstructions] = useState("")
    const [contextualAwareness, setContextualAwareness] = useState("")
    const [toneValue, setToneValue] = useState<number>(adjustToneAndCreativityData.tone.defaultValue)
    const [creativityValue, setCreativityValue] = useState<number>(adjustToneAndCreativityData.creativity.defaultValue)

    const [generatingContent, setGeneratingContent] = useState(false)
    const [contentGenerated, setContentGenerated] = useState<string>("")
    const [imagePrompt, setImagePrompt] = useState('')
    const [feedback, setFeedback] = useState('');

    const [generatingPersona, setgeneratingPersona] = useState(false)
    const [personaGeneratedContent, setPersonaGeneratedContent] = useState<string>("")
    const [personasText, setpersonasText] = useState("")
    const [uploadedPersonaFileData, setuploadedPersonaFileData] = useState(false)

    const socialPostContentTypeId = contentTypes.find((type) => type.label === "Social Media Post")?.id
    const isSocialPostSelected = socialPostContentTypeId !== undefined && selectedContentTypes.includes(socialPostContentTypeId)

    useEffect(() => {
        if (!isSocialPostSelected) {
            setSelectedSocialPlatform(null)
        }
    }, [isSocialPostSelected, selectedContentTypes])

    const isGenerateDisabled =
        selectedAudiences.length === 0 ||
        selectedSubjects === null ||
        selectedContentTypes.length === 0 ||
        selectedCtas.length === 0 ||
        (isSocialPostSelected && selectedSocialPlatform === null);

    const selectedModelObj = modelTabs.find((tab) => tab.id === selectedModel)

    const handleGenerate = async () => {
        if (isGenerateDisabled) return;
        setGeneratingContent(true)
        const user: any = await getUser()
        if (!user) toast.warning('Please Login first')
        
        
        setContentGenerated("")
        setImagePrompt("")
        setPersonaGeneratedContent("")


        const selectedAudienceLabels = audiences.filter((a) => selectedAudiences.includes(a.id)).map((a) => a.label)
        const selectedSubjectObj = subjects.find((s) => s.id === selectedSubjects)
        const selectedContentTypeLabels = contentTypes.filter((c) => selectedContentTypes.includes(c.id)).map((c) => c.label)
        const selectedCtaLabels = ctas.filter((c) => selectedCtas.includes(c.id)).map((c) => c.label)
        const selectedSocialPlatformObj = socialPlatforms.find((p) => p.id === selectedSocialPlatform)

        const promptData = {
            selectedAudiences: selectedAudienceLabels,
            selectedSubject: selectedSubjectObj?.label || "",
            selectedContentTypes: selectedContentTypeLabels,
            selectedCtas: selectedCtaLabels,
            selectedSocialPlatform: selectedSocialPlatformObj?.label || "",
            userUploadedContent: referenceMaterial || '',
            additionalInstructions: additionalInstructions || '',
            contextualAwareness: contextualAwareness || '',
            knowledgeBaseContent: knowledgeBaseContent,
            selectedtone: toneValue as number,
        }


        // Content Genration
        const { systemPrompt, userPrompt } = getNewGenerationPrompts(promptData)
        const generateData = { modelAlias: selectedModelObj?.label, temperature: creativityValue, systemPrompt, userPrompt }
        const generatedResult = await generateNewContent(generateData)
        const cleanedMarkdown = cleanAndFlattenBulletsGoogle(generatedResult.generatedText)


        // Session Title Genration
        const generateSessionData = { modelAlias: selectedModelObj?.label, temperature: creativityValue, userPrompt: generatedResult.generatedText }
        const generatedSessionTitle = await generateSessionTitle(generateSessionData)


        // Image Genration
        const imagePromptData = { selectedAudiences: selectedAudienceLabels, selectedSubject: selectedSubjectObj?.label || "", contentGenerated: cleanedMarkdown }
        const { finalImagePrompt } = getImageGenerationPrompt(imagePromptData)
        const imagePromptGenerated = await generateNewContent({ modelAlias: selectedModelObj?.label, temperature: creativityValue, userPrompt: finalImagePrompt })

        // Save Session
        const session_data = {
            sessionType: "new",
            userId: user?.id,

            sessionTitle: generatedSessionTitle.generatedText,
            selectedModel: selectedModelObj?.label,
            selectedAudiences: selectedAudienceLabels,
            selectedSubjects: selectedSubjectObj?.label || null,
            selectedContentTypes: selectedContentTypeLabels,
            selectedCtas: selectedCtaLabels,
            selectedSocialPlatform: selectedSocialPlatformObj?.label || null,
            referenceMaterial: referenceMaterial || '',
            additionalInstructions: additionalInstructions || '',
            contextualAwareness: contextualAwareness || '',
            selectedtone: toneValue,
            temperature: creativityValue,

            generatedContent: cleanedMarkdown,
            imagePrompt: imagePromptGenerated.generatedText,
        }

        await createSession(session_data)

        setContentGenerated(cleanedMarkdown)
        setImagePrompt(imagePromptGenerated.generatedText)
        setGeneratingContent(false)
    }

    const handleRevise = async () => {
        if (isGenerateDisabled) return;

        setGeneratingContent(true)
        setContentGenerated("")
        setPersonaGeneratedContent("")
        setImagePrompt("")

        const selectedAudienceLabels = audiences.filter((a) => selectedAudiences.includes(a.id)).map((a) => a.label)
        const selectedSubjectObj = subjects.find((s) => s.id === selectedSubjects)
        const selectedContentTypeLabels = contentTypes.filter((c) => selectedContentTypes.includes(c.id)).map((c) => c.label)
        const selectedCtaLabels = ctas.filter((c) => selectedCtas.includes(c.id)).map((c) => c.label)
        const selectedSocialPlatformObj = socialPlatforms.find((p) => p.id === selectedSocialPlatform)

        const revisepromptData = {
            selectedAudiences: selectedAudienceLabels,
            selectedSubject: selectedSubjectObj?.label || "",
            selectedContentTypes: selectedContentTypeLabels,
            selectedCtas: selectedCtaLabels,
            selectedSocialPlatform: selectedSocialPlatformObj?.label || "",
            additionalInstructions: additionalInstructions || '',
            knowledgeBaseContent: knowledgeBaseContent,
            revisionInstructions: feedback,
            originalContent: contentGenerated,
        }

        const { systemPrompt, userPrompt } = getRevisionPrompts(revisepromptData)
        const generateRevisedData = { modelAlias: selectedModelObj?.label, temperature: creativityValue, systemPrompt, userPrompt }
        const generatedRevisedResult = await generateNewContent(generateRevisedData)
        const cleanedMarkdown = cleanAndFlattenBulletsGoogle(generatedRevisedResult.generatedText)
        setContentGenerated(cleanedMarkdown)

        const imagePromptData = { selectedAudiences: selectedAudienceLabels, selectedSubject: selectedSubjectObj?.label || "", contentGenerated: cleanedMarkdown }
        const { finalImagePrompt } = getImageGenerationPrompt(imagePromptData)
        const imagePromptGenerated = await generateNewContent({ modelAlias: selectedModelObj?.label, temperature: creativityValue, userPrompt: finalImagePrompt })
        setImagePrompt(imagePromptGenerated.generatedText)





        // const data = {
        //     sessionType: "EXISTING",
        //     userId: user.id,

        //     selectedModel: selectedModelObj?.id,
        //     selectedAudiences: selectedAudiences, 
        //     selectedSubjects: selectedSubjects || null,
        //     selectedContentTypes: selectedContentTypes, 
        //     selectedCtas: selectedCtas, 
        //     selectedSocialPlatform: selectedSocialPlatform || null,
        //     referenceMaterial: referenceMaterial || '',
        //     additionalInstructions: additionalInstructions || '',
        //     contextualAwareness: contextualAwareness || '',
        //     toneValue: toneValue,
        //     creativityValue: Number(creativityValue.toFixed(1)),

        //     generatedContent: cleanedMarkdown,
        //     imagePrompt: imagePromptGenerated.generatedText,
        //     feedback: feedback || '',
        //     personaGeneratedContent: '', 
        //     personasText: '',

        //     updatedAt: new Date(),
        // }














        setFeedback('');
        setGeneratingContent(false)
    }

    const handleAdaptPersona = async () => {
        if (isGenerateDisabled) return;
        setgeneratingPersona(true)

        const personapromptData = { originalContent: contentGenerated, personasText: personasText, uploadedFilesData: uploadedPersonaFileData, knowledgeBaseContent: knowledgeBaseContent }
        const { systemPrompt, userPrompt } = getHyperRelevancePrompts(personapromptData)
        const generatePersonaData = { modelAlias: selectedModelObj?.label, temperature: creativityValue, systemPrompt, userPrompt }
        const generatedPersonaResult = await generateNewContent(generatePersonaData)
        const cleanedMarkdown = cleanAndFlattenBulletsGoogle(generatedPersonaResult.generatedText)
        setPersonaGeneratedContent(cleanedMarkdown)






        // const data = {
        //     sessionType: "EXISTING",
        //     userId: user.id,

        //     selectedModel: selectedModelObj?.id,
        //     selectedAudiences: selectedAudiences, 
        //     selectedSubjects: selectedSubjects || null,
        //     selectedContentTypes: selectedContentTypes, 
        //     selectedCtas: selectedCtas, 
        //     selectedSocialPlatform: selectedSocialPlatform || null,
        //     referenceMaterial: referenceMaterial || '',
        //     additionalInstructions: additionalInstructions || '',
        //     contextualAwareness: contextualAwareness || '',
        //     toneValue: toneValue,
        //     creativityValue: Number(creativityValue.toFixed(1)),

        //     generatedContent: contentGenerated,
        //     imagePrompt: imagePrompt || '', 
        //     feedback: feedback || '',
        //     personaGeneratedContent: cleanedMarkdown, 
        //     personasText: personasText || '',

        //     updatedAt: new Date(),
        // }














        setgeneratingPersona(false)
    }

    return {
        selectedModel, setSelectedModel,
        selectedAudiences, setSelectedAudiences,
        selectedSubjects, setSelectedSubjects,
        selectedContentTypes, setSelectedContentTypes,
        selectedCtas, setSelectedCtas,
        isSocialPostSelected,
        selectedSocialPlatform, setSelectedSocialPlatform,
        uploadedPdfs, setUploadedPdfs,
        setReferenceMaterial,
        additionalInstructions, setAdditionalInstructions,
        contextualAwareness, setContextualAwareness,
        toneValue, setToneValue,
        creativityValue, setCreativityValue,
        generatingContent,
        contentGenerated,
        imagePrompt,
        feedback, setFeedback,
        generatingPersona,
        personaGeneratedContent,
        personasText, setpersonasText,
        setuploadedPersonaFileData,
        handleAdaptPersona,
        isGenerateDisabled,
        selectedModelObj,
        handleGenerate,
        handleRevise
    }
}