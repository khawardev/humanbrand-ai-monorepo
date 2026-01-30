'use client'

import { useState, useEffect, useTransition } from "react"
import { toast } from "sonner"
import { updateSessionContent, adaptPersonaForSession, manageImageForSession, updateChatForSession } from "@/server/actions/savedSessionActions"
import { generateImageAction } from "@/server/actions/generateImageActions"
import { generateNewContent } from "@/server/actions/generateNewContentActions"
import { getChatSystemPrompt } from "@/lib/aiag/prompts"
import { knowledgeBaseContent } from "@/lib/aiag/knowledgeBase"
import { uploadImageToSupabase } from "@/lib/supabase/uploadImageToSupabase"
import { useBaseContentGenerator } from "./useBaseContentGenerator"
import { getModelAlias, isSocialPostContentType } from "@/lib/aiag/formDataHelpers"

export function useSessionContentGenerator(initialData: any) {
    const base = useBaseContentGenerator({
        selectedModel: initialData.modelId,
        referenceFileInfos: initialData.referenceFileInfos,
        referenceFilesData: initialData.referenceFilesData,
        additionalInstructions: initialData.additionalInstructions,
        contextualAwareness: initialData.contextualAwareness,
        toneValue: initialData.tone,
        creativityValue: initialData.temperature ? Number(initialData.temperature) : undefined
    })

    const [isContentPending, startContentTransition] = useTransition();
    const [isPersonaPending, startPersonaTransition] = useTransition();
    const [isImagePending, startImageTransition] = useTransition();

    const isPending = base.isPending || isContentPending || isPersonaPending || isImagePending;

    const [selectedAudiences, setSelectedAudiences] = useState<number[]>(initialData.audienceIds ?? [])
    const [selectedSubjects, setSelectedSubjects] = useState<number | null>(initialData.subjectId ?? null)
    const [selectedContentTypes, setSelectedContentTypes] = useState<number[]>(initialData.contentTypeIds ?? [])
    const [selectedCtas, setSelectedCtas] = useState<number[]>(initialData.ctaIds ?? [])
    const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<number | null>(initialData.socialPlatformId ?? null)

    const [contentGenerated, setContentGenerated] = useState<string>(initialData.generatedContent ?? "")
    const [imagePrompt, setImagePrompt] = useState<string>(initialData.imagePrompt ?? "")
    const [personaContent, setPersonaContent] = useState<string>(initialData.personaContent ?? "")
    const [imageUrls, setImageUrls] = useState<string[]>(initialData.imageUrls ?? [])

    const [imageReferenceFile, setImageReferenceFile] = useState<File | null>(null);
    const [imageReferenceFileInfo, setImageReferenceFileInfo] = useState<any>(initialData.imageReferenceFileInfo ?? null);

    const [chatHistory, setChatHistory] = useState<any[]>(initialData.chatHistory ?? [])
    const [chatFileInfos, setChatFileInfos] = useState<any[]>(initialData.chatFileInfos ?? []);
    const [chatFilesData, setChatFilesData] = useState<string | null>(initialData.chatFilesData ?? null);

    const [feedback, setFeedback] = useState("")
    const [personasText, setPersonasText] = useState("")
    const [uploadedPersonaFileData, setUploadedPersonaFileData] = useState<any>(null)
    const [isChatLoading, setIsChatLoading] = useState(false);

    const modelAlias = getModelAlias(base.selectedModel)
    const isSocialPostSelected = isSocialPostContentType(selectedContentTypes)

    useEffect(() => {
        setContentGenerated(initialData.generatedContent ?? "");
        setImagePrompt(initialData.imagePrompt ?? "");
        setPersonaContent(initialData.personaContent ?? "");
        setImageUrls(initialData.imageUrls ?? []);
        setChatHistory(initialData.chatHistory ?? []);
        setImageReferenceFileInfo(initialData.imageReferenceFileInfo ?? null);

        base.setReferenceFileInfos(initialData.referenceFileInfos ?? []);
        base.setReferenceFilesData(initialData.referenceFilesData ?? null);
        setChatFileInfos(initialData.chatFileInfos ?? []);
        setChatFilesData(initialData.chatFilesData ?? null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData]);

    useEffect(() => {
        if (!isSocialPostSelected) setSelectedSocialPlatform(null)
    }, [isSocialPostSelected, selectedContentTypes])

    const isGenerateDisabled =
        selectedAudiences.length === 0 ||
        selectedSubjects === null ||
        selectedContentTypes.length === 0 ||
        selectedCtas.length === 0 ||
        (isSocialPostSelected && selectedSocialPlatform === null)

    const prepareUpdateData = () => ({
        modelId: base.selectedModel,
        audienceIds: selectedAudiences,
        subjectId: selectedSubjects,
        contentTypeIds: selectedContentTypes,
        ctaIds: selectedCtas,
        socialPlatformId: selectedSocialPlatform,
        additionalInstructions: base.additionalInstructions,
        contextualAwareness: base.contextualAwareness,
        tone: base.toneValue,
        temperature: base.creativityValue,
        originalContent: contentGenerated,
        referenceFileInfos: base.referenceFileInfos,
        referenceFilesData: base.referenceFilesData,
    })

    const handleGenerate = () => {
        if (isGenerateDisabled) return
        startContentTransition(async () => {
            const data = prepareUpdateData();
            const result = await updateSessionContent(initialData.id, data)
            if (result.error) toast.error(result.error)
            else toast.success("Content updated successfully!")
        })
    }

    const handleRevise = () => {
        if (!feedback) return;
        startContentTransition(async () => {
            const data = { ...prepareUpdateData(), feedback };
            const result = await updateSessionContent(initialData.id, data)

            if (result.error) toast.error(result.error)
            else {
                toast.success("Content revised successfully!");
                setFeedback("");
            }
        })
    }

    const handleAdaptPersona = () => {
        if (!personasText.trim()) return;
        startPersonaTransition(async () => {
            const data = { originalContent: contentGenerated, personasText, uploadedPersonaFileData, modelAlias, temperature: base.creativityValue };
            const result = await adaptPersonaForSession(initialData.id, data);
            if (result.error) toast.error(result.error);
            else {
                toast.success("Persona adapted successfully!");
                setPersonasText("");
                setUploadedPersonaFileData(null);
            }
        });
    };

    const handleImageAction = (newPrompt: string) => {
        startImageTransition(async () => {
            try {
                const formData = new FormData();
                formData.append("prompt", newPrompt);
                let reference_image_url: any = null;
                if (imageReferenceFile) {
                    reference_image_url = await uploadImageToSupabase(imageReferenceFile);
                    formData.append("imageUrl", reference_image_url);
                }

                const result = await generateImageAction(formData);

                if (result.success && result.imageUrl) {
                    toast.success("Preparing Image...");
                    const newImageUrls = [...imageUrls, result.imageUrl];

                    await manageImageForSession(initialData.id, {
                        reference_image: reference_image_url,
                        imagePrompt: newPrompt,
                        imageUrls: newImageUrls,
                        imageReferenceFileInfo: { ...imageReferenceFileInfo, reference_image_url: reference_image_url },
                    });

                    toast.success("Image Generated successfully!");
                } else {
                    toast.error(result.error || "Failed to generate image.");
                }
            } catch (error) {
                console.error("Unexpected error occurred.", error);
                toast.error("Unexpected error occurred.");
            }
        });
    };

    const handleChatSend = async (userInput: string) => {
        setIsChatLoading(true);

        const userMessage = { role: 'user', content: userInput };
        const newHistory = [...chatHistory, userMessage];
        setChatHistory(newHistory);

        const systemPrompt = getChatSystemPrompt({
            originalContent: contentGenerated,
            conversationHistory: newHistory.map(m => `${m.role}: ${m.content}`).join('\n'),
            uploadedFileText: chatFilesData,
            knowledgeBaseContent,
        });

        const result = await generateNewContent({ modelAlias, temperature: base.creativityValue, systemPrompt, userPrompt: userInput });

        const assistantMessage = { role: 'assistant', content: result.generatedText || "Sorry, an error occurred." };
        const finalHistory = [...newHistory, assistantMessage];
        setChatHistory(finalHistory);

        setIsChatLoading(false);

        await updateChatForSession(initialData.id, {
            chatHistory: finalHistory,
            chatFileInfos: chatFileInfos,
            chatFilesData: chatFilesData,
        });
    };

    const handleImageFileChange = (file: File | null) => {
        setImageReferenceFile(file);
        if (file) {
            setImageReferenceFileInfo({ name: file.name, size: file.size });
        } else {
            setImageReferenceFileInfo(null);
        }
    };

    const handleChatFileChange = ({ fileInfos, parsedText }: any) => {
        setChatFileInfos(fileInfos || []);
        setChatFilesData(parsedText || null);
    };

    return {
        isPending,
        isContentPending,
        isPersonaPending,
        isImagePending,
        selectedModel: base.selectedModel,
        setSelectedModel: base.setSelectedModel,
        selectedAudiences, setSelectedAudiences,
        selectedSubjects, setSelectedSubjects,
        selectedContentTypes, setSelectedContentTypes,
        isSocialPostSelected,
        selectedSocialPlatform, setSelectedSocialPlatform,
        selectedCtas, setSelectedCtas,
        referenceFileInfos: base.referenceFileInfos,
        handleReferenceFileChange: base.handleReferenceFileChange,
        additionalInstructions: base.additionalInstructions,
        setAdditionalInstructions: base.setAdditionalInstructions,
        contextualAwareness: base.contextualAwareness,
        setContextualAwareness: base.setContextualAwareness,
        toneValue: base.toneValue,
        setToneValue: base.setToneValue,
        creativityValue: base.creativityValue,
        setCreativityValue: base.setCreativityValue,
        isGenerateDisabled,
        handleGenerate,
        handleRevise,
        handleAdaptPersona,
        handleImageAction,
        handleImageFileChange,
        imageReferenceFileInfo,
        handleChatSend,
        isChatLoading,
        handleChatFileChange,
        chatFileInfos,
        contentGenerated,
        imagePrompt,
        personaContent,
        imageUrls,
        chatHistory,
        feedback, setFeedback,
        personasText, setPersonasText,
        uploadedPersonaFileData, setUploadedPersonaFileData,
        modelAlias,
    }
}