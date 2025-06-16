'use client'

import React from "react"
import { Hero } from "@/components/home/hero"
import { Generate } from "@/components/home/generate"
import { Separator } from "@/components/ui/separator"
import { LineSpinner } from "@/shared/spinner"
import { GeneratedContent } from "@/components/GenrationComponents/generated-content"
import { useExistingContentGenerator } from "@/hooks/useExistingContentGenerator"

import { ModelsSection } from "@/components/GeminiStudioComponents/ModelsSection"
import { ReferenceMaterialSection } from "@/components/GeminiStudioComponents/ReferenceMaterialSection"
import { AdditionalInstructionsSection } from "@/components/GeminiStudioComponents/AdditionalInstructionsSection"
import { ContextualAwarenessSection } from "@/components/GeminiStudioComponents/ContextualAwarenessSection"
import { ToneAndCreativitySection } from "@/components/GeminiStudioComponents/ToneAndCreativitySection"

export default function ExistingContentPage() {
    const {
        selectedModel, setSelectedModel,
        uploadedPdfs, setUploadedPdfs,
        additionalInstructions, setAdditionalInstructions,
        contextualAwareness, setContextualAwareness,
        setReferenceMaterial,
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
        selectedModelObj,
        handleGenerate,
        handleRevise
    } = useExistingContentGenerator()

    const handleSaveDraft = () => console.log("Draft saved!")

    return (
        <main className="overflow-hidden pt-14">
            <Hero />
            <section className="div-center-md">
                <ModelsSection title={'HBAI Models'} selectedValue={selectedModel} onValueChange={setSelectedModel} />
                <ReferenceMaterialSection title={'Existing Content'} files={uploadedPdfs} setFiles={setUploadedPdfs} setReferenceMaterial={setReferenceMaterial} />
                <AdditionalInstructionsSection title={'Additional Instructions (optional)'} value={additionalInstructions} onChange={setAdditionalInstructions} />
                <ContextualAwarenessSection title={'Contextual Awareness (optional)'} value={contextualAwareness} onChange={setContextualAwareness} />
                <ToneAndCreativitySection title={'Adjust Tone and Creativity'} toneValue={toneValue} setToneValue={setToneValue} creativityValue={creativityValue} setCreativityValue={setCreativityValue} />

                <Generate
                    generatingContent={generatingContent}
                    onSaveDraft={handleSaveDraft}
                    onGenerate={handleGenerate}
                    isDisabled={false}
                />

                {generatingContent && (
                    <>
                        <Separator />
                        <LineSpinner>Generating Content..</LineSpinner>
                    </>
                )}

                {!generatingContent && contentGenerated && (
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
                        modelAlias={selectedModelObj?.label}
                        temperature={creativityValue}
                    />
                )}
            </section>
        </main>
    )
}