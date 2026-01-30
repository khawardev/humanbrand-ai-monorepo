'use client'

import React from "react"
import { Generate } from "@/components/shared/reusable/Generate"
import { Separator } from "@/components/ui/separator"
import { LineSpinner } from "@/components/shared/Spinner"
import { ModelsSection } from "@/components/shared/selections/ModelsSection"
import { AudienceSection } from "@/components/shared/selections/AudienceSection"
import { SubjectSection } from "@/components/shared/selections/SubjectSection"
import { ContentTypeSection } from "@/components/shared/selections/ContentTypeSection"
import { SocialPlatformSection } from "@/components/shared/selections/SocialPlatformSection"
import { CtaSection } from "@/components/shared/selections/CtaSection"
import { ReferenceMaterialSection } from "@/components/shared/selections/ReferenceMaterialSection"
import { AdditionalInstructionsSection } from "@/components/shared/selections/AdditionalInstructionsSection"
import { useNewContentGenerator } from "@/hooks/aiagHooks/useNewContentGenerator"


export default function NewPageComponent() {
    const {
        isPending,
        selectedModel, setSelectedModel,
        selectedAudiences, setSelectedAudiences,
        selectedSubjects, setSelectedSubjects,
        selectedContentTypes, setSelectedContentTypes,
        isSocialPostSelected,
        selectedSocialPlatform, setSelectedSocialPlatform,
        selectedCtas, setSelectedCtas,
        referenceFileInfos,
        handleReferenceFileChange,
        additionalInstructions, setAdditionalInstructions,
        isGenerateDisabled,
        handleGenerate,
    } = useNewContentGenerator()

    return (
        <>
            <ModelsSection title={'HBAI Models'} selectedValue={selectedModel} onValueChange={setSelectedModel} />
            <AudienceSection title={'Audience(s)'} selectedValues={selectedAudiences} onSelectionChange={setSelectedAudiences} />
            <SubjectSection title={'Subject Focus'} selectedValue={selectedSubjects} onSelectionChange={setSelectedSubjects} />
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
            <AdditionalInstructionsSection title={'Additional Instructions (optional)'} value={additionalInstructions} onChange={setAdditionalInstructions} />

            <Generate
                isPending={isPending}
                onGenerate={handleGenerate}
                isDisabled={isGenerateDisabled}
            />

            {isPending && (
                <>
                    <Separator />
                    <LineSpinner > Generating Content...</LineSpinner>
                </>
            )}
        </>
    )
}