


// 'use client'

// import React, { useRef, useEffect, Suspense } from "react"
// import { useSearchParams, useRouter } from 'next/navigation'
// import { Hero } from "@/components/aiag-components/reusable-components/hero"
// import { Generate } from "@/components/aiag-components/reusable-components/generate"
// import { Separator } from "@/components/ui/separator"
// import { LineSpinner } from "@/shared/spinner"
// import { ModelsSection } from "@/components/aiag-components/selection-components/ModelsSection"
// import { AudienceSection } from "@/components/aiag-components/selection-components/AudienceSection"
// import { SubjectSection } from "@/components/aiag-components/selection-components/SubjectSection"
// import { ContentTypeSection } from "@/components/aiag-components/selection-components/ContentTypeSection"
// import { SocialPlatformSection } from "@/components/aiag-components/selection-components/SocialPlatformSection"
// import { CtaSection } from "@/components/aiag-components/selection-components/CtaSection"
// import { ReferenceMaterialSection } from "@/components/aiag-components/selection-components/ReferenceMaterialSection"
// import { AdditionalInstructionsSection } from "@/components/aiag-components/selection-components/AdditionalInstructionsSection"
// import { ContextualAwarenessSection } from "@/components/aiag-components/selection-components/ContextualAwarenessSection"
// import { ToneAndCreativitySection } from "@/components/aiag-components/selection-components/ToneAndCreativitySection"
// import { GeneratedContent } from "@/components/aiag-components/genration-components/generated-content"
// import { useSessionContentGenerator } from "@/hooks/gemini_studio/use-session-content-generator"
// function SessionClientPageComponent({ initialData }: any) {
//     const router = useRouter()
//     const searchParams = useSearchParams()
//     const contentRef = useRef<HTMLDivElement>(null)

//     const {
//         isPending,
//         isContentPending,
//         isPersonaPending,
//         isImagePending,
//         selectedModel, setSelectedModel,
//         selectedAudiences, setSelectedAudiences,
//         selectedSubjects, setSelectedSubjects,
//         selectedContentTypes, setSelectedContentTypes,
//         isSocialPostSelected,
//         selectedSocialPlatform, setSelectedSocialPlatform,
//         selectedCtas, setSelectedCtas,
//         uploadedPdfs, setUploadedPdfs,
//         setReferencePdfInfo,
//         additionalInstructions, setAdditionalInstructions,
//         contextualAwareness, setContextualAwareness,
//         toneValue, setToneValue,
//         creativityValue, setCreativityValue,
//         isGenerateDisabled,
//         handleGenerate,
//         handleRevise,
//         handleAdaptPersona,
//         handleImageAction,
//         handleChatSend,
//         contentGenerated,
//         imagePrompt,
//         personaContent,
//         imageUrls,
//         chatHistory,
//         feedback, setFeedback,
//         personasText, setPersonasText,
//         setUploadedPersonaFileData,
//         modelAlias,
//     } = useSessionContentGenerator(initialData)

//     useEffect(() => {
//         const isNew = searchParams.get('new') === 'true'
//         if (isNew && contentRef.current) {
//             contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
//             router.replace(`/session/${initialData.id}`, { scroll: false })
//         }
//     }, [initialData.id, searchParams, router])

//     return (
//         <main className="overflow-hidden pt-14">
//             <Hero />
//             <section className="div-center-md">
//                 <ModelsSection title={'HBAI Models'} selectedValue={selectedModel} onValueChange={setSelectedModel} />
//                 <AudienceSection title={'Audience(s)'} selectedValues={selectedAudiences} onSelectionChange={setSelectedAudiences} />
//                 <SubjectSection title={'Subject focus'} selectedValue={selectedSubjects} onSelectionChange={setSelectedSubjects} />
//                 <ContentTypeSection title={'Content Type(s)'} selectedValues={selectedContentTypes} onSelectionChange={setSelectedContentTypes} />
//                 {isSocialPostSelected && (
//                     <SocialPlatformSection title={'Social Platform'} selectedValue={selectedSocialPlatform} onSelectionChange={setSelectedSocialPlatform} />
//                 )}
//                 <CtaSection title={'Call to Action(s)'} selectedValues={selectedCtas} onSelectionChange={setSelectedCtas} />
//                 <ReferenceMaterialSection title={'Reference Materials (optional)'} files={uploadedPdfs} setFiles={setUploadedPdfs} setReferenceMaterial={setReferencePdfInfo} />
//                 <AdditionalInstructionsSection title={'Additional Instructions (optional)'} value={additionalInstructions} onChange={setAdditionalInstructions} />
//                 <ContextualAwarenessSection title={'Contextual Awareness (optional)'} value={contextualAwareness} onChange={setContextualAwareness} />
//                 <ToneAndCreativitySection title={'Adjust Tone and Creativity'} toneValue={toneValue} setToneValue={setToneValue} creativityValue={creativityValue} setCreativityValue={setCreativityValue} />

//                 <Generate
//                     isPending={isPending}
//                     onGenerate={handleGenerate}
//                     isDisabled={isGenerateDisabled}
//                 />

