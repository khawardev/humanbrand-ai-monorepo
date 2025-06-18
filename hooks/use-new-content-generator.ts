"use client"

import { useState, useEffect, useTransition } from "react"
import {
    modelTabs,
    contentTypes,
    adjustToneAndCreativityData,
} from "@/config/form-data"
import { generateAndCreateSession } from "@/actions/session-actions"

export function useNewContentGenerator() {
    const [isPending, startTransition] = useTransition()
    const [selectedModel, setSelectedModel] = useState<number>(modelTabs[0].id)
    const [selectedAudiences, setSelectedAudiences] = useState<number[]>([])
    const [selectedSubjects, setSelectedSubjects] = useState<number | null>(null)
    const [selectedContentTypes, setSelectedContentTypes] = useState<number[]>([])
    const [selectedCtas, setSelectedCtas] = useState<number[]>([])
    const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<
        number | null
    >(null)
    const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([])
    const [referenceMaterial, setReferenceMaterial] = useState<string>()
    const [additionalInstructions, setAdditionalInstructions] = useState("")
    const [contextualAwareness, setContextualAwareness] = useState("")
    const [toneValue, setToneValue] = useState<number>(
        adjustToneAndCreativityData.tone.defaultValue,
    )
    const [creativityValue, setCreativityValue] = useState<number>(
        adjustToneAndCreativityData.creativity.defaultValue,
    )

    const socialPostContentTypeId = contentTypes.find(
        type => type.label === "Social Media Post",
    )?.id
    const isSocialPostSelected =
        socialPostContentTypeId !== undefined &&
        selectedContentTypes.includes(socialPostContentTypeId)

    useEffect(() => {
        if (!isSocialPostSelected) {
            setSelectedSocialPlatform(null)
        }
    }, [isSocialPostSelected])

    const isGenerateDisabled =
        selectedAudiences.length === 0 ||
        selectedSubjects === null ||
        selectedContentTypes.length === 0 ||
        selectedCtas.length === 0 ||
        (isSocialPostSelected && selectedSocialPlatform === null)

    const handleGenerate = () => {
        if (isGenerateDisabled) return

        const data: any = {
            sessionType: "NEW",
            userId: "mock-user-id",
            selectedModel,
            selectedAudiences,
            selectedSubjects,
            selectedContentTypes,
            selectedCtas,
            selectedSocialPlatform,
            referenceMaterial,
            additionalInstructions,
            contextualAwareness,
            toneValue,
            creativityValue,
        }

        startTransition(() => {
            generateAndCreateSession(data)
        })
    }

    return {
        isPending,
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
        uploadedPdfs,
        setUploadedPdfs,
        setReferenceMaterial,
        additionalInstructions,
        setAdditionalInstructions,
        contextualAwareness,
        setContextualAwareness,
        toneValue,
        setToneValue,
        creativityValue,
        setCreativityValue,
        isGenerateDisabled,
        handleGenerate,
    }
}