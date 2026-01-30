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
import { RiChatSmileAiLine, RiVoiceAiLine, RiUserVoiceLine } from "react-icons/ri"

const AI_MODELS = ["AI Chat", "AI Ask", "Genrate TTS"] as const
type AIModel = typeof AI_MODELS[number]

const MODEL_ICONS: Record<AIModel, React.ReactNode> = {
    "AI Chat": <RiChatSmileAiLine />,
    "AI Ask": <RiVoiceAiLine />,
    "Genrate TTS": <RiUserVoiceLine />,
}

type AiModelSelectorProps = {
    selectedModel: string
    onModelChange: (model: string) => void
}

export default function AiModelSelector({ selectedModel, onModelChange }: AiModelSelectorProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-1 h-8 px-3 text-xs rounded-md focus-visible:ring-1 focus-visible:ring-offset-0"
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
            </DropdownMenuTrigger>
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
