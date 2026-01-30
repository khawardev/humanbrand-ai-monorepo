'use client'

import { useState, useRef } from "react"
import { toast } from "sonner"
import { campaignTypes } from "@/config/formData"
import { useBaseContentGenerator } from "./useBaseContentGenerator"
import { getModelAlias } from "@/lib/aiag/formDataHelpers"
import { getUser } from "@/server/actions/usersActions"
import { getCampaignContentPrompts } from "@/lib/aiag/prompts"
import { generateNewContent } from "@/server/actions/generateNewContentActions"
import { cleanAndFlattenBulletsGoogle } from "@/lib/cleanMarkdown"
import { stripMarkdownBold } from "@/lib/utils"

export function useCampaignContentGenerator() {
    const base = useBaseContentGenerator()
    const formRef = useRef<HTMLDivElement>(null)

    const [selectedCampaignType, setSelectedCampaignType] = useState<number | null>(null)
    const [generatedContent, setGeneratedContent] = useState<string | null>(null)

    const isGenerateDisabled = selectedCampaignType === null

    const handleGenerate = () => {
        if (isGenerateDisabled) return

        const modelAlias = getModelAlias(base.selectedModel)
        const selectedCampaign = campaignTypes.find((tab) => tab.id === selectedCampaignType)

        const data = {
            selectedCampaign: selectedCampaign?.label || "",
            additionalInstructions: base.additionalInstructions,
            referenceFilesData: base.referenceFilesData,
        }

        const { systemPrompt, userPrompt } = getCampaignContentPrompts(data)

        base.startTransition(async () => {
            const user: any = await getUser()
            if (!user) {
                toast.warning('Please Login to continue')
                return
            }
            if (user?.adminVerified === false) {
                toast.warning('Please wait for the Admin to Approve')
                return
            }

            const generateData = {
                modelAlias,
                temperature: 5,
                systemPrompt,
                userPrompt
            }

            const generatedResult = await generateNewContent(generateData)
            const cleanedMarkdown = cleanAndFlattenBulletsGoogle(generatedResult.generatedText)
            setGeneratedContent(cleanedMarkdown)
        })
    }

    const handleCopy = () => {
        if (!generatedContent) return
        navigator.clipboard.writeText(stripMarkdownBold(generatedContent))
        toast.success("Content copied to clipboard!")
    }

    const handleDownloadTxt = () => {
        if (!generatedContent) return
        const blob = new Blob([generatedContent], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "AIAG_generatedContent.txt"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
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
        generatedContent,
        isGenerateDisabled,
        handleGenerate,
        handleCopy,
        handleDownloadTxt,
        formRef,
    }
}
