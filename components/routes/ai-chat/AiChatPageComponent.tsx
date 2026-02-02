"use client"

import {
    PromptInput,
    PromptInputAction,
    PromptInputActions,
    PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { Button } from "@/components/ui/button"
import {
    ArrowUp,
} from "lucide-react"
import { useState } from "react"
import { FaStop } from "react-icons/fa6"
import { useKnowledgeBaseChat } from "@/hooks/aiagHooks/useKnowledgeBaseChat"
import { useTTS, TTSContent } from "./components/AiTTSView"
import AiModelSelector from "./components/AiModelSelector"
import AiChatList from "./components/AiChatList"
import GeminiLiveAiag from "@/components/gemini-api/gemini-live-app-shared/GeminiLiveAiag"
import { RiChatAiLine } from "react-icons/ri";

type AI_PromptProps = {
    user: any
    initialChatHistory: any[]
    sessionId?: string
}

export default function AiChatPageComponent({ user, initialChatHistory, sessionId }: AI_PromptProps) {
    const [value, setValue] = useState("")
    const [selectedModel, setSelectedModel] = useState("AI Chat")

    const { chatHistory, isResponding, handleSendMessage, handleRewriteMessage, handleDeleteMessage, handleEditUserMessage, handleRateMessage } = useKnowledgeBaseChat({
        user,
        initialChatHistory,
        sessionId,
    })

    const { audioUrl, isTTSLoading, generateAudio } = useTTS(value)

    const handlePrimaryAction = () => {
        if (!value.trim() && selectedModel === "AI Chat") return

        if (selectedModel === "AI Chat") {
            handleSendMessage(value)
            setValue("")
        } else if (selectedModel === "AI Audio") {
            generateAudio()
        }
    }

    const renderContent = () => {
        switch (selectedModel) {
            case "AI Chat":
                return <AiChatList
                    user={user}
                    chatHistory={chatHistory}
                    isResponding={isResponding}
                    handleRewriteMessage={handleRewriteMessage}
                    handleDeleteMessage={handleDeleteMessage}
                    handleEditUserMessage={handleEditUserMessage}
                    handleRateMessage={handleRateMessage}
                />
            case "AI Ask":
                return <GeminiLiveAiag />
            case "AI Audio":
                return <TTSContent audioUrl={audioUrl} isTTSLoading={isTTSLoading} />
            default:
                return null
        }
    }

    const isLoading = isResponding || isTTSLoading

    return (
        <main className="flex h-[86vh] flex-col overflow-hidden">
            {chatHistory.length === 0 && selectedModel === "AI Chat" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <div className="flex flex-col items-center text-xl gap-2 text-muted-foreground">
                        <RiChatAiLine className="w-12 h-12" />
                        <span className="font-medium">Ask Anything</span>
                    </div>
                </div>
            )}
            <div className="relative flex-1 overflow-hidden">
                {renderContent()}
            </div>

            <div className="z-10 shrink-0 px-3 pb-3 md:px-5 md:pb-5">
                <div className="mx-auto max-w-4xl">
                    <PromptInput
                        isLoading={isLoading}
                        value={value}
                        onValueChange={setValue}
                        onSubmit={handlePrimaryAction}
                        disabled={isLoading}
                    >
                        <div className="flex flex-col">
                            <PromptInputTextarea
                                placeholder={
                                    selectedModel === "AI Ask"
                                        ? "Microphone is active for AI Ask"
                                        : "Ask anything"
                                }
                                className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3]"
                                disabled={selectedModel === "AI Ask"}
                            />

                            <PromptInputActions className="mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3">
                                <div className="flex items-center gap-2">
                                    <AiModelSelector
                                        selectedModel={selectedModel}
                                        onModelChange={setSelectedModel}
                                        tooltip="Select a Mode"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="icon"
                                        disabled={!value.trim() || isLoading}
                                        onClick={handlePrimaryAction}
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