


'use client'

import React, { useRef, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import { Hero } from "@/components/aiag-components/reusable-components/hero"
import { Generate } from "@/components/aiag-components/reusable-components/generate"
import { Separator } from "@/components/ui/separator"
import { LineSpinner } from "@/shared/spinner"
import { ModelsSection } from "@/components/aiag-components/selection-components/ModelsSection"
import { AudienceSection } from "@/components/aiag-components/selection-components/AudienceSection"
import { SubjectSection } from "@/components/aiag-components/selection-components/SubjectSection"
import { ContentTypeSection } from "@/components/aiag-components/selection-components/ContentTypeSection"
import { SocialPlatformSection } from "@/components/aiag-components/selection-components/SocialPlatformSection"
import { CtaSection } from "@/components/aiag-components/selection-components/CtaSection"
import { ReferenceMaterialSection } from "@/components/aiag-components/selection-components/ReferenceMaterialSection"
import { AdditionalInstructionsSection } from "@/components/aiag-components/selection-components/AdditionalInstructionsSection"
import { ContextualAwarenessSection } from "@/components/aiag-components/selection-components/ContextualAwarenessSection"
import { ToneAndCreativitySection } from "@/components/aiag-components/selection-components/ToneAndCreativitySection"
import { GeneratedContent } from "@/components/aiag-components/genration-components/generated-content"
import { useSessionContentGenerator } from "@/hooks/gemini_studio/use-session-content-generator"
function SessionClientPageComponent({ initialData }: any) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const contentRef = useRef<HTMLDivElement>(null)

    const {
        isPending,
        isContentPending,
        isPersonaPending,
        isImagePending,
        selectedModel, setSelectedModel,
        selectedAudiences, setSelectedAudiences,
        selectedSubjects, setSelectedSubjects,
        selectedContentTypes, setSelectedContentTypes,
        isSocialPostSelected,
        selectedSocialPlatform, setSelectedSocialPlatform,
        selectedCtas, setSelectedCtas,
        uploadedPdfs, setUploadedPdfs,
        setReferencePdfInfo,
        additionalInstructions, setAdditionalInstructions,
        contextualAwareness, setContextualAwareness,
        toneValue, setToneValue,
        creativityValue, setCreativityValue,
        isGenerateDisabled,
        handleGenerate,
        handleRevise,
        handleAdaptPersona,
        handleImageAction,
        handleChatSend,
        contentGenerated,
        imagePrompt,
        personaContent,
        imageUrls,
        chatHistory,
        feedback, setFeedback,
        personasText, setPersonasText,
        setUploadedPersonaFileData,
        modelAlias,
    } = useSessionContentGenerator(initialData)

    useEffect(() => {
        const isNew = searchParams.get('new') === 'true'
        if (isNew && contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
            router.replace(`/session/${initialData.id}`, { scroll: false })
        }
    }, [initialData.id, searchParams, router])

    return (
        <main className="overflow-hidden pt-14">
            <Hero />
            <section className="div-center-md">
                <ModelsSection title={'HBAI Models'} selectedValue={selectedModel} onValueChange={setSelectedModel} />
                <AudienceSection title={'Audience(s)'} selectedValues={selectedAudiences} onSelectionChange={setSelectedAudiences} />
                <SubjectSection title={'Subject focus'} selectedValue={selectedSubjects} onSelectionChange={setSelectedSubjects} />
                <ContentTypeSection title={'Content Type(s)'} selectedValues={selectedContentTypes} onSelectionChange={setSelectedContentTypes} />
                {isSocialPostSelected && (
                    <SocialPlatformSection title={'Social Platform'} selectedValue={selectedSocialPlatform} onSelectionChange={setSelectedSocialPlatform} />
                )}
                <CtaSection title={'Call to Action(s)'} selectedValues={selectedCtas} onSelectionChange={setSelectedCtas} />
                <ReferenceMaterialSection title={'Reference Materials (optional)'} files={uploadedPdfs} setFiles={setUploadedPdfs} setReferenceMaterial={setReferencePdfInfo} />
                <AdditionalInstructionsSection title={'Additional Instructions (optional)'} value={additionalInstructions} onChange={setAdditionalInstructions} />
                <ContextualAwarenessSection title={'Contextual Awareness (optional)'} value={contextualAwareness} onChange={setContextualAwareness} />
                <ToneAndCreativitySection title={'Adjust Tone and Creativity'} toneValue={toneValue} setToneValue={setToneValue} creativityValue={creativityValue} setCreativityValue={setCreativityValue} />

                <Generate
                    isPending={isPending}
                    onGenerate={handleGenerate}
                    isDisabled={isGenerateDisabled}
                />

                {isContentPending && (
                    <>
                        <Separator />
                        <LineSpinner>Updating Session...</LineSpinner>
                    </>
                )}

                <div ref={contentRef}>
                    {contentGenerated && (
                        <GeneratedContent
                            isPersonaPending={isPersonaPending}
                            isImagePending={isImagePending}
                            content={contentGenerated}
                            imagePrompt={imagePrompt}
                            imageUrls={imageUrls}
                            personaContent={personaContent}
                            chatHistory={chatHistory}
                            feedback={feedback}
                            setFeedback={setFeedback}
                            personasText={personasText}
                            setPersonasText={setPersonasText}
                            setUploadedPersonaFileData={setUploadedPersonaFileData}
                            handleRevise={handleRevise}
                            handleAdaptPersona={handleAdaptPersona}
                            handleImageAction={handleImageAction}
                            handleChatSend={handleChatSend}
                            modelAlias={modelAlias}
                            temperature={creativityValue}
                        />
                    )}
                </div>
            </section>
        </main>
    )
}

export function SessionClientPage({ initialData }: any) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SessionClientPageComponent initialData={initialData} />
        </Suspense>
    )
}