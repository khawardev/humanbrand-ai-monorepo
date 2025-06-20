// 'use client'

// import React from "react"
// import { Hero } from "@/components/aiag-components/reusable-components/hero"
// import { Generate } from "@/components/aiag-components/reusable-components/generate"
// import { Separator } from "@/components/ui/separator"
// import { LineSpinner } from "@/shared/spinner"
// import { useNewContentGenerator } from "@/hooks/useNewContentGenerator"
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


// export default function HomePage() {
//   const {
//     selectedModel, setSelectedModel,
//     selectedAudiences, setSelectedAudiences,
//     selectedSubjects, setSelectedSubjects,
//     selectedContentTypes, setSelectedContentTypes,
//     isSocialPostSelected,
//     selectedSocialPlatform, setSelectedSocialPlatform,
//     selectedCtas, setSelectedCtas,
//     uploadedPdfs, setUploadedPdfs,
//     setReferenceMaterial,
//     additionalInstructions, setAdditionalInstructions,
//     contextualAwareness, setContextualAwareness,
//     toneValue, setToneValue,
//     creativityValue, setCreativityValue,
//     generatingContent,
//     contentGenerated,
//     imagePrompt,
//     feedback, setFeedback,
//     generatingPersona,
//     personaGeneratedContent,
//     personasText, setpersonasText,
//     setuploadedPersonaFileData,
//     handleAdaptPersona,
//     isGenerateDisabled,
//     selectedModelObj,
//     handleGenerate,
//     handleRevise
//   } = useNewContentGenerator()

//   const handleSaveDraft = () => console.log("Draft saved!")

//   return (
//     <main className="overflow-hidden pt-14">
//       <Hero />
//       <section className="div-center-md">
//         <ModelsSection title={'HBAI Models'} selectedValue={selectedModel} onValueChange={setSelectedModel} />
//         <AudienceSection title={'Audience(s)'} selectedValues={selectedAudiences} onSelectionChange={setSelectedAudiences} />
//         <SubjectSection title={'Subject focus'} selectedValue={selectedSubjects} onSelectionChange={setSelectedSubjects} />
//         <ContentTypeSection title={'Content Type(s)'} selectedValues={selectedContentTypes} onSelectionChange={setSelectedContentTypes} />
//         {isSocialPostSelected && (
//           <SocialPlatformSection title={'Social Platform'} selectedValue={selectedSocialPlatform} onSelectionChange={setSelectedSocialPlatform} />
//         )}
//         <CtaSection title={'Call to Action(s)'} selectedValues={selectedCtas} onSelectionChange={setSelectedCtas} />
//         <ReferenceMaterialSection title={'Reference Materials (optional)'} files={uploadedPdfs} setFiles={setUploadedPdfs} setReferenceMaterial={setReferenceMaterial} />
//         <AdditionalInstructionsSection title={'Additional Instructions (optional)'} value={additionalInstructions} onChange={setAdditionalInstructions} />
//         <ContextualAwarenessSection title={'Contextual Awareness (optional)'} value={contextualAwareness} onChange={setContextualAwareness} />
//         <ToneAndCreativitySection title={'Adjust Tone and Creativity'} toneValue={toneValue} setToneValue={setToneValue} creativityValue={creativityValue} setCreativityValue={setCreativityValue} />

//         <Generate
//           generatingContent={generatingContent}
//           onSaveDraft={handleSaveDraft}
//           onGenerate={handleGenerate}
//           isDisabled={isGenerateDisabled}
//         />

//         {generatingContent && (
//           <>
//             <Separator />
//             <LineSpinner>Generating Content..</LineSpinner>
//           </>
//         )}

//         {!generatingContent && contentGenerated && (
//           <GeneratedContent
//             handleRevise={handleRevise}
//             feedback={feedback}
//             setFeedback={setFeedback}
//             content={contentGenerated}
//             imagePrompt={imagePrompt}
//             generatingPersona={generatingPersona}
//             personaGeneratedContent={personaGeneratedContent}
//             setpersonasText={setpersonasText}
//             setuploadedPersonaFileData={setuploadedPersonaFileData}
//             handleAdaptPersona={handleAdaptPersona}
//             personasText={personasText}
//             modelAlias={selectedModelObj?.label}
//             temperature={creativityValue}
//           />
//         )}
//       </section>
//     </main>
//   )
// }












// 'use client'

// import React from "react"
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
// import { useNewContentGenerator } from "@/hooks/gemini_studio/use-new-content-generator"


