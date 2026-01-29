'use client'

import { useState, useTransition, useRef } from "react"
import { toast } from "sonner"
import { modelTabs, campaignTypes } from "@/config/formData"
import { getUser } from "@/server/actions/usersActions"
import { getCampaignContentPrompts } from "@/lib/aiag/prompts"
import { generateNewContent } from "@/server/actions/generateNewContentActions"
import { cleanAndFlattenBulletsGoogle } from "@/lib/cleanMarkdown"
import { stripMarkdownBold } from "@/lib/utils"

export function useCampaignContentGenerator() {
    const [isPending, startTransition] = useTransition()

    const [selectedModel, setSelectedModel] = useState<number>(modelTabs[0].id)
    const [selectedCampaignType, setSelectedCampaignType] = useState<number | null>(null)
    const [referenceFileInfos, setReferenceFileInfos] = useState<any[]>([])
    const [referenceFilesData, setReferenceFilesData] = useState<string | null>(null)
    const [additionalInstructions, setAdditionalInstructions] = useState<string>("")
    const [generatedContent, setGeneratedContent] = useState<string | null>(null)

    const formRef = useRef<HTMLDivElement>(null)

    const isGenerateDisabled = selectedCampaignType === null

    const handleReferenceFileChange = ({ fileInfos, parsedText }: any) => {
        setReferenceFileInfos(fileInfos || [])
        setReferenceFilesData(parsedText || null)
    }

    const handleGenerate = () => {
        if (isGenerateDisabled) return

        const selectedModelObj = modelTabs.find((tab) => tab.id === selectedModel)
        const selectedCampaign = campaignTypes.find((tab) => tab.id === selectedCampaignType)

        const data = {
            selectedCampaign: selectedCampaign?.label || "",
            additionalInstructions,
            referenceFilesData,
        }

        const { systemPrompt, userPrompt } = getCampaignContentPrompts(data)

        startTransition(async () => {
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
                modelAlias: selectedModelObj?.label,
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
        isPending,
        selectedModel,
        setSelectedModel,
        selectedCampaignType,
        setSelectedCampaignType,
        referenceFileInfos,
        handleReferenceFileChange,
        additionalInstructions,
        setAdditionalInstructions,
        generatedContent,
        isGenerateDisabled,
        handleGenerate,
        handleCopy,
        handleDownloadTxt,
        formRef,
    }
}
