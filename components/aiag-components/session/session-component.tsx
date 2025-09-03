'use client'
import React, { useRef, useEffect } from "react"

import dynamic from 'next/dynamic'
const ModelsSection = dynamic(() => import('@/components/aiag-components/selection-components/ModelsSection').then(mod => mod.ModelsSection))
const AudienceSection = dynamic(() => import('@/components/aiag-components/selection-components/AudienceSection').then(mod => mod.AudienceSection))
const SubjectSection = dynamic(() => import('@/components/aiag-components/selection-components/SubjectSection').then(mod => mod.SubjectSection))
const ContentTypeSection = dynamic(() => import('@/components/aiag-components/selection-components/ContentTypeSection').then(mod => mod.ContentTypeSection))
const SocialPlatformSection = dynamic(() => import('@/components/aiag-components/selection-components/SocialPlatformSection').then(mod => mod.SocialPlatformSection))
const CtaSection = dynamic(() => import('@/components/aiag-components/selection-components/CtaSection').then(mod => mod.CtaSection))
const ReferenceMaterialSection = dynamic(() => import('@/components/aiag-components/selection-components/ReferenceMaterialSection').then(mod => mod.ReferenceMaterialSection))
const AdditionalInstructionsSection = dynamic(() => import('@/components/aiag-components/selection-components/AdditionalInstructionsSection').then(mod => mod.AdditionalInstructionsSection))
const ContextualAwarenessSection = dynamic(() => import('@/components/aiag-components/selection-components/ContextualAwarenessSection').then(mod => mod.ContextualAwarenessSection))
const GeneratedContent = dynamic(() => import('@/components/aiag-components/genration-components/generated-content').then(mod => mod.GeneratedContent))


import { useSearchParams, useRouter } from 'next/navigation'
import { Hero } from "@/components/aiag-components/reusable-components/hero"
import { Generate } from "@/components/aiag-components/reusable-components/generate"
import { Separator } from "@/components/ui/separator"
import { LineSpinner, Spinner } from "@/shared/spinner"
import { useSessionContentGenerator } from "@/hooks/aiag_hooks/use-session-content-generator"
import { PiBrain } from "react-icons/pi"
import { RiAiGenerate } from "react-icons/ri"
import { CustomTabs } from "@/shared/CustomTabs"


export function SessionPageComponent({ initialData, user }: any) {
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
        referenceFileInfos, handleReferenceFileChange,
        additionalInstructions, setAdditionalInstructions,
        contextualAwareness, setContextualAwareness,
        toneValue, setToneValue,
        creativityValue, setCreativityValue,
        isGenerateDisabled,
        handleGenerate,
        handleRevise,
        handleAdaptPersona,
        handleImageAction,
        handleImageFileChange,
        imageReferenceFileInfo,
        handleChatSend,
        isChatLoading,
        handleChatFileChange,
        chatFileInfos,
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

    const isNewContentType = initialData.sessionType === 'new';

    return (
        <main className="overflow-hidden pt-12">
            <Hero />
            <section className="div-center-md">
                <CustomTabs
                    triggerMaxWidthClass="max-w-40"
                    defaultValue="content_generate"
                    tabs={[
                        {
                            label: "Selections",
                            value: "selections",
                            icon: <PiBrain />,
                            content: (
                                <section className="space-y-10">
                                    <ModelsSection title={'HBAI Models'} selectedValue={selectedModel} onValueChange={setSelectedModel} />

                                    {isNewContentType ? (
                                        <>
                                            <AudienceSection title={'Audience(s)'} selectedValues={selectedAudiences} onSelectionChange={setSelectedAudiences} />
                                            <SubjectSection title={'Subject focus'} selectedValue={selectedSubjects} onSelectionChange={setSelectedSubjects} />
                                            <ContentTypeSection title={'Content Type(s)'} selectedValues={selectedContentTypes} onSelectionChange={setSelectedContentTypes} />
                                            {isSocialPostSelected && (
                                                <SocialPlatformSection title={'Social Platform'} selectedValue={selectedSocialPlatform} onSelectionChange={setSelectedSocialPlatform} />
                                            )}
                                            <CtaSection title={'Call to Action(s)'} selectedValues={selectedCtas} onSelectionChange={setSelectedCtas} />
                                            <ReferenceMaterialSection
                                                title={'Reference Materials (optional)'}
                                                initialFileInfos={referenceFileInfos}
                                                onFilesChange={handleReferenceFileChange}
                                            />
                                        </>
                                    ) : (
                                        <ReferenceMaterialSection
                                            title={'Existing Content'}
                                            initialFileInfos={referenceFileInfos}
                                            onFilesChange={handleReferenceFileChange}
                                        />
                                    )}

                                    <AdditionalInstructionsSection title={'Additional Instructions (optional)'} value={additionalInstructions} onChange={setAdditionalInstructions} />
                                    <ContextualAwarenessSection title={'Contextual Awareness (optional)'} value={contextualAwareness} onChange={setContextualAwareness} />

                                    <Generate
                                        isPending={isPending}
                                        onGenerate={handleGenerate}
                                        isDisabled={isGenerateDisabled}
                                    />

                                    {isContentPending && (
                                        <>
                                            <Separator />
                                            <LineSpinner>Generating Content...</LineSpinner>
                                        </>
                                    )}
                                </section>
                            ),
                        },
                        {
                            label: "AIAG Content",
                            value: "content_generate",
                            icon: isContentPending ? <Spinner /> : <RiAiGenerate />,
                            content: (
                                <div className="space-y-10" >
                                    {isContentPending ? (
                                        <>
                                            <LineSpinner>Generating Content...</LineSpinner>
                                        </>
                                    ) :
                                        contentGenerated && (
                                            <>
                                                <h2>{initialData.title}</h2>
                                                <GeneratedContent
                                                    user={user}
                                                    isPersonaPending={isPersonaPending}
                                                    isImagePending={isImagePending}
                                                    content={contentGenerated}
                                                    imagePrompt={imagePrompt}
                                                    imageUrls={imageUrls}
                                                    imageReferenceFileInfo={imageReferenceFileInfo}
                                                    onImageFileChange={handleImageFileChange}
                                                    personaContent={personaContent}
                                                    chatHistory={chatHistory}
                                                    chatFileInfos={chatFileInfos}
                                                    onChatFileChange={handleChatFileChange}
                                                    feedback={feedback}
                                                    setFeedback={setFeedback}
                                                    personasText={personasText}
                                                    setPersonasText={setPersonasText}
                                                    setUploadedPersonaFileData={setUploadedPersonaFileData}
                                                    handleRevise={handleRevise}
                                                    handleAdaptPersona={handleAdaptPersona}
                                                    handleImageAction={handleImageAction}
                                                    handleChatSend={handleChatSend}
                                                    isChatLoading={isChatLoading}
                                                    modelAlias={modelAlias}
                                                    temperature={creativityValue}
                                                />
                                            </>
                                        )
                                    }
                                </div>
                            ),
                        },
                    ]}
                />
            </section>
        </main>
    )
}
