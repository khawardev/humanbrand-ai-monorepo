'use client'

import React from "react"
import { Bot, Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { RiVoiceAiLine, RiMic2AiLine, RiChatAiLine } from "react-icons/ri";
import { PromptInputAction } from "@/components/ui/prompt-input"

const AI_MODELS = ["AI Chat", "AI Audio"] as const
// const AI_MODELS = ["AI Chat", "AI Ask", "AI Audio"] as const
type AIModel = typeof AI_MODELS[number]

const MODEL_ICONS: Record<AIModel, React.ReactNode> = {
    "AI Chat": <RiChatAiLine />,
    // "AI Ask": <RiMic2AiLine />,
    "AI Audio": <RiVoiceAiLine />,
}

type AiModelSelectorProps = {
    selectedModel: string
    onModelChange: (model: string) => void
    tooltip?: string
}

export default function AiModelSelector({ selectedModel, onModelChange, tooltip }: AiModelSelectorProps) {
    const triggerButton = (
        <Button
            variant="outline"
            className="rounded-full"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedModel}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2"
                >
                    {MODEL_ICONS[selectedModel as AIModel]}
                    {selectedModel}
                    <ChevronDown className="w-3 h-3 opacity-50" />
                </motion.div>
            </AnimatePresence>
        </Button>
    )

    return (
        <DropdownMenu>
            {tooltip ? (
                <PromptInputAction tooltip={tooltip}>
                    <DropdownMenuTrigger asChild>
                        {triggerButton}
                    </DropdownMenuTrigger>
                </PromptInputAction>
            ) : (
                <DropdownMenuTrigger asChild>
                    {triggerButton}
                </DropdownMenuTrigger>
            )}
            <DropdownMenuContent>
                {AI_MODELS.map((model) => (
                    <DropdownMenuItem
                        key={model}
                        onSelect={() => onModelChange(model)}
                        className="flex items-center justify-between gap-2"
                    >
                        <div className="flex items-center gap-2">
                            {MODEL_ICONS[model] || <Bot className="w-4 h-4 opacity-50" />}
                            <span>{model}</span>
                        </div>
                        {selectedModel === model && <Check className="w-4 h-4 text-primary" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export { AI_MODELS, MODEL_ICONS }
export type { AIModel }
