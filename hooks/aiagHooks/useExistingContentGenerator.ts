'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { modelTabs, adjustToneAndCreativityData } from "@/config/formData"
import { getUser } from "@/server/actions/usersActions"
import { createExistingContentSession } from "@/server/actions/savedSessionActions"

export function useExistingContentGenerator() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [selectedModel, setSelectedModel] = useState<number>(modelTabs[0].id)

    const [referenceFileInfos, setReferenceFileInfos] = useState<any[] | null>([])
    const [referenceFilesData, setReferenceFilesData] = useState<string | null>(null)

    const [additionalInstructions, setAdditionalInstructions] = useState("")
    const [contextualAwareness, setContextualAwareness] = useState("")
    const [toneValue, setToneValue] = useState<number>(adjustToneAndCreativityData.tone.defaultValue)
    const [creativityValue, setCreativityValue] = useState<number>(adjustToneAndCreativityData.creativity.defaultValue)

    const isGenerateDisabled = !referenceFilesData && !additionalInstructions.trim();

    const handleReferenceFileChange = ({ fileInfos, parsedText }: any) => {
        setReferenceFileInfos(fileInfos || []);
        setReferenceFilesData(parsedText || null);
    };

    const handleGenerate = () => {
        if (isGenerateDisabled) return;

        startTransition(async () => {
            const user: any = await getUser();
            if (!user) {
                toast.warning('Please Login first');
                return;
            }

            const sessionData = {
                sessionType: "existing",
                userId: user?.id,
                modelId: selectedModel,
                referenceFileInfos: referenceFileInfos,
                referencePdfData: referenceFilesData,
                additionalInstructions: additionalInstructions,
                contextualAwareness: contextualAwareness,
                tone: toneValue,
                temperature: creativityValue,
            };

            const res = await createExistingContentSession(sessionData);

            if (res?.sessionId) {
                router.push(`/session/${res.sessionId}?new=true`);
            } else {
                toast.error(res.error || "An unexpected error occurred.");
            }
        });
    }



    return {
        isPending,
        selectedModel, setSelectedModel,
        referenceFileInfos,
        handleReferenceFileChange,
        additionalInstructions, setAdditionalInstructions,
        contextualAwareness, setContextualAwareness,
        toneValue, setToneValue,
        creativityValue, setCreativityValue,
        isGenerateDisabled,
        handleGenerate,
    }
}

