// 'use client'

// import { useState, useTransition } from "react"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"
// import { modelTabs, adjustToneAndCreativityData } from "@/config/form-data"
// import { getUser } from "@/actions/users-actions"
// import { createExistingContentSession } from "@/actions/saved-session-actions"

// export function useExistingContentGenerator() {
//     const router = useRouter();
//     const [isPending, startTransition] = useTransition();

//     const [selectedModel, setSelectedModel] = useState<number>(modelTabs[0].id)

//     const [referencePdfInfo, setReferencePdfInfo] = useState<any>(null)
//     const [referencePdfData, setReferencePdfData] = useState<string | null>(null)

//     const [additionalInstructions, setAdditionalInstructions] = useState("")
//     const [contextualAwareness, setContextualAwareness] = useState("")
//     const [toneValue, setToneValue] = useState<number>(adjustToneAndCreativityData.tone.defaultValue)
//     const [creativityValue, setCreativityValue] = useState<number>(adjustToneAndCreativityData.creativity.defaultValue)

//     const isGenerateDisabled = !referencePdfData;

//     const handleGenerate = () => {
//         if (isGenerateDisabled) return;

//         startTransition(async () => {
//             const user: any = await getUser();
//             if (!user) {
//                 toast.warning('Please Login first');
//                 return;
//             }

//             const sessionData = {
//                 sessionType: "existing",
//                 userId: user?.id,
//                 modelId: selectedModel,
//                 referencePdfInfo: referencePdfInfo,
//                 referencePdfData: referencePdfData,
//                 additionalInstructions: additionalInstructions,
//                 contextualAwareness: contextualAwareness,
//                 tone: toneValue,
//                 temperature: creativityValue,
//             };

//             const res = await createExistingContentSession(sessionData);

//             if (res?.sessionId) {
//                 router.push(`/session/${res.sessionId}?new=true`);
//             } else {
//                 toast.error(res.error || "An unexpected error occurred.");
//             }
//         });
//     }

//     const handleReferenceFileChange = ({ file, parsedText }: any) => {
//         if (file) {
//             setReferencePdfInfo({ name: file.name, size: file.size });
//             setReferencePdfData(parsedText);
//         } else {
//             setReferencePdfInfo(null);
//             setReferencePdfData(null);
//         }
//     };

//     return {
//         isPending,
//         selectedModel, setSelectedModel,
//         referencePdfInfo,
//         handleReferenceFileChange,
//         additionalInstructions, setAdditionalInstructions,
//         contextualAwareness, setContextualAwareness,
//         toneValue, setToneValue,
//         creativityValue, setCreativityValue,
//         isGenerateDisabled,
//         handleGenerate,
//     }
// }




'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { modelTabs, adjustToneAndCreativityData } from "@/config/form-data"
import { getUser } from "@/actions/users-actions"
import { createExistingContentSession } from "@/actions/saved-session-actions"

////////////////// changes explain comment start ////////////
// 1. Renamed state variables for multi-file support: `referencePdfInfo` to `referenceFileInfos` and `referencePdfData` to `referenceFilesData`.
// 2. Updated `isGenerateDisabled` to check the new `referenceFilesData` state.
// 3. Modified `handleReferenceFileChange` to correctly process the new data structure (`{ fileInfos, parsedText }`) from the `FileDropzone` component.
// 4. Updated the `sessionData` object to send the new `referenceFileInfos` array to the backend action.
////////////////// changes explain comment end ////////////
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

    const isGenerateDisabled = !referenceFilesData;

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

    const handleReferenceFileChange = ({ fileInfos, parsedText }: any) => {
        setReferenceFileInfos(fileInfos || []);
        setReferenceFilesData(parsedText || null);
    };

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