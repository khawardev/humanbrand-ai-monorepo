'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useBaseContentGenerator } from "./useBaseContentGenerator"
import { isSocialPostContentType } from "@/lib/aiag/formDataHelpers"
import { createSession } from "@/server/actions/savedSessionActions"

export function useNewContentGenerator() {
    const router = useRouter()
    const base = useBaseContentGenerator()

    const [selectedAudiences, setSelectedAudiences] = useState<number[]>([])
    const [selectedSubjects, setSelectedSubjects] = useState<number | null>(null)
    const [selectedContentTypes, setSelectedContentTypes] = useState<number[]>([])
    const [selectedCtas, setSelectedCtas] = useState<number[]>([])
    const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<number | null>(null)

    const isSocialPostSelected = isSocialPostContentType(selectedContentTypes)

    useEffect(() => {
        if (!isSocialPostSelected) {
            setSelectedSocialPlatform(null)
        }
    }, [isSocialPostSelected, selectedContentTypes])

    const isGenerateDisabled =
        selectedAudiences.length === 0 ||
        selectedSubjects === null ||
        selectedContentTypes.length === 0 ||
        selectedCtas.length === 0 ||
        (isSocialPostSelected && selectedSocialPlatform === null)

    const handleGenerate = async () => {
        if (isGenerateDisabled) return

        base.startTransition(async () => {
            const user = await base.validateUser()
            if (!user) return

            const sessionData = {
                sessionType: "new",
                userId: user?.id,
                modelId: base.selectedModel,
                audienceIds: selectedAudiences,
                subjectId: selectedSubjects,
                contentTypeIds: selectedContentTypes,
                ctaIds: selectedCtas,
                socialPlatformId: selectedSocialPlatform,
                referenceFileInfos: base.referenceFileInfos,
                referenceFilesData: base.referenceFilesData,
                additionalInstructions: base.additionalInstructions,
                contextualAwareness: base.contextualAwareness,
                tone: base.toneValue,
                temperature: base.creativityValue,
            }

            const res = await createSession(sessionData)

            if (res?.sessionId) {
                router.push(`/dashboard/session/${res.sessionId}?new=true`)
            } else {
                toast.error(res.error || "An unexpected error occurred.")
            }
        })
    }

    return {
        isPending: base.isPending,
        selectedModel: base.selectedModel,
        setSelectedModel: base.setSelectedModel,
        selectedAudiences,
        setSelectedAudiences,
        selectedSubjects,
        setSelectedSubjects,
        selectedContentTypes,
        setSelectedContentTypes,
        selectedCtas,
        setSelectedCtas,
        isSocialPostSelected,
        selectedSocialPlatform,
        setSelectedSocialPlatform,
        referenceFileInfos: base.referenceFileInfos,
        handleReferenceFileChange: base.handleReferenceFileChange,
        additionalInstructions: base.additionalInstructions,
        setAdditionalInstructions: base.setAdditionalInstructions,
        contextualAwareness: base.contextualAwareness,
        setContextualAwareness: base.setContextualAwareness,
        toneValue: base.toneValue,
        setToneValue: base.setToneValue,
        creativityValue: base.creativityValue,
        setCreativityValue: base.setCreativityValue,
        isGenerateDisabled,
        handleGenerate,
    }
}