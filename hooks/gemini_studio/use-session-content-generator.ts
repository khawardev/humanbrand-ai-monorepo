'use client'

import { useState, useEffect, useTransition } from "react"
import { toast } from "sonner"
import { contentTypes, modelTabs } from "@/config/form-data"
import { updateSessionContent, adaptPersonaForSession, manageImageForSession, updateChatForSession } from "@/actions/saved-session-actions"
import { generateImageAction } from "@/actions/generate-image-actions"
import { generateNewContent } from "@/actions/generate-new-content-actions"
import { getChatSystemPrompt } from "@/lib/aiag/prompts"
import { knowledgeBaseContent } from "@/lib/aiag/knowledge_base"
import { uploadImageToSupabase } from "@/lib/uploadImageToSupabase"

export function useSessionContentGenerator(initialData: any) {
    const [isContentPending, startContentTransition] = useTransition();
    const [isPersonaPending, startPersonaTransition] = useTransition();
    const [isImagePending, startImageTransition] = useTransition();

    const isPending = isContentPending || isPersonaPending || isImagePending;

    const [selectedModel, setSelectedModel] = useState<number>(initialData.modelId ?? 1)
    const [selectedAudiences, setSelectedAudiences] = useState<number[]>(initialData.audienceIds ?? [])
    const [selectedSubjects, setSelectedSubjects] = useState<number | null>(initialData.subjectId ?? null)
    const [selectedContentTypes, setSelectedContentTypes] = useState<number[]>(initialData.contentTypeIds ?? [])
    const [selectedCtas, setSelectedCtas] = useState<number[]>(initialData.ctaIds ?? [])
    const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<number | null>(initialData.socialPlatformId ?? null)

    const [referencePdfInfo, setReferencePdfInfo] = useState<any>(initialData.referencePdfInfo ?? null)
    const [referencePdfData, setReferencePdfData] = useState<string | null>(initialData.referencePdfData ?? null)

    const [additionalInstructions, setAdditionalInstructions] = useState(initialData.additionalInstructions ?? "")
    const [contextualAwareness, setContextualAwareness] = useState(initialData.contextualAwareness ?? "")
    const [toneValue, setToneValue] = useState<number>(initialData.tone ?? 3)
    const [creativityValue, setCreativityValue] = useState<number>(Number(initialData.temperature ?? 0.7))

    const [contentGenerated, setContentGenerated] = useState<string>(initialData.generatedContent ?? "")
    const [imagePrompt, setImagePrompt] = useState<string>(initialData.imagePrompt ?? "")
    const [personaContent, setPersonaContent] = useState<string>(initialData.personaContent ?? "")
    const [imageUrls, setImageUrls] = useState<string[]>(initialData.imageUrls ?? [])

    const [imageReferenceFile, setImageReferenceFile] = useState<File | null>(null);
    const [imageReferenceFileInfo, setImageReferenceFileInfo] = useState<any>(initialData.imageReferenceFileInfo ?? null);

    const [chatHistory, setChatHistory] = useState<any[]>(initialData.chatHistory ?? [])
    const [chatPdfInfo, setChatPdfInfo] = useState<any>(initialData.chatPdfInfo ?? null);
    const [chatPdfData, setChatPdfData] = useState<string | null>(initialData.chatPdfData ?? null);

    const [feedback, setFeedback] = useState("")
    const [personasText, setPersonasText] = useState("")
    const [uploadedPersonaFileData, setUploadedPersonaFileData] = useState<any>(null)

    const [isChatLoading, setIsChatLoading] = useState(false);

    const modelAlias = modelTabs.find(tab => tab.id === selectedModel)?.label

    useEffect(() => {
        setContentGenerated(initialData.generatedContent ?? "");
        setImagePrompt(initialData.imagePrompt ?? "");
        setPersonaContent(initialData.personaContent ?? "");
        setImageUrls(initialData.imageUrls ?? []);
        setChatHistory(initialData.chatHistory ?? []);
        setReferencePdfInfo(initialData.referencePdfInfo ?? null);
        setReferencePdfData(initialData.referencePdfData ?? null);
        setImageReferenceFileInfo(initialData.imageReferenceFileInfo ?? null);
        setChatPdfInfo(initialData.chatPdfInfo ?? null);
        setChatPdfData(initialData.chatPdfData ?? null);
    }, [initialData]);

    const socialPostContentTypeId = contentTypes.find(type => type.label === "Social Media Post")?.id
    const isSocialPostSelected = socialPostContentTypeId !== undefined && selectedContentTypes.includes(socialPostContentTypeId)

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
        originalContent: contentGenerated,
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
        if (isGenerateDisabled || !feedback) return
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
            const data = { originalContent: contentGenerated, personasText, uploadedPersonaFileData, modelAlias, temperature: creativityValue };
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
                toast.error("Unexpected error occurred.");
                console.error(error);
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
            uploadedFileText: chatPdfData,
            knowledgeBaseContent,
        });

        const result = await generateNewContent({ modelAlias, temperature: creativityValue, systemPrompt, userPrompt: userInput });

        const assistantMessage = { role: 'assistant', content: result.generatedText || "Sorry, an error occurred." };
        const finalHistory = [...newHistory, assistantMessage];
        setChatHistory(finalHistory);

        setIsChatLoading(false);

        await updateChatForSession(initialData.id, {
            chatHistory: finalHistory,
            chatPdfInfo: chatPdfInfo,
            chatPdfData: chatPdfData,
        });

    };

    const handleReferenceFileChange = ({ file, parsedText }: any) => {
        if (file) {
            setReferencePdfInfo({ name: file.name, size: file.size });
            setReferencePdfData(parsedText);
        } else {
            setReferencePdfInfo(null);
            setReferencePdfData(null);
        }
    };

    const handleImageFileChange = (file: File | null) => {
        setImageReferenceFile(file);
        if (file) {
            setImageReferenceFileInfo({ name: file.name, size: file.size });
        } else {
            setImageReferenceFileInfo(null);
        }
    };

    const handleChatFileChange = ({ file, parsedText }: any) => {
        if (file) {
            setChatPdfInfo({ name: file.name, size: file.size });
            setChatPdfData(parsedText);
        } else {
            setChatPdfInfo(null);
            setChatPdfData(null);
        }
    };

    return {
        isPending,
        isContentPending,
        isPersonaPending,
        isImagePending,
        selectedModel, setSelectedModel,
        selectedAudiences, setSelectedAudiences,
        selectedSubjects, setSelectedSubjects,
        selectedContentTypes, setSelectedContentTypes,
        isSocialPostSelected,
        selectedSocialPlatform, setSelectedSocialPlatform,
        selectedCtas, setSelectedCtas,

        referencePdfInfo,
        handleReferenceFileChange,

        additionalInstructions, setAdditionalInstructions,
        contextualAwareness, setContextualAwareness,
        toneValue, setToneValue,
        creativityValue, setCreativityValue,
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
        chatPdfInfo,

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