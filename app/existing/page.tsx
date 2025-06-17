'use client'

import React from "react"
import { Hero } from "@/components/aiag-components/reusable-components/hero"
import { Generate } from "@/components/aiag-components/reusable-components/generate"
import { Separator } from "@/components/ui/separator"
import { LineSpinner } from "@/shared/spinner"
import { useExistingContentGenerator } from "@/hooks/useExistingContentGenerator"
import { ModelsSection } from "@/components/aiag-components/selection-components/ModelsSection"
import { ReferenceMaterialSection } from "@/components/aiag-components/selection-components/ReferenceMaterialSection"
import { AdditionalInstructionsSection } from "@/components/aiag-components/selection-components/AdditionalInstructionsSection"
import { ContextualAwarenessSection } from "@/components/aiag-components/selection-components/ContextualAwarenessSection"
import { ToneAndCreativitySection } from "@/components/aiag-components/selection-components/ToneAndCreativitySection"
import { GeneratedContent } from "@/components/aiag-components/genration-components/generated-content"


export default function page() {
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
    isGenerateDisabled,
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
          isDisabled={isGenerateDisabled}
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