// export default function HomePage() {
//   const {
//     isPending,
//     selectedModel, setSelectedModel,
//     selectedAudiences, setSelectedAudiences,
//     selectedSubjects, setSelectedSubjects,
//     selectedContentTypes, setSelectedContentTypes,
//     isSocialPostSelected,
//     selectedSocialPlatform, setSelectedSocialPlatform,
//     selectedCtas, setSelectedCtas,
//     uploadedPdfs, setUploadedPdfs,
//     setReferencePdfInfo,
//     additionalInstructions, setAdditionalInstructions,
//     contextualAwareness, setContextualAwareness,
//     toneValue, setToneValue,
//     creativityValue, setCreativityValue,
//     isGenerateDisabled,
//     handleGenerate,
//   } = useNewContentGenerator()

//   return (
//     <main className="overflow-hidden pt-14">
//       <Hero />
//       <section className="div-center-md">
//         <ModelsSection title={'HBAI Models'} selectedValue={selectedModel} onValueChange={setSelectedModel} />
//         <AudienceSection title={'Audience(s)'} selectedValues={selectedAudiences} onSelectionChange={setSelectedAudiences} />
//         <SubjectSection title={'Subject focus'} selectedValue={selectedSubjects} onSelectionChange={setSelectedSubjects} />
//         <ContentTypeSection title={'Content Type(s)'} selectedValues={selectedContentTypes} onSelectionChange={setSelectedContentTypes} />
//         {isSocialPostSelected && (
//           <SocialPlatformSection title={'Social Platform'} selectedValue={selectedSocialPlatform} onSelectionChange={setSelectedSocialPlatform} />
//         )}
//         <CtaSection title={'Call to Action(s)'} selectedValues={selectedCtas} onSelectionChange={setSelectedCtas} />
//         <ReferenceMaterialSection title={'Reference Materials (optional)'} files={uploadedPdfs} setFiles={setUploadedPdfs} setReferenceMaterial={setReferencePdfInfo} />
//         <AdditionalInstructionsSection title={'Additional Instructions (optional)'} value={additionalInstructions} onChange={setAdditionalInstructions} />
//         <ContextualAwarenessSection title={'Contextual Awareness (optional)'} value={contextualAwareness} onChange={setContextualAwareness} />
//         <ToneAndCreativitySection title={'Adjust Tone and Creativity'} toneValue={toneValue} setToneValue={setToneValue} creativityValue={creativityValue} setCreativityValue={setCreativityValue} />

//         <Generate
//           isPending={isPending}
//           onGenerate={handleGenerate}
//           isDisabled={isGenerateDisabled}
//         />

//         {isPending && (
//           <>
//             <Separator />
//             <LineSpinner>Generating Content...</LineSpinner>
//           </>
//         )}
//       </section>
//     </main>
//   )
// }













'use client'

import React from "react"
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
import { useNewContentGenerator } from "@/hooks/gemini_studio/use-new-content-generator"


export default function HomePage() {
  const {
    isPending,
    selectedModel, setSelectedModel,
    selectedAudiences, setSelectedAudiences,
    selectedSubjects, setSelectedSubjects,
    selectedContentTypes, setSelectedContentTypes,
    isSocialPostSelected,
    selectedSocialPlatform, setSelectedSocialPlatform,
    selectedCtas, setSelectedCtas,
    referencePdfInfo,
    handleReferenceFileChange,
    additionalInstructions, setAdditionalInstructions,
    contextualAwareness, setContextualAwareness,
    toneValue, setToneValue,
    creativityValue, setCreativityValue,
    isGenerateDisabled,
    handleGenerate,
  } = useNewContentGenerator()

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
        <ReferenceMaterialSection
          title={'Reference Materials (optional)'}
          initialFileInfo={referencePdfInfo}
          onFileChange={handleReferenceFileChange}
        />
        <AdditionalInstructionsSection title={'Additional Instructions (optional)'} value={additionalInstructions} onChange={setAdditionalInstructions} />
        <ContextualAwarenessSection title={'Contextual Awareness (optional)'} value={contextualAwareness} onChange={setContextualAwareness} />
        <ToneAndCreativitySection title={'Adjust Tone and Creativity'} toneValue={toneValue} setToneValue={setToneValue} creativityValue={creativityValue} setCreativityValue={setCreativityValue} />

        <Generate
          isPending={isPending}
          onGenerate={handleGenerate}
          isDisabled={isGenerateDisabled}
        />

        {isPending && (
          <>
            <Separator />
            <LineSpinner>Generating Content...</LineSpinner>
          </>
        )}
      </section>
    </main>
  )
}