//                 {isContentPending ? (
//                     <>
//                         <Separator />
//                         <LineSpinner>Generating Content...</LineSpinner>
//                     </>
//                 ) :
//                     <div ref={contentRef}>
//                         {contentGenerated && (
//                             <GeneratedContent
//                                 isPersonaPending={isPersonaPending}
//                                 isImagePending={isImagePending}
//                                 content={contentGenerated}
//                                 imagePrompt={imagePrompt}
//                                 imageUrls={imageUrls}
//                                 personaContent={personaContent}
//                                 chatHistory={chatHistory}
//                                 feedback={feedback}
//                                 setFeedback={setFeedback}
//                                 personasText={personasText}
//                                 setPersonasText={setPersonasText}
//                                 setUploadedPersonaFileData={setUploadedPersonaFileData}
//                                 handleRevise={handleRevise}
//                                 handleAdaptPersona={handleAdaptPersona}
//                                 handleImageAction={handleImageAction}
//                                 handleChatSend={handleChatSend}
//                                 modelAlias={modelAlias}
//                                 temperature={creativityValue}
//                             />
//                         )}
//                     </div>
//                 }
//             </section>
//         </main>
//     )
// }

// export function SessionClientPage({ initialData }: any) {
//     return (
//         <Suspense fallback={<div>Loading...</div>}>
//             <SessionClientPageComponent initialData={initialData} />
//         </Suspense>
//     )
// }










// 'use client'

// import React, { useRef, useEffect, Suspense } from "react"
// import { useSearchParams, useRouter } from 'next/navigation'
// import { Hero } from "@/components/aiag-components/reusable-components/hero"
// import { Generate } from "@/components/aiag-components/reusable-components/generate"
// import { Separator } from "@/components/ui/separator"
// import { LineSpinner } from "@/shared/spinner"
// import { ModelsSection } from "@/components/aiag-components/selection-components/ModelsSection"
// import { AudienceSection } from "@/components/aiag-components/selection-components/AudienceSection"
// import { SubjectSection } from "@/components/aiag-components/selection-components/SubjectSection"
// import { ContentTypeSection } from "@/components/aiag-components/selection-components/ContentTypeSection"
// import { SocialPlatformSection } from "@/components/aiag-components/selection-components/SocialPlatformSection"
// import { CtaSection } from "@/components/aiag-components/selection-components/CtaSection"
// import { ReferenceMaterialSection } from "@/components/aiag-components/selection-components/ReferenceMaterialSection"
// import { AdditionalInstructionsSection } from "@/components/aiag-components/selection-components/AdditionalInstructionsSection"
// import { ContextualAwarenessSection } from "@/components/aiag-components/selection-components/ContextualAwarenessSection"
// import { ToneAndCreativitySection } from "@/components/aiag-components/selection-components/ToneAndCreativitySection"
// import { GeneratedContent } from "@/components/aiag-components/genration-components/generated-content"
// import { useSessionContentGenerator } from "@/hooks/gemini_studio/use-session-content-generator"

// function SessionClientPageComponent({ initialData }: any) {
//     const router = useRouter()
//     const searchParams = useSearchParams()
//     const contentRef = useRef<HTMLDivElement>(null)

//     const {
//         isPending,
//         isContentPending,
//         isPersonaPending,
//         isImagePending,
//         selectedModel, setSelectedModel,
//         selectedAudiences, setSelectedAudiences,
//         selectedSubjects, setSelectedSubjects,
//         selectedContentTypes, setSelectedContentTypes,
//         isSocialPostSelected,
//         selectedSocialPlatform, setSelectedSocialPlatform,
//         selectedCtas, setSelectedCtas,
//         referencePdfInfo, handleReferenceFileChange,
//         additionalInstructions, setAdditionalInstructions,
//         contextualAwareness, setContextualAwareness,
//         toneValue, setToneValue,
//         creativityValue, setCreativityValue,
//         isGenerateDisabled,
//         handleGenerate,
//         handleRevise,
//         handleAdaptPersona,
//         handleImageAction,
//         handleImageFileChange,
//         imageReferenceFileInfo,
//         handleChatSend,
//         handleChatFileChange,
//         chatPdfInfo,
//         contentGenerated,
//         imagePrompt,
//         personaContent,
//         imageUrls,
//         chatHistory,
//         feedback, setFeedback,
//         personasText, setPersonasText,
//         setUploadedPersonaFileData,
//         modelAlias,
//     } = useSessionContentGenerator(initialData)

//     useEffect(() => {
//         const isNew = searchParams.get('new') === 'true'
//         if (isNew && contentRef.current) {
//             contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
//             router.replace(`/session/${initialData.id}`, { scroll: false })
//         }
//     }, [initialData.id, searchParams, router])

