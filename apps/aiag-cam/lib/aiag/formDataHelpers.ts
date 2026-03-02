import { modelTabs, audiences, subjects, contentTypes, ctas, socialPlatforms } from "@/config/formData"

export type FormDataLookupResult = {
    selectedModelObj: typeof modelTabs[0] | undefined
    selectedAudienceLabels: string[]
    selectedSubjectObj: typeof subjects[0] | undefined
    selectedContentTypeLabels: string[]
    selectedCtaLabels: string[]
    selectedSocialPlatformObj: typeof socialPlatforms[0] | undefined
}

export function lookupFormData(data: {
    modelId?: number
    audienceIds?: number[]
    subjectId?: number | null
    contentTypeIds?: number[]
    ctaIds?: number[]
    socialPlatformId?: number | null
}): FormDataLookupResult {
    const selectedModelObj = modelTabs.find((tab) => tab.id === data.modelId)
    const selectedAudienceLabels = audiences
        .filter((a) => data.audienceIds?.includes(a.id))
        .map((a) => a.label)
    const selectedSubjectObj = subjects.find((s) => s.id === data.subjectId)
    const selectedContentTypeLabels = contentTypes
        .filter((c) => data.contentTypeIds?.includes(c.id))
        .map((c) => c.label)
    const selectedCtaLabels = ctas
        .filter((c) => data.ctaIds?.includes(c.id))
        .map((c) => c.label)
    const selectedSocialPlatformObj = socialPlatforms.find((p) => p.id === data.socialPlatformId)

    return {
        selectedModelObj,
        selectedAudienceLabels,
        selectedSubjectObj,
        selectedContentTypeLabels,
        selectedCtaLabels,
        selectedSocialPlatformObj,
    }
}

export function buildPromptData(
    lookup: FormDataLookupResult,
    options: {
        referenceFilesData?: string | null
        additionalInstructions?: string | null
        contextualAwareness?: string | null
        tone?: number
    }
) {
    return {
        selectedAudiences: lookup.selectedAudienceLabels,
        selectedSubject: lookup.selectedSubjectObj?.label || "",
        selectedContentTypes: lookup.selectedContentTypeLabels,
        selectedCtas: lookup.selectedCtaLabels,
        selectedSocialPlatform: lookup.selectedSocialPlatformObj?.label || "",
        userUploadedContent: options.referenceFilesData || '',
        additionalInstructions: options.additionalInstructions || '',
        contextualAwareness: options.contextualAwareness || '',
        selectedtone: options.tone,
    }
}

export function getModelAlias(modelId: number): string | undefined {
    return modelTabs.find(tab => tab.id === modelId)?.label
}

export function getSocialPostContentTypeId(): number | undefined {
    return contentTypes.find((type) => type.label === "Social Media Post")?.id
}

export function isSocialPostContentType(selectedContentTypes: number[]): boolean {
    const socialPostId = getSocialPostContentTypeId()
    return socialPostId !== undefined && selectedContentTypes.includes(socialPostId)
}
