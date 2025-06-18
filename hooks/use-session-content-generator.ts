"use client"

import { useState, useEffect, useTransition } from "react"
import { contentTypes } from "@/config/form-data"
import { adjustToneAndCreativityData } from "@/config/form-data"
import { generateAndUpdateSession } from "@/lib/actions/session.actions"
import { contentSession } from "@/lib/db/schema"
import { SessionInputData } from "@/types"

export function useSessionContentGenerator(
    initialData: typeof contentSession.$inferSelect,
) {
    const [isPending, startTransition] = useTransition()
    const [selectedModel, setSelectedModel] = useState<number>(
        initialData.selectedModel,
    )
    const [selectedAudiences, setSelectedAudiences] = useState<number[]>(
        initialData.selectedAudiences,
    )
    const [selectedSubjects, setSelectedSubjects] = useState<number | null>(
        initialData.selectedSubjects,
    )
    const [selectedContentTypes, setSelectedContentTypes] = useState<number[]>(
        initialData.selectedContentTypes ?? [],
    )
    const [selectedCtas, setSelectedCtas] = useState<number[]>(
        initialData.selectedCtas ?? [],
    )
    const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<
        number | null
    >(initialData.selectedSocialPlatform)
    const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([])
    const [referenceMaterial, setReferenceMaterial] = useState<string | undefined>(
        initialData.referenceMaterial ?? undefined,
    )
    const [additionalInstructions, setAdditionalInstructions] = useState(
        initialData.additionalInstructions ?? "",
    )
    const [contextualAwareness, setContextualAwareness] = useState(
        initialData.contextualAwareness ?? "",
    )
    const [toneValue, setToneValue] = useState<number>(initialData.toneValue)
    const [creativityValue, setCreativityValue] = useState<number>(
        Number(initialData.creativityValue),
    )
    const [contentGenerated, setContentGenerated] = useState<string>(
        initialData.generatedContent,
    )
    const [imagePrompt, setImagePrompt] = useState<string>(initialData.imagePrompt)
    const [feedback, setFeedback] = useState("")

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
    }, [isSocialPostSelected, selectedContentTypes])

    const isGenerateDisabled =
        selectedAudiences.length === 0 ||
        selectedSubjects === null ||
        selectedContentTypes.length === 0 ||
        selectedCtas.length === 0 ||
        (isSocialPostSelected && selectedSocialPlatform === null)

    const prepareData = (): SessionInputData => ({
        sessionType: initialData.sessionType,
        userId: initialData.userId,
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
        feedback,
        originalContent: contentGenerated,
    })

    const handleGenerate = () => {
        if (isGenerateDisabled) return
        startTransition(async () => {
            const data = prepareData()
            await generateAndUpdateSession(initialData.id, data)
        })
    }

    const handleRevise = () => {
        if (isGenerateDisabled || !feedback) return
        startTransition(async () => {
            const data = prepareData()
            await generateAndUpdateSession(initialData.id, data)
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
        selectedCtas,
        setSelectedCtas,
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
        contentGenerated,
        imagePrompt,
        feedback,
        setFeedback,
        isGenerateDisabled,
        handleGenerate,
        handleRevise,
    }
}