//     return (
//         <main className="overflow-hidden pt-14">
//             <Hero />
//             <section className="div-center-md">
//                 <ModelsSection title={'HBAI Models'} selectedValue={selectedModel} onValueChange={setSelectedModel} />
//                 <AudienceSection title={'Audience(s)'} selectedValues={selectedAudiences} onSelectionChange={setSelectedAudiences} />
//                 <SubjectSection title={'Subject focus'} selectedValue={selectedSubjects} onSelectionChange={setSelectedSubjects} />
//                 <ContentTypeSection title={'Content Type(s)'} selectedValues={selectedContentTypes} onSelectionChange={setSelectedContentTypes} />
//                 {isSocialPostSelected && (
//                     <SocialPlatformSection title={'Social Platform'} selectedValue={selectedSocialPlatform} onSelectionChange={setSelectedSocialPlatform} />
//                 )}
//                 <CtaSection title={'Call to Action(s)'} selectedValues={selectedCtas} onSelectionChange={setSelectedCtas} />
//                 <ReferenceMaterialSection
//                     title={'Reference Materials (optional)'}
//                     initialFileInfo={referencePdfInfo}
//                     onFileChange={handleReferenceFileChange}
//                 />
//                 <AdditionalInstructionsSection title={'Additional Instructions (optional)'} value={additionalInstructions} onChange={setAdditionalInstructions} />
//                 <ContextualAwarenessSection title={'Contextual Awareness (optional)'} value={contextualAwareness} onChange={setContextualAwareness} />
//                 <ToneAndCreativitySection title={'Adjust Tone and Creativity'} toneValue={toneValue} setToneValue={setToneValue} creativityValue={creativityValue} setCreativityValue={setCreativityValue} />

//                 <Generate
//                     isPending={isPending}
//                     onGenerate={handleGenerate}
//                     isDisabled={isGenerateDisabled}
//                 />

//                 {isContentPending && (
//                     <>
//                         <Separator />
//                         <LineSpinner>Updating Session...</LineSpinner>
//                     </>
//                 )}

//                 <div ref={contentRef}>
//                     {contentGenerated && (
//                         <GeneratedContent
//                             isPersonaPending={isPersonaPending}
//                             isImagePending={isImagePending}
//                             content={contentGenerated}
//                             imagePrompt={imagePrompt}
//                             imageUrls={imageUrls}
//                             imageReferenceFileInfo={imageReferenceFileInfo}
//                             onImageFileChange={handleImageFileChange}
//                             personaContent={personaContent}
//                             chatHistory={chatHistory}
//                             chatPdfInfo={chatPdfInfo}
//                             onChatFileChange={handleChatFileChange}
//                             feedback={feedback}
//                             setFeedback={setFeedback}
//                             personasText={personasText}
//                             setPersonasText={setPersonasText}
//                             setUploadedPersonaFileData={setUploadedPersonaFileData}
//                             handleRevise={handleRevise}
//                             handleAdaptPersona={handleAdaptPersona}
//                             handleImageAction={handleImageAction}
//                             handleChatSend={handleChatSend}
//                             modelAlias={modelAlias}
//                             temperature={creativityValue}
//                         />
//                     )}
//                 </div>
//             </section>
//         </main>
//     )
// }

// export function SessionClientPage({ initialData }: any) {
//     return (
//         <Suspense fallback={<div>Loading...</div>}>
//             <SessionClientPageComponent initialData={initialData} />
//         </Suspense>
//     )
// }















'use client'

import React, { useRef, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from 'next/navigation'
import { Hero } from "@/components/aiag-components/reusable-components/hero"
import { Generate } from "@/components/aiag-components/reusable-components/generate"
import { Separator } from "@/components/ui/separator"
import { LineSpinner, Spinner } from "@/shared/spinner"
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
import { PiBrain } from "react-icons/pi"
import { RiAiGenerate } from "react-icons/ri"
import { CustomTabs } from "@/shared/CustomTabs"

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
        referencePdfInfo, handleReferenceFileChange,
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
        chatPdfInfo,
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
            <section className="sm:w-8/12 w-full m-auto sm:px-0 px-4 pt-10">
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
                                                initialFileInfo={referencePdfInfo}
                                                onFileChange={handleReferenceFileChange}
                                            />
                                        </>
                                    ) : (
                                        <ReferenceMaterialSection
                                            title={'Existing Content'}
                                            initialFileInfo={referencePdfInfo}
                                            onFileChange={handleReferenceFileChange}
                                        />
                                    )}

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
                                            <LineSpinner>Generating Content...</LineSpinner>
                                        </>
                                    )}
                                </section>
                            ),
                        },
                        {
                            label: "Content Genrated",
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
                                                    isPersonaPending={isPersonaPending}
                                                    isImagePending={isImagePending}
                                                    content={contentGenerated}
                                                    imagePrompt={imagePrompt}
                                                    imageUrls={imageUrls}
                                                    imageReferenceFileInfo={imageReferenceFileInfo}
                                                    onImageFileChange={handleImageFileChange}
                                                    personaContent={personaContent}
                                                    chatHistory={chatHistory}
                                                    chatPdfInfo={chatPdfInfo}
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

export function SessionClientPage({ initialData }: any) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SessionClientPageComponent initialData={initialData} />
        </Suspense>
    )
}