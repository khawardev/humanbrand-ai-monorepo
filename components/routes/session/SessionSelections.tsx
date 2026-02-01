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

import { CampaignTypeDetails } from "@/components/routes/campaign/CampaignTypeDetails"
import { campaignTypes } from "@/config/formData"

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
  selectedCampaignTypeId?: number | null
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
  selectedCampaignTypeId,
  selectedCtas,
  setSelectedCtas,
  referenceFileInfos,
  handleReferenceFileChange,
  additionalInstructions,
  setAdditionalInstructions,
  isGenerateDisabled,
  handleGenerate,
}: SessionSelectionsProps) {
  
  const isNew = sessionType === 'New'
  const isExisting = sessionType === 'Existing'
  const isCampaign = sessionType === 'Campaign'

  // Helper to get campaign label
  const campaignLabel = campaignTypes.find(c => c.id === selectedCampaignTypeId)?.label

  return (
    <section className="space-y-10">
      <ModelsSection
        title="HBAI Models"
        selectedValue={selectedModel}
        onValueChange={setSelectedModel}
      />

      {isCampaign && selectedCampaignTypeId && (
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">Selected Campaign</h3>
             <div className="border rounded-lg p-4 bg-background">
                <p className="font-semibold text-primary">{campaignLabel}</p>
             </div>
          </div>
          <CampaignTypeDetails selectedCampaignType={selectedCampaignTypeId} />
        </div>
      )}

      {isNew && (
        <>
          <AudienceSection
            title="Audience(s)"
            selectedValues={selectedAudiences}
            onSelectionChange={setSelectedAudiences}
          />
          <SubjectSection
            title="Subject Focus"
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
