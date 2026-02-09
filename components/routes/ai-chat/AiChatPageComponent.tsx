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
import AiStrategySelector from "./components/AiStrategySelector"
import AiChatList from "./components/AiChatList"
import GeminiLiveAiag from "@/components/gemini-api/gemini-live-app-shared/GeminiLiveAiag"


type AI_PromptProps = {
    user: any
    initialChatHistory: any[]
    sessionId?: string
}

export default function AiChatPageComponent({ user, initialChatHistory, sessionId }: AI_PromptProps) {
    const [value, setValue] = useState("")
    const [selectedModel, setSelectedModel] = useState("AI Chat")
    const [retrievalStrategy, setRetrievalStrategy] = useState<'full-context' | 'rag'>('rag')

    const { chatHistory, isResponding, handleSendMessage, handleRewriteMessage, handleDeleteMessage, handleEditUserMessage, handleRateMessage } = useKnowledgeBaseChat({
        user,
        initialChatHistory,
        sessionId,
        retrievalStrategy,
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
            // case "AI Ask":
            //     return <GeminiLiveAiag />
            case "AI Audio":
                return <TTSContent audioUrl={audioUrl} isTTSLoading={isTTSLoading} />
            default:
                return null
        }
    }

    const isLoading = isResponding || isTTSLoading

    return (
        <main className="flex h-[86vh] flex-col overflow-hidden">
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
                                    {/* {selectedModel === "AI Chat" && (
                                        <div className="flex items-center gap-2  ml-2">
                                            <AiStrategySelector
                                                selectedStrategy={retrievalStrategy}
                                                onStrategyChange={setRetrievalStrategy}
                                                tooltip="Select Retrieval Strategy"
                                            />
                                        </div>
                                    )} */}
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