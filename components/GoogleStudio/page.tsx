'use client'

import React, { useState, useEffect } from "react"
import { Hero } from "@/components/home/hero"
import { Generate } from "@/components/home/generate"
import { Separator } from "@/components/ui/separator"
import { LineSpinner } from "@/shared/spinner"
import { modelTabs, contentTypes, subjects, audiences, ctas, socialPlatforms, adjustToneAndCreativityData } from "@/config/form-data"
import { getNewGenerationPrompts, getImageGenerationPrompt, getRevisionPrompts, getHyperRelevancePrompts } from "@/lib/ai/prompts"
import { knowledgeBaseContent } from "@/lib/ai/knowledge_base"
import { generateNewContent } from "@/actions/generate-new-content"
import { cleanAndFlattenBulletsGoogle } from "@/lib/cleanMarkdown"
import { FormContainer } from "./form-container"
import { GeneratedContent } from "./generated-content"

export default function Home() {
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


    const socialPostContentTypeId = contentTypes.find(
        (type) => type.label === "Social Media Post"
    )?.id

    const isSocialPostSelected =
        socialPostContentTypeId !== undefined &&
        selectedContentTypes.includes(socialPostContentTypeId)

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


    const handleGenerate = async () => {
        if (isGenerateDisabled) return;

        setGeneratingContent(true)
        setContentGenerated("")
        setImagePrompt("")

        const selectedModelObj = modelTabs.find((tab) => tab.id === selectedModel)
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
            selectedtone: toneValue,
        }

        const { systemPrompt, userPrompt } = getNewGenerationPrompts(promptData)

        const generateData = {
            modelAlias: selectedModelObj?.label,
            temperature: creativityValue,
            systemPrompt,
            userPrompt,
        }

        const generatedResult = await generateNewContent(generateData)
        const cleanedMarkdown = cleanAndFlattenBulletsGoogle(generatedResult.generatedText)
        setContentGenerated(cleanedMarkdown)

        const imagePromptData = {
            selectedAudiences: selectedAudienceLabels,
            selectedSubject: selectedSubjectObj?.label || "",
            contentGenerated: cleanedMarkdown,
        }

        const { finalImagePrompt } = getImageGenerationPrompt(imagePromptData)
        const imagePromptGenerated = await generateNewContent({
            modelAlias: selectedModelObj?.label,
            temperature: creativityValue,
            userPrompt: finalImagePrompt,
        })

        setImagePrompt(imagePromptGenerated.generatedText)
        setGeneratingContent(false)
    }
    

    const handleRevise = async () => {
        if (isGenerateDisabled) return;

        setGeneratingContent(true)
        setContentGenerated("")
        setPersonaGeneratedContent("")
        setImagePrompt("")

        const selectedModelObj = modelTabs.find((tab) => tab.id === selectedModel)
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

        const generateRevisedData = {
            modelAlias: selectedModelObj?.label,
            temperature: creativityValue,
            systemPrompt,
            userPrompt,
        }

        const generatedRevisedResult = await generateNewContent(generateRevisedData)
        const cleanedMarkdown = cleanAndFlattenBulletsGoogle(generatedRevisedResult.generatedText)
        setContentGenerated(cleanedMarkdown)

        const imagePromptData = {
            selectedAudiences: selectedAudienceLabels,
            selectedSubject: selectedSubjectObj?.label || "",
            contentGenerated: cleanedMarkdown,
        }

        const { finalImagePrompt } = getImageGenerationPrompt(imagePromptData)
        const imagePromptGenerated = await generateNewContent({
            modelAlias: selectedModelObj?.label,
            temperature: creativityValue,
            userPrompt: finalImagePrompt,
        })

        setImagePrompt(imagePromptGenerated.generatedText)
        setFeedback('');
        setGeneratingContent(false)
    }

    const handleAdaptPersona = async () => {
        if (isGenerateDisabled) return;
        setgeneratingPersona(true)

        const selectedModelObj = modelTabs.find((tab) => tab.id === selectedModel)
        const personapromptData = {
            originalContent: contentGenerated,
            personasText: personasText,
            uploadedFilesData: uploadedPersonaFileData,
            knowledgeBaseContent: knowledgeBaseContent,

        }

        const { systemPrompt, userPrompt } = getHyperRelevancePrompts(personapromptData)

        const generatePersonaData = {
            modelAlias: selectedModelObj?.label,
            temperature: creativityValue,
            systemPrompt,
            userPrompt,
        }

        const generatedPersonaResult = await generateNewContent(generatePersonaData)
        const cleanedMarkdown = cleanAndFlattenBulletsGoogle(generatedPersonaResult.generatedText)
        setPersonaGeneratedContent(cleanedMarkdown)
        setgeneratingPersona(false)
    }


    const handleSaveDraft = () => {
        console.log("Draft saved!")
    }

    return (
        <main className="overflow-hidden py-14">
            <Hero />
            <section className="div-center-md">
                <FormContainer
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                    selectedAudiences={selectedAudiences}
                    setSelectedAudiences={setSelectedAudiences}
                    selectedSubjects={selectedSubjects}
                    setSelectedSubjects={setSelectedSubjects}
                    selectedContentTypes={selectedContentTypes}
                    setSelectedContentTypes={setSelectedContentTypes}
                    isSocialPostSelected={isSocialPostSelected}
                    selectedSocialPlatform={selectedSocialPlatform}
                    setSelectedSocialPlatform={setSelectedSocialPlatform}
                    selectedCtas={selectedCtas}
                    setSelectedCtas={setSelectedCtas}
                    uploadedPdfs={uploadedPdfs}
                    setUploadedPdfs={setUploadedPdfs}
                    setReferenceMaterial={setReferenceMaterial}
                    additionalInstructions={additionalInstructions}
                    setAdditionalInstructions={setAdditionalInstructions}
                    contextualAwareness={contextualAwareness}
                    setContextualAwareness={setContextualAwareness}
                    toneValue={toneValue}
                    setToneValue={setToneValue}
                    creativityValue={creativityValue}
                    setCreativityValue={setCreativityValue}
                />

                <Generate
                    generatingContent={generatingContent}
                    onSaveDraft={handleSaveDraft}
                    onGenerate={handleGenerate}
                    isDisabled={isGenerateDisabled}
                />

                {generatingContent && (
                    <>
                        <Separator />
                        <LineSpinner>Generating Content..</LineSpinner>
                    </>
                )}

                {!generatingContent && contentGenerated && (
                    <>
                        <GeneratedContent
                            handleRevise={handleRevise}
                            feedback={feedback}
                            setFeedback={setFeedback}
                            content={contentGenerated}
                            imagePrompt={imagePrompt}

                            generatingPersona={generatingPersona}
                            personaGeneratedContent={personaGeneratedContent}

                            setpersonasText={setpersonasText}
                            setuploadedPersonaFileData={setuploadedPersonaFileData}
                            handleAdaptPersona={handleAdaptPersona}
                            personasText={personasText}
                        />
                    </>
                )}
            </section>
        </main>
    )
}