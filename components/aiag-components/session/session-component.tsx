"use client"

import React from "react"
import { Hero } from "@/components/aiag-components/reusable-components/hero"
import { Generate } from "@/components/aiag-components/reusable-components/generate"
import { Separator } from "@/components/ui/separator"
import { LineSpinner } from "@/shared/spinner"
import { useSessionContentGenerator } from "@/hooks/use-session-content-generator"
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
import { contentSession } from "@/db/schema/session-schema"

type SessionComponentProps = {
    initialData: typeof contentSession.$inferSelect
}

export function SessionComponent({ initialData }: SessionComponentProps) {
    const {
        isPending,
        selectedModel,
        setSelectedModel,
        selectedAudiences,
        setSelectedAudiences,
        selectedSubjects,
        setSelectedSubjects,
        selectedContentTypes,
        setSelectedContentTypes,
        isSocialPostSelected,
        selectedSocialPlatform,
        setSelectedSocialPlatform,
        selectedCtas,
        setSelectedCtas,
        uploadedPdfs,
        setUploadedPdfs,
        setReferenceMaterial,
        additionalInstructions,
        setAdditionalInstructions,
        contextualAwareness,
        setContextualAwareness,
        toneValue,
        setToneValue,
        creativityValue,
        setCreativityValue,
        contentGenerated,
        imagePrompt,
        feedback,
        setFeedback,
        isGenerateDisabled,
        handleGenerate,
        handleRevise,
    } = useSessionContentGenerator(initialData)

    return (
        <main className="overflow-hidden pt-14">
            <Hero />
            <section className="div-center-md">
                <ModelsSection
                    title={"HBAI Models"}
                    selectedValue={selectedModel}
                    onValueChange={setSelectedModel}
                />
                <AudienceSection
                    title={"Audience(s)"}
                    selectedValues={selectedAudiences}
                    onSelectionChange={setSelectedAudiences}
                />
                <SubjectSection
                    title={"Subject focus"}
                    selectedValue={selectedSubjects}
                    onSelectionChange={setSelectedSubjects}
                />
                <ContentTypeSection
                    title={"Content Type(s)"}
                    selectedValues={selectedContentTypes}
                    onSelectionChange={setSelectedContentTypes}
                />
                {isSocialPostSelected && (
                    <SocialPlatformSection
                        title={"Social Platform"}
                        selectedValue={selectedSocialPlatform}
                        onSelectionChange={setSelectedSocialPlatform}
                    />
                )}
                <CtaSection
                    title={"Call to Action(s)"}
                    selectedValues={selectedCtas}
                    onSelectionChange={setSelectedCtas}
                />
                <ReferenceMaterialSection
                    title={"Reference Materials (optional)"}
                    files={uploadedPdfs}
                    setFiles={setUploadedPdfs}
                    setReferenceMaterial={setReferenceMaterial}
                />
                <AdditionalInstructionsSection
                    title={"Additional Instructions (optional)"}
                    value={additionalInstructions}
                    onChange={setAdditionalInstructions}
                />
                <ContextualAwarenessSection
                    title={"Contextual Awareness (optional)"}
                    value={contextualAwareness}
                    onChange={setContextualAwareness}
                />
                <ToneAndCreativitySection
                    title={"Adjust Tone and Creativity"}
                    toneValue={toneValue}
                    setToneValue={setToneValue}
                    creativityValue={creativityValue}
                    setCreativityValue={setCreativityValue}
                />

                <Generate
                    generatingContent={isPending}
                    onGenerate={handleGenerate}
                    onRevise={handleRevise}
                    isDisabled={isGenerateDisabled || isPending}
                    showRevise={true}
                />

                {isPending && (
                    <>
                        <Separator />
                        <LineSpinner>Updating Content..</LineSpinner>
                    </>
                )}

                {!isPending && contentGenerated && (
                    <GeneratedContent
                        handleRevise={handleRevise}
                        feedback={feedback}
                        setFeedback={setFeedback}
                        content={contentGenerated}
                        imagePrompt={imagePrompt}
                    />
                )}
            </section>
        </main>
    )
}