'use client'

import { Check, Copy } from "lucide-react"
import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { stripMarkdownBold } from "@/lib/utils"
import RewriteInput from "./RewriteInput"

type RewriteState = {
    text: string
    messageIndex: number
} | null

type AiChatViewProps = {
    user: any
    chatHistory: any[]
    isResponding: boolean
    handleRewriteMessage: (messageIndex: number, originalContent: string, selectedText: string, rewritePrompt: string) => Promise<void>
}

export default function AiChatView({ user, chatHistory, isResponding, handleRewriteMessage }: AiChatViewProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [rewriteState, setRewriteState] = useState<RewriteState>(null)
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView()
    }, [chatHistory, isResponding])

    const handleSelection = (messageIndex: number) => {
        const selection = window.getSelection()
        const selectedText = selection?.toString().trim()

        if (selectedText && selection) {
            setRewriteState({
                text: selectedText,
                messageIndex,
            })
        }
    }

    const submitRewrite = async (rewritePrompt: string) => {
        if (!rewriteState) return

        const { messageIndex, text: selectedText } = rewriteState
        const originalContent = chatHistory[messageIndex]?.content

        if (originalContent) {
            await handleRewriteMessage(messageIndex, originalContent, selectedText, rewritePrompt)
        }

        setRewriteState(null)
    }

    const handleCopyMessage = (content: string, index: number) => {
        navigator.clipboard.writeText(stripMarkdownBold(content))
        setCopiedIndex(index)
        toast.success("Copied to clipboard")
        setTimeout(() => setCopiedIndex(null), 1500)
    }

    return (
        <div className="flex flex-col flex-1 overflow-y-auto space-y-4">
            {rewriteState && (
                <RewriteInput
                    open={!!rewriteState}
                    onOpenChange={() => setRewriteState(null)}
                    selectedText={rewriteState.text}
                    onSubmit={submitRewrite}
                />
            )}

            {chatHistory.map((msg: any, index: number) => (
                <div key={index} className="flex items-start gap-3 w-full group">
                    <Image
                        src={
                            msg.role === 'user'
                                ? (user?.image || '/default-user.png')
                                : 'https://i.postimg.cc/ZYDgZQyF/aiag-logo.jpg'
                        }
                        alt={`${msg.role} avatar`}
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-md border-2 object-cover mt-1"
                    />

                    <div
                        className={`relative w-full p-3 rounded-lg group ${msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-black/5 dark:bg-white/5'
                            }`}
                        onMouseUp={msg.role === 'assistant' ? () => handleSelection(index) : undefined}
                    >
                        <div className="markdown-body space-y-1 text-[15px]">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>

                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleCopyMessage(msg.content, index)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            {copiedIndex === index ? (
                                <Check className="w-3 h-3" />
                            ) : (
                                <Copy className="w-3 h-3" />
                            )}
                        </Button>
                    </div>
                </div>
            ))}

            {isResponding && (
                <div className="flex items-start gap-2 my-2">
                    <Image
                        src="https://i.postimg.cc/ZYDgZQyF/aiag-logo.jpg"
                        alt="assistant avatar"
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-md object-cover mt-1"
                    />
                    <div className='w-full space-y-2 px-2 rounded-lg'>
                        <Skeleton className='w-[30%] h-4 bg-muted-foreground/20' />
                        <Skeleton className='w-[70%] h-4 bg-muted-foreground/20' />
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    )
}
