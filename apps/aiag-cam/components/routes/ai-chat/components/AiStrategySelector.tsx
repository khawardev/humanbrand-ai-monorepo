'use client'

import React from "react"
import { Check, ChevronDown, Database, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { PromptInputAction } from "@/components/ui/prompt-input"

export type RetrievalStrategy = 'full-context' | 'rag'

const STRATEGIES: { value: RetrievalStrategy; label: string; icon: React.ReactNode }[] = [
    { 
        value: 'full-context', 
        label: 'Full Context', 
        icon: <FileText className="w-4 h-4" /> 
    },
    { 
        value: 'rag', 
        label: 'Vector Chat', 
        icon: <Database className="w-4 h-4" /> 
    },
]

type AiStrategySelectorProps = {
    selectedStrategy: RetrievalStrategy
    onStrategyChange: (strategy: RetrievalStrategy) => void
    tooltip?: string
}

export default function AiStrategySelector({ selectedStrategy, onStrategyChange, tooltip }: AiStrategySelectorProps) {
    const activeStrategy = STRATEGIES.find(s => s.value === selectedStrategy) || STRATEGIES[0]!

    const triggerButton = (
        <Button
            variant="outline"
            className="rounded-full px-3"
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedStrategy}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-2"
                >
                    {activeStrategy.icon}
                    <span className="text-sm font-medium">{activeStrategy.label}</span>
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
                {STRATEGIES.map((strategy) => (
                    <DropdownMenuItem
                        key={strategy.value}
                        onSelect={() => onStrategyChange(strategy.value)}
                        className="flex items-center justify-between gap-2 cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            {strategy.icon}
                            <span>{strategy.label}</span>
                        </div>
                        {selectedStrategy === strategy.value && <Check className="w-4 h-4 text-primary" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
