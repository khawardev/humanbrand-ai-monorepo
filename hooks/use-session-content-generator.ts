"use client"

import { useState, useEffect, useTransition } from "react"
import { contentTypes } from "@/config/form-data"
import { updateSession } from "@/actions/session-actions"

interface SessionData {
    id: string;
    sessionType: string;
    userId: string;
    sessionTitle: string;
    selectedModel: number;
    selectedAudiences: number[];
    selectedSubjects: number | null;
    selectedContentTypes: number[];
    selectedCtas: number[];
    selectedSocialPlatform: number | null;
    referenceMaterial?: string;
    additionalInstructions?: string;
    contextualAwareness?: string;
    selectedtone: number;
    temperature: string;
    generatedContent: string;
    imagePrompt: string;
    personaContent?: string | null; // Added personaContent to the type
}

export function useSessionContentGenerator(initialData: SessionData) {
    const [isPending, startTransition] = useTransition()

    const [selectedModel, setSelectedModel] = useState<number>(initialData.selectedModel ?? 1)
    const [selectedAudiences, setSelectedAudiences] = useState<number[]>(initialData.selectedAudiences ?? [])
    const [selectedSubjects, setSelectedSubjects] = useState<number | null>(initialData.selectedSubjects ?? null)
    const [selectedContentTypes, setSelectedContentTypes] = useState<number[]>(initialData.selectedContentTypes ?? [])
    const [selectedCtas, setSelectedCtas] = useState<number[]>(initialData.selectedCtas ?? [])
    const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<number | null>(initialData.selectedSocialPlatform ?? null)
    const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([])
    const [referenceMaterial, setReferenceMaterial] = useState<string | undefined>(initialData.referenceMaterial ?? undefined)
    const [additionalInstructions, setAdditionalInstructions] = useState(initialData.additionalInstructions ?? "")
    const [contextualAwareness, setContextualAwareness] = useState(initialData.contextualAwareness ?? "")
    const [toneValue, setToneValue] = useState<number>(initialData.selectedtone ?? 3)
    const [creativityValue, setCreativityValue] = useState<number>(Number(initialData.temperature ?? "0.5"))
    const [contentGenerated, setContentGenerated] = useState<string>(initialData.generatedContent ?? "")
    const [imagePrompt, setImagePrompt] = useState<string>(initialData.imagePrompt ?? "")
    const [feedback, setFeedback] = useState("")

    // FIX: Initialize personaContent safely to prevent .trim() on null/undefined
    const [personaContent, setPersonaContent] = useState<string>(initialData.personaContent ?? "")

    const socialPostContentTypeId = contentTypes.find(type => type.label === "Social Media Post")?.id
    const isSocialPostSelected = socialPostContentTypeId !== undefined && selectedContentTypes.includes(socialPostContentTypeId)

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

    const prepareData = (): any => ({
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
        personaContent,
    })

    const handleGenerate = () => {
        if (isGenerateDisabled) return
        startTransition(async () => {
            const data = prepareData()
            await updateSession(initialData.id, data)
        })
    }

    const handleRevise = () => {
        if (isGenerateDisabled || !feedback) return
        startTransition(async () => {
            const data = prepareData()
            await updateSession(initialData.id, data)
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
        personaContent, // Export the new state
        setPersonaContent, // And its setter
    }
}