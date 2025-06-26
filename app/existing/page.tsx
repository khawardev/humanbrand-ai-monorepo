// 'use client'

// import React from "react"
// import { Hero } from "@/components/aiag-components/reusable-components/hero"
// import { Generate } from "@/components/aiag-components/reusable-components/generate"
// import { Separator } from "@/components/ui/separator"
// import { LineSpinner } from "@/shared/spinner"
// import { useExistingContentGenerator } from "@/hooks/gemini_studio/useExistingContentGenerator"
// import { ModelsSection } from "@/components/aiag-components/selection-components/ModelsSection"
// import { ReferenceMaterialSection } from "@/components/aiag-components/selection-components/ReferenceMaterialSection"
// import { AdditionalInstructionsSection } from "@/components/aiag-components/selection-components/AdditionalInstructionsSection"
// import { ContextualAwarenessSection } from "@/components/aiag-components/selection-components/ContextualAwarenessSection"
// import { ToneAndCreativitySection } from "@/components/aiag-components/selection-components/ToneAndCreativitySection"

// export default function ExistingContentPage() {
//   const {
//     isPending,
//     selectedModel, setSelectedModel,
//     referencePdfInfo,
//     handleReferenceFileChange,
//     additionalInstructions, setAdditionalInstructions,
//     contextualAwareness, setContextualAwareness,
//     toneValue, setToneValue,
//     creativityValue, setCreativityValue,
//     isGenerateDisabled,
//     handleGenerate,
//   } = useExistingContentGenerator()

//   return (
//     <main className="overflow-hidden pt-14">
//       <Hero />
//       <section className="div-center-md">
//         <ModelsSection title={'HBAI Models'} selectedValue={selectedModel} onValueChange={setSelectedModel} />
//         <ReferenceMaterialSection
//           title={'Existing Content'}
//           initialFileInfo={referencePdfInfo}
//           onFileChange={handleReferenceFileChange}
//         />
//         <AdditionalInstructionsSection title={'Additional Instructions (optional)'} value={additionalInstructions} onChange={setAdditionalInstructions} />
//         <ContextualAwarenessSection title={'Contextual Awareness (optional)'} value={contextualAwareness} onChange={setContextualAwareness} />
//         {/* <ToneAndCreativitySection title={'Adjust Tone and Creativity'} toneValue={toneValue} setToneValue={setToneValue} creativityValue={creativityValue} setCreativityValue={setCreativityValue} /> */}

//         <Generate
//           isPending={isPending}
//           onGenerate={handleGenerate}
//           isDisabled={isGenerateDisabled}
//         />

//         {isPending && (
//           <>
//             <Separator />
//             <LineSpinner>Enhancing Content & Creating Session...</LineSpinner>
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
import { useExistingContentGenerator } from "@/hooks/gemini_studio/useExistingContentGenerator"
import { ModelsSection } from "@/components/aiag-components/selection-components/ModelsSection"
import { ReferenceMaterialSection } from "@/components/aiag-components/selection-components/ReferenceMaterialSection"
import { AdditionalInstructionsSection } from "@/components/aiag-components/selection-components/AdditionalInstructionsSection"
import { ContextualAwarenessSection } from "@/components/aiag-components/selection-components/ContextualAwarenessSection"

////////////////// changes explain comment start ////////////
// 1. Updated the hook variables to `referenceFileInfos` and `handleReferenceFileChange` to anticipate changes in `useExistingContentGenerator`.
// 2. Modified the props passed to `ReferenceMaterialSection` to `initialFileInfos` and `onFilesChange` for consistency with the rest of the application.
////////////////// changes explain comment end ////////////
export default function ExistingContentPage() {
  const {
    isPending,
    selectedModel, setSelectedModel,
    referenceFileInfos,
    handleReferenceFileChange,
    additionalInstructions, setAdditionalInstructions,
    contextualAwareness, setContextualAwareness,
    toneValue, setToneValue,
    creativityValue, setCreativityValue,
    isGenerateDisabled,
    handleGenerate,
  } = useExistingContentGenerator()

  return (
    <main className="overflow-hidden pt-14">
      <Hero />
      <section className="div-center-md">
        <ModelsSection title={'HBAI Models'} selectedValue={selectedModel} onValueChange={setSelectedModel} />
        <ReferenceMaterialSection
          title={'Existing Content'}
          initialFileInfos={referenceFileInfos}
          onFilesChange={handleReferenceFileChange}
        />
        <AdditionalInstructionsSection title={'Additional Instructions (optional)'} value={additionalInstructions} onChange={setAdditionalInstructions} />
        <ContextualAwarenessSection title={'Contextual Awareness (optional)'} value={contextualAwareness} onChange={setContextualAwareness} />

        <Generate
          isPending={isPending}
          onGenerate={handleGenerate}
          isDisabled={isGenerateDisabled}
        />

        {isPending && (
          <>
            <Separator />
            <LineSpinner>Enhancing Content & Creating Session...</LineSpinner>
          </>
        )}
      </section>
    </main>
  )
}