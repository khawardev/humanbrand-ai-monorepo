'use client'

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useBaseContentGenerator } from "./useBaseContentGenerator"
import { createExistingContentSession } from "@/server/actions/savedSessionActions"

export function useExistingContentGenerator() {
    const router = useRouter()
    const base = useBaseContentGenerator()

    const isGenerateDisabled = !base.referenceFilesData && !base.additionalInstructions.trim()

    const handleGenerate = () => {
        if (isGenerateDisabled) return

        base.startTransition(async () => {
            const user = await base.validateUser()
            if (!user) return

            const sessionData = {
                sessionType: "existing",
                userId: user?.id,
                modelId: base.selectedModel,
                referenceFileInfos: base.referenceFileInfos,
                referenceFilesData: base.referenceFilesData,
                additionalInstructions: base.additionalInstructions,
                contextualAwareness: base.contextualAwareness,
                tone: base.toneValue,
                temperature: base.creativityValue,
            }

            const res = await createExistingContentSession(sessionData)

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
