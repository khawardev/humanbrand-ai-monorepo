"use client"

import { ArrowRight } from "lucide-react"
import React, { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useAutoResizeTextarea } from "@/hooks/useAutoResizeTextarea"
import { useKnowledgeBaseChat } from "@/hooks/aiagHooks/useKnowledgeBaseChat"
import Gemini_Live_AIAG from "@/components/GeminiAPIComponents/gemini-live-app-shared/GeminiLiveAiag"
import { ScrollArea } from "../../ui/scroll-area"
import AiChatView from "./AiChatView"
import { useTTS, TTSContent } from "./AiTTSView"
import AiModelSelector from "./AiModelSelector"

type AI_PromptProps = {
    user: any
    initialChatHistory: any[]
}

export default function AiChatPageComponent({ user, initialChatHistory }: AI_PromptProps) {
    const [value, setValue] = useState("")
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 72,
        maxHeight: 300,
    })
    const [selectedModel, setSelectedModel] = useState("AI Chat")

    const { chatHistory, isResponding, handleSendMessage, handleRewriteMessage } = useKnowledgeBaseChat({
        user,
        initialChatHistory,
    })

    const { audioUrl, isTTSLoading, generateAudio } = useTTS(value)

    const handlePrimaryAction = () => {
        if (selectedModel === "AI Chat") {
            handleSendMessage(value)
            setValue("")
            adjustHeight(true)
        } else if (selectedModel === "Genrate TTS") {
            generateAudio()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handlePrimaryAction()
        }
    }

    const isTextareaDisabled = selectedModel === "AI Ask" || isResponding || isTTSLoading
    const isSendButtonDisabled = !value.trim() || isTextareaDisabled

    const getPlaceholder = () => {
        if (isTextareaDisabled) return "Please wait..."
        if (selectedModel === "AI Chat") return "Chat with knowledge base..."
        if (selectedModel === "Genrate TTS") return "Enter text to generate audio..."
        return "Microphone is active for AI Ask"
    }

    const renderContent = () => {
        switch (selectedModel) {
            case "AI Chat":
                return (
                    <AiChatView
                        user={user}
                        chatHistory={chatHistory}
                        isResponding={isResponding}
                        handleRewriteMessage={handleRewriteMessage}
                    />
                )
            case "AI Ask":
                return (
                    <div className="flex flex-col items-center justify-center text-center h-[60vh]">
                        <Gemini_Live_AIAG />
                    </div>
                )
            case "Genrate TTS":
                return <TTSContent audioUrl={audioUrl} isTTSLoading={isTTSLoading} />
            default:
                return null
        }
    }

    return (
        <div className="flex flex-col h-full">
            <ScrollArea className="grow h-[75vh] overflow-y-auto">
                {renderContent()}
            </ScrollArea>

            <div className="relative mt-auto pt-4">
                <Textarea
                    id="ai-input-15"
                    value={value}
                    placeholder={getPlaceholder()}
                    className={cn(
                        "w-full rounded-xl border border-b-0 border-input rounded-b-none px-4 py-3 resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
                        "min-h-[72px]"
                    )}
                    ref={textareaRef}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setValue(e.target.value)
                        adjustHeight()
                    }}
                    disabled={isTextareaDisabled}
                />

                <div className="h-14 bg-input/20 border border-t-0 border-input rounded-b-xl flex items-center px-3">
                    <div className="flex items-center justify-between w-full">
                        <AiModelSelector
                            selectedModel={selectedModel}
                            onModelChange={setSelectedModel}
                        />

                        <button
                            type="button"
                            className={cn(
                                "rounded-lg p-2 bg-black/5 dark:bg-white/5 cursor-pointer",
                                "hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
                                "text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"
                            )}
                            aria-label="Send message"
                            onClick={handlePrimaryAction}
                            disabled={isSendButtonDisabled}
                        >
                            <ArrowRight
                                className={cn(
                                    "w-4 h-4 transition-opacity duration-200",
                                    !isSendButtonDisabled ? "opacity-100" : "opacity-30"
                                )}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}