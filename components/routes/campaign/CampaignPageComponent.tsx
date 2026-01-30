'use client'

import { FormSection } from "@/components/shared/reusable/FormSection"
import { RadioCard } from "@/components/shared/reusable/RadioCard"
import { Generate } from "@/components/shared/reusable/Generate"
import { ReferenceMaterialSection } from "@/components/shared/selections/ReferenceMaterialSection"
import { AdditionalInstructionsSection } from "@/components/shared/selections/AdditionalInstructionsSection"
import { ModelsSection } from "@/components/shared/selections/ModelsSection"
import { LineSpinner } from "@/components/shared/Spinner"
import { Separator } from "@/components/ui/separator"
import { campaignTypes } from "@/config/formData"
import { useCampaignContentGenerator } from "@/hooks/aiagHooks/useCampaignContentGenerator"

import { CampaignTypeDetails } from "./CampaignTypeDetails"

export function CampaignPageComponent() {
    const {
        isPending,
        selectedModel,
        setSelectedModel,
        selectedCampaignType,
        setSelectedCampaignType,
        referenceFileInfos,
        handleReferenceFileChange,
        additionalInstructions,
        setAdditionalInstructions,
        isGenerateDisabled,
        handleGenerate,
        formRef,
    } = useCampaignContentGenerator()

    return (
        <>
            <div id="form-start" ref={formRef}>
                <ModelsSection 
                    title="HBAI Models" 
                    selectedValue={selectedModel} 
                    onValueChange={setSelectedModel} 
                />
            </div>

            <FormSection title="Campaign Type(s)">
                <RadioCard
                    options={campaignTypes}
                    selectedValue={selectedCampaignType}
                    onSelectionChange={setSelectedCampaignType}
                />
            </FormSection>

            <CampaignTypeDetails selectedCampaignType={selectedCampaignType} />

            <ReferenceMaterialSection
                title="Reference Material"
                initialFileInfos={referenceFileInfos}
                onFilesChange={handleReferenceFileChange}
            />

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

            {isPending && (
                <>
                    <Separator className="my-6" />
                    <LineSpinner>Generating Content...</LineSpinner>
                </>
            )}
        </>
    )
}
