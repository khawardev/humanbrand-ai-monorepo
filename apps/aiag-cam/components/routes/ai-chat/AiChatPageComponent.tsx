"use client"

import {
    PromptInput,
    PromptInputAction,
    PromptInputActions,
    PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"
import { useState, useCallback } from "react"
import { FaStop } from "react-icons/fa6"
import { useAiChat } from "@/hooks/aiagHooks/useAiChat"
import { useTTS, TTSContent } from "./components/AiTTSView"
import AiChatList from "./components/AiChatList"
import { ModelsSection } from "@/components/shared/selections/ModelsSection"
import AiModeSelector from "./components/AiModeSelector"
import { updateUserPreferredModel } from "@/server/actions/usersActions"
import { toast } from "sonner"
import { AiInputAttachmentPreview, AiInputAttachmentTrigger, useAiChatAttachments } from "./components/AiChatInputAttachments"

type AiChatPageProps = {
    user: any
    initialChatHistory: any[]
    sessionId?: string
}

export default function AiChatPageComponent({ user, initialChatHistory, sessionId }: AiChatPageProps) {
    const [value, setValue] = useState("")
    const [selectedMode, setSelectedMode] = useState("AI Chat")
    const [aiModelId, setAiModelId] = useState(user?.preferredModel || 2)

    const {
        imageAttachments,
        fileAttachments,
        isParsingFiles,
        imageInputRef,
        fileInputRef,
        handleImageSelect,
        handleFileSelect,
        removeImageAttachment,
        removeFileAttachment,
        clearAttachments,
        getCombinedFileText,
    } = useAiChatAttachments()

    const {
        chatHistory,
        isResponding,
        handleSendMessage,
        handleRewriteMessage,
        handleDeleteMessage,
        handleEditUserMessage,
        handleRateMessage
    } = useAiChat({
        user,
        initialChatHistory,
        sessionId,
        retrievalStrategy: 'rag',
    })

    const { audioUrl, isTTSLoading, generateAudio } = useTTS(value)

    const handleModelChange = useCallback(async (value: number) => {
        setAiModelId(value);
        if (user?.id) {
            const result = await updateUserPreferredModel(user.id, value);
            if (!result.success) {
                toast.error("Failed to save model preference");
            }
        }
    }, [user?.id]);

    const isLoading = isResponding || isTTSLoading

    const hasAttachments = imageAttachments.length > 0 || fileAttachments.length > 0

    const canSubmit = selectedMode === "AI Chat"
        ? (value.trim() || hasAttachments) && !isLoading && !isParsingFiles
        : value.trim() && !isLoading

    const handleSubmit = useCallback(() => {
        if (selectedMode === "AI Chat") {
            if ((!value.trim() && !hasAttachments) || isLoading || isParsingFiles) return
            const fileText = getCombinedFileText()
            handleSendMessage(value, imageAttachments.map(a => a.file), fileText || undefined)
            setValue("")
            clearAttachments()
        } else if (selectedMode === "AI Audio") {
            if (!value.trim() || isLoading) return
            generateAudio()
        }
    }, [selectedMode, value, imageAttachments, hasAttachments, isLoading, isParsingFiles, handleSendMessage, clearAttachments, getCombinedFileText, generateAudio])

    return (
        <main className="flex h-[86vh] flex-col overflow-hidden">
            <div className="relative flex-1 overflow-hidden">
                {selectedMode === "AI Chat" ? (
                    <AiChatList
                        user={user}
                        chatHistory={chatHistory}
                        isResponding={isResponding}
                        handleRewriteMessage={handleRewriteMessage}
                        handleDeleteMessage={handleDeleteMessage}
                        handleEditUserMessage={handleEditUserMessage}
                        handleRateMessage={handleRateMessage}
                    />
                ) : selectedMode === "AI Audio" ? (
                    <TTSContent audioUrl={audioUrl} isTTSLoading={isTTSLoading} />
                ) : null}
            </div>

            <div className="z-10 shrink-0 px-3 pb-3 md:px-5 md:pb-5">
                <div className="mx-auto max-w-4xl">
                    <PromptInput
                        isLoading={isLoading}
                        value={value}
                        onValueChange={setValue}
                        onSubmit={handleSubmit}
                        disabled={isLoading}
                    >
                        <div className="flex flex-col">
                            <AiInputAttachmentPreview
                                imageAttachments={imageAttachments}
                                fileAttachments={fileAttachments}
                                onRemoveImage={removeImageAttachment}
                                onRemoveFile={removeFileAttachment}
                            />

                            <PromptInputTextarea
                                placeholder={
                                    selectedMode === "AI Ask"
                                        ? "Microphone is active. Speak your question"
                                        : selectedMode === "AI Audio"
                                        ? "Enter text to generate high-quality audio"
                                        : "Message AIAG Assistant"
                                }
                                className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3]"
                                disabled={selectedMode === "AI Ask"}
                                autoFocus
                            />

                            <PromptInputActions className="mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3">
                                <div className="flex items-center">
                                    <PromptInputAction tooltip="Upload Image or File">
                                        <AiInputAttachmentTrigger
                                            imageInputRef={imageInputRef}
                                            fileInputRef={fileInputRef}
                                            handleImageSelect={handleImageSelect}
                                            handleFileSelect={handleFileSelect}
                                            disabled={isLoading}
                                            isParsingFiles={isParsingFiles}
                                        />
                                    </PromptInputAction>

                                    {selectedMode === "AI Chat" && (
                                        <ModelsSection
                                            selectedValue={aiModelId}
                                            onValueChange={handleModelChange}
                                            title="AI Model"
                                            variant="minimal"
                                            tooltip="Select AI Model"
                                        />
                                    )}

                                    <AiModeSelector
                                        selectedModel={selectedMode}
                                        onModelChange={setSelectedMode}
                                        tooltip="Select Mode"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        size="icon"
                                        disabled={!canSubmit}
                                        onClick={handleSubmit}
                                        className="size-9 rounded-full"
                                    >
                                        {!isLoading ? (
                                            <ArrowUp size={18} />
                                        ) : (
                                            <FaStop size={18} />
                                        )}
                                    </Button>
                                </div>
                            </PromptInputActions>
                        </div>
                    </PromptInput>
                </div>
            </div>
        </main>
    )
}