'use client'

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { modelTabs, contentTypes, adjustToneAndCreativityData } from "@/config/form-data"
import { getUser } from "@/actions/users-actions"
import { createSession } from "@/actions/saved-session-actions"

export function useNewContentGenerator() {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const [selectedModel, setSelectedModel] = useState<number>(modelTabs[0].id)
    const [selectedAudiences, setSelectedAudiences] = useState<number[]>([])
    const [selectedSubjects, setSelectedSubjects] = useState<number | null>(null)
    const [selectedContentTypes, setSelectedContentTypes] = useState<number[]>([])
    const [selectedCtas, setSelectedCtas] = useState<number[]>([])
    const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<number | null>(null)

    const [referencePdfInfo, setReferencePdfInfo] = useState<any>(null)
    const [referencePdfData, setReferencePdfData] = useState<string | null>(null)

    const [additionalInstructions, setAdditionalInstructions] = useState("")
    const [contextualAwareness, setContextualAwareness] = useState("")
    const [toneValue, setToneValue] = useState<number>(adjustToneAndCreativityData.tone.defaultValue)
    const [creativityValue, setCreativityValue] = useState<number>(adjustToneAndCreativityData.creativity.defaultValue)

    const socialPostContentTypeId = contentTypes.find((type) => type.label === "Social Media Post")?.id
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
        (isSocialPostSelected && selectedSocialPlatform === null);

    const handleGenerate = async () => {
        if (isGenerateDisabled) return;

        startTransition(async () => {
            const user: any = await getUser()
            if (!user) {
                toast.warning('Please Login first')
                return;
            }

            const sessionData = {
                sessionType: "new",
                userId: user?.id,
                modelId: selectedModel,
                audienceIds: selectedAudiences,
                subjectId: selectedSubjects,
                contentTypeIds: selectedContentTypes,
                ctaIds: selectedCtas,
                socialPlatformId: selectedSocialPlatform,
                referencePdfInfo: referencePdfInfo,
                referencePdfData: referencePdfData,
                additionalInstructions: additionalInstructions,
                contextualAwareness: contextualAwareness,
                tone: toneValue,
                temperature: creativityValue,
            }

            const res = await createSession(sessionData)

            if (res?.sessionId) {
                router.push(`/session/${res.sessionId}?new=true`)
            } else {
                toast.error(res.error || "An unexpected error occurred.")
            }
        })
    }

    const handleReferenceFileChange = ({ file, parsedText }: any) => {
        if (file) {
            setReferencePdfInfo({ name: file.name, size: file.size });
            setReferencePdfData(parsedText);
        } else {
            setReferencePdfInfo(null);
            setReferencePdfData(null);
        }
    };

    return {
        isPending,
        selectedModel, setSelectedModel,
        selectedAudiences, setSelectedAudiences,
        selectedSubjects, setSelectedSubjects,
        selectedContentTypes, setSelectedContentTypes,
        selectedCtas, setSelectedCtas,
        isSocialPostSelected,
        selectedSocialPlatform, setSelectedSocialPlatform,
        referencePdfInfo,
        handleReferenceFileChange,
        additionalInstructions, setAdditionalInstructions,
        contextualAwareness, setContextualAwareness,
        toneValue, setToneValue,
        creativityValue, setCreativityValue,
        isGenerateDisabled,
        handleGenerate,
    }
}