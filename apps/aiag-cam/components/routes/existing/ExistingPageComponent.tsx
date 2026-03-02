"use client"

import React from "react"

import { Generate } from "@/components/shared/reusable/Generate"
import { ModelsSection } from "@/components/shared/selections/ModelsSection"
import { ReferenceMaterialSection } from "@/components/shared/selections/ReferenceMaterialSection"
import { AdditionalInstructionsSection } from "@/components/shared/selections/AdditionalInstructionsSection"
import { LineSpinner } from "@/components/shared/Spinner"
import { Separator } from "@/components/ui/separator"
import { useExistingContentGenerator } from "@/hooks/aiagHooks/useExistingContentGenerator"

export function ExistingPageComponent() {
  const {
    isPending,
    selectedModel,
    setSelectedModel,
    referenceFileInfos,
    handleReferenceFileChange,
    additionalInstructions,
    setAdditionalInstructions,
    isGenerateDisabled,
    handleGenerate,
  } = useExistingContentGenerator()

  return (
    <>
      <ModelsSection
        title="HBAI Models"
        selectedValue={selectedModel}
        onValueChange={setSelectedModel}
      />

      <ReferenceMaterialSection
        title="Upload Document(s)"
        initialFileInfos={referenceFileInfos}
        onFilesChange={handleReferenceFileChange}
      />

      <div className="text-center text-lg text-muted-foreground my-4">
        <p>AND / OR</p>
      </div>

      <AdditionalInstructionsSection
        title="Write / Paste Additional Content"
        value={additionalInstructions}
        onChange={setAdditionalInstructions}
      />

      <Generate
        isPending={isPending}
        onGenerate={handleGenerate}
        isDisabled={isGenerateDisabled}
      />

      {isPending && (
        <>
          <Separator className="my-6" />
          <LineSpinner>Enhancing Content & Creating Session...</LineSpinner>
        </>
      )}
    </>
  )
}
