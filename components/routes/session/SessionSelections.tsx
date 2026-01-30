"use client"

import dynamic from "next/dynamic"

import { Generate } from "@/components/shared/reusable/Generate"
import { AdditionalInstructionsSection } from "@/components/shared/selections/AdditionalInstructionsSection"
import { ModelsSection } from "@/components/shared/selections/ModelsSection"
// Dynamic imports for heavy selection sections
const AudienceSection = dynamic(() =>
  import("@/components/shared/selections/AudienceSection").then(
    (mod) => mod.AudienceSection
  )
)
const SubjectSection = dynamic(() =>
  import("@/components/shared/selections/SubjectSection").then(
    (mod) => mod.SubjectSection
  )
)
const ContentTypeSection = dynamic(() =>
  import("@/components/shared/selections/ContentTypeSection").then(
    (mod) => mod.ContentTypeSection
  )
)
const SocialPlatformSection = dynamic(() =>
  import("@/components/shared/selections/SocialPlatformSection").then(
    (mod) => mod.SocialPlatformSection
  )
)
const CtaSection = dynamic(() =>
  import("@/components/shared/selections/CtaSection").then(
    (mod) => mod.CtaSection
  )
)
const ReferenceMaterialSection = dynamic(() =>
  import("@/components/shared/selections/ReferenceMaterialSection").then(
    (mod) => mod.ReferenceMaterialSection
  )
)

import { LineSpinner } from "@/components/shared/Spinner"
import { Separator } from "@/components/ui/separator"

interface SessionSelectionsProps {
  sessionType: string
  isPending: boolean
  isContentPending: boolean
  selectedModel: number
  setSelectedModel: (val: number) => void
  selectedAudiences: any
  setSelectedAudiences: (val: any) => void
  selectedSubjects: any
  setSelectedSubjects: (val: any) => void
  selectedContentTypes: any
  setSelectedContentTypes: (val: any) => void
  isSocialPostSelected: boolean
  selectedSocialPlatform: any
  setSelectedSocialPlatform: (val: any) => void
  selectedCtas: any
  setSelectedCtas: (val: any) => void
  referenceFileInfos: any
  handleReferenceFileChange: (val: any) => void
  additionalInstructions: string
  setAdditionalInstructions: (val: string) => void
  isGenerateDisabled: boolean
  handleGenerate: () => void
}

export function SessionSelections({
  sessionType,
  isPending,
  isContentPending,
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
  referenceFileInfos,
  handleReferenceFileChange,
  additionalInstructions,
  setAdditionalInstructions,
  isGenerateDisabled,
  handleGenerate,
}: SessionSelectionsProps) {
  
  const isNew = sessionType === 'new'
  const isExisting = sessionType === 'existing'
  const isCampaign = sessionType === 'Campaign'

  return (
    <section className="space-y-10">
      <ModelsSection
        title="HBAI Models"
        selectedValue={selectedModel}
        onValueChange={setSelectedModel}
      />

      {isNew && (
        <>
          <AudienceSection
            title="Audience(s)"
            selectedValues={selectedAudiences}
            onSelectionChange={setSelectedAudiences}
          />
          <SubjectSection
            title="Subject focus"
            selectedValue={selectedSubjects}
            onSelectionChange={setSelectedSubjects}
          />
          <ContentTypeSection
            title="Content Type(s)"
            selectedValues={selectedContentTypes}
            onSelectionChange={setSelectedContentTypes}
          />
          {isSocialPostSelected && (
            <SocialPlatformSection
              title="Social Platform"
              selectedValue={selectedSocialPlatform}
              onSelectionChange={setSelectedSocialPlatform}
            />
          )}
          <CtaSection
            title="Call to Action(s)"
            selectedValues={selectedCtas}
            onSelectionChange={setSelectedCtas}
          />
        </>
      )}

      {(isNew || isCampaign) && (
        <ReferenceMaterialSection
          title="Reference Materials (optional)"
          initialFileInfos={referenceFileInfos}
          onFilesChange={handleReferenceFileChange}
        />
      )}

      {isExisting && (
        <ReferenceMaterialSection
          title="Existing Content"
          initialFileInfos={referenceFileInfos}
          onFilesChange={handleReferenceFileChange}
        />
      )}

      <AdditionalInstructionsSection
        title="Additional Instructions (optional)"
        value={additionalInstructions}
        onChange={setAdditionalInstructions}
      />

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
  )
}
