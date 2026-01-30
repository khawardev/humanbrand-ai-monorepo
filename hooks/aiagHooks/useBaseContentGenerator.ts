'use client'

import { useState, useTransition } from "react"
import { modelTabs, adjustToneAndCreativityData } from "@/config/formData"

export type BaseContentGeneratorState = {
    selectedModel: number
    referenceFileInfos: any[]
    referenceFilesData: string | null
    additionalInstructions: string
    contextualAwareness: string
    toneValue: number
    creativityValue: number
}

export type BaseContentGeneratorActions = {
    setSelectedModel: (value: number) => void
    setReferenceFileInfos: (value: any[]) => void
    setReferenceFilesData: (value: string | null) => void
    setAdditionalInstructions: (value: string) => void
    setContextualAwareness: (value: string) => void
    setToneValue: (value: number) => void
    setCreativityValue: (value: number) => void
    handleReferenceFileChange: (data: { fileInfos?: any[]; parsedText?: string | null }) => void
}

export type BaseContentGeneratorResult = {
    isPending: boolean
    startTransition: typeof import("react").startTransition
} & BaseContentGeneratorState & BaseContentGeneratorActions

export function useBaseContentGenerator(initialValues?: Partial<BaseContentGeneratorState>): BaseContentGeneratorResult {
    const [isPending, startTransition] = useTransition()

    const [selectedModel, setSelectedModel] = useState<number>(
        initialValues?.selectedModel ?? modelTabs[0].id
    )
    const [referenceFileInfos, setReferenceFileInfos] = useState<any[]>(
        initialValues?.referenceFileInfos ?? []
    )
    const [referenceFilesData, setReferenceFilesData] = useState<string | null>(
        initialValues?.referenceFilesData ?? null
    )
    const [additionalInstructions, setAdditionalInstructions] = useState(
        initialValues?.additionalInstructions ?? ""
    )
    const [contextualAwareness, setContextualAwareness] = useState(
        initialValues?.contextualAwareness ?? ""
    )
    const [toneValue, setToneValue] = useState<number>(
        initialValues?.toneValue ?? adjustToneAndCreativityData.tone.defaultValue
    )
    const [creativityValue, setCreativityValue] = useState<number>(
        initialValues?.creativityValue ?? adjustToneAndCreativityData.creativity.defaultValue
    )

    const handleReferenceFileChange = ({ fileInfos, parsedText }: { fileInfos?: any[]; parsedText?: string | null }) => {
        setReferenceFileInfos(fileInfos || [])
        setReferenceFilesData(parsedText || null)
    }

    return {
        isPending,
        startTransition,
        selectedModel,
        setSelectedModel,
        referenceFileInfos,
        setReferenceFileInfos,
        referenceFilesData,
        setReferenceFilesData,
        additionalInstructions,
        setAdditionalInstructions,
        contextualAwareness,
        setContextualAwareness,
        toneValue,
        setToneValue,
        creativityValue,
        setCreativityValue,
        handleReferenceFileChange,
    }
}
