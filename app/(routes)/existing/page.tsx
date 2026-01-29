'use client'

import React from "react"
import { Hero } from "@/components/aiag-components/reusable-components/hero"
import { Generate } from "@/components/aiag-components/reusable-components/generate"
import { Separator } from "@/components/ui/separator"
import { LineSpinner } from "@/shared/spinner"
import { useExistingContentGenerator } from "@/hooks/aiagHooks/use-existing-content-generator"
import { ModelsSection } from "@/components/aiag-components/selection-components/ModelsSection"
import { ReferenceMaterialSection } from "@/components/aiag-components/selection-components/ReferenceMaterialSection"
import { AdditionalInstructionsSection } from "@/components/aiag-components/selection-components/AdditionalInstructionsSection"
import { ContextualAwarenessSection } from "@/components/aiag-components/selection-components/ContextualAwarenessSection"

export default function ExistingContentPage() {
  const {
    isPending,
    selectedModel, setSelectedModel,
    referenceFileInfos,
    handleReferenceFileChange,
    additionalInstructions, setAdditionalInstructions,
    isGenerateDisabled,
    handleGenerate,
  } = useExistingContentGenerator()

  return (
    <main className="overflow-hidden pt-14">
      <Hero />
      <section className="div-center-md">
        <ModelsSection title={'HBAI Models'} selectedValue={selectedModel} onValueChange={setSelectedModel} />
        <ReferenceMaterialSection
          title={'Upload Document(s)'}
          initialFileInfos={referenceFileInfos}
          onFilesChange={handleReferenceFileChange}
        />
        <div className=" text-center text-lg text-muted-foreground">
          <p>AND / OR</p>
        </div>
        <AdditionalInstructionsSection title={'Write / Paste Additional Content'} value={additionalInstructions} onChange={setAdditionalInstructions} />

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