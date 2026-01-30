'use client'

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { campaignTypes } from "@/config/formData"
import { useBaseContentGenerator } from "./useBaseContentGenerator"
import { getModelAlias } from "@/lib/aiag/formDataHelpers"
import { createCampaignContentSession } from "@/server/actions/savedSessionActions"

export function useCampaignContentGenerator() {
    const router = useRouter()
    const base = useBaseContentGenerator()
    const formRef = useRef<HTMLDivElement>(null)

    const [selectedCampaignType, setSelectedCampaignType] = useState<number | null>(null)

    const isGenerateDisabled = selectedCampaignType === null

    const handleGenerate = () => {
        if (isGenerateDisabled) return

        const modelAlias = getModelAlias(base.selectedModel)
        const selectedCampaign = campaignTypes.find((tab) => tab.id === selectedCampaignType)

        base.startTransition(async () => {
            const user = await base.validateUser()
            if (!user) return

            const sessionData = {
                userId: user.id,
                modelId: base.selectedModel,
                modelAlias,
                selectedCampaignLabel: selectedCampaign?.label || "",
                additionalInstructions: base.additionalInstructions,
                referenceFilesData: base.referenceFilesData,
                temperature: base.creativityValue,
            }

            const res = await createCampaignContentSession(sessionData)
            
            if (res.sessionId) {
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
        selectedCampaignType,
        setSelectedCampaignType,
        referenceFileInfos: base.referenceFileInfos,
        handleReferenceFileChange: base.handleReferenceFileChange,
        additionalInstructions: base.additionalInstructions,
        setAdditionalInstructions: base.setAdditionalInstructions,
        isGenerateDisabled,
        handleGenerate,
        formRef,
    }
}
