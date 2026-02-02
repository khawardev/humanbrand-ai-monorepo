"use client"

import React, { useState, useRef, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import {
    ChatContainerContent,
    ChatContainerRoot,
} from "@/components/ui/chat-container"
import {
    Message,
    MessageAction,
    MessageActions,
    MessageContent,
} from "@/components/ui/message"
import Image from "next/image"
import { ScrollButton } from "@/components/ui/scroll-button"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn, stripMarkdownBold } from "@/lib/utils"
import {
    Copy,
    Pencil,
    ThumbsDown,
    ThumbsUp,
    Trash,
    Check,
    ArrowUp
} from "lucide-react"
import { toast } from "sonner"
import RewriteInput from "./RewriteInput"

interface AiChatListProps {
    user: any
    chatHistory: any[]
    isResponding: boolean
    handleRewriteMessage: (messageIndex: number, originalContent: string, selectedText: string, rewritePrompt: string) => Promise<void>
    handleDeleteMessage: (messageIndex: number) => Promise<void>
    handleEditUserMessage: (messageIndex: number, newContent: string) => Promise<void>
    handleRateMessage: (messageIndex: number, feedback: 'up' | 'down' | null) => Promise<void>
}

type RewriteState = {
    text: string
    messageIndex: number
} | null

const AiChatList = ({ user, chatHistory, isResponding, handleRewriteMessage, handleDeleteMessage, handleEditUserMessage, handleRateMessage }: AiChatListProps) => {
    const [rewriteState, setRewriteState] = useState<RewriteState>(null)
    const [activeRewriteMessageIndex, setActiveRewriteMessageIndex] = useState<number | null>(null)

    const handleSelection = (messageIndex: number) => {
        if (activeRewriteMessageIndex !== messageIndex) return;

        const selection = window.getSelection()
        const selectedText = selection?.toString().trim()

        if (selectedText && selection && selectedText.length > 0) {
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
        setActiveRewriteMessageIndex(null) // Turn off rewrite mode after submission
    }

    const toggleRewriteMode = (index: number) => {
        const isActive = activeRewriteMessageIndex === index
        if (!isActive) {
             toast("Rewrite mode enabled", {
                 description: "Select the specific text you want to rewrite within the message.",
                 duration: 4000
             })
             setActiveRewriteMessageIndex(index)
        } else {
             setActiveRewriteMessageIndex(null)
        }
    }

    return (
        <ChatContainerRoot className="h-full">
            <ChatContainerContent className="space-y-0 py-12">
                {rewriteState && (
                    <RewriteInput
                        open={!!rewriteState}
                        onOpenChange={(open) => {
                            if (!open) setRewriteState(null)
                        }}
                        selectedText={rewriteState.text}
                        onSubmit={submitRewrite}
                    />
                )}

                {chatHistory.map((message: any, index: number) => {
                    const isLastMessage = index === chatHistory.length - 1;
                    
                    if (message.role === 'assistant') {
                        return (
                            <AssistantMessage
                                key={index}
                                message={message}
                                index={index}
                                isLastMessage={isLastMessage}
                                isRewriteActive={activeRewriteMessageIndex === index}
                                onToggleRewrite={() => toggleRewriteMode(index)}
                                onSelection={() => handleSelection(index)}
                                onRate={(feedback) => handleRateMessage(index, feedback)}
                            />
                        )
                    } else {
                         return (
                             <UserMessage
                                 key={index}
                                 user={user}
                                 message={message}
                                 index={index}
                                 isLastMessage={isLastMessage}
                                 onDelete={() => handleDeleteMessage(index)}
                                 onEdit={(newContent) => handleEditUserMessage(index, newContent)}
                             />
                         )
                    }
                })}

                {isResponding && (
                    <Message className="mx-auto mt-3 flex w-full max-w-4xl gap-4 px-6 items-start">
                        <Image
                            className="h-9 w-9 border object-cover rounded-full mt-0.5"
                            src="https://i.postimg.cc/ZYDgZQyF/aiag-logo.jpg"
                            alt="Assistant Avatar"
                            width={36}
                            height={36}
                        />
                        <div className="flex w-full flex-col gap-2">
                            <Skeleton className="h-4 w-3/4 rounded-full" />
                            <Skeleton className="h-4 w-1/2 rounded-full" />
                        </div>
                    </Message>
                )}
            </ChatContainerContent>
            <div className="absolute bottom-4 left-1/2 flex w-full max-w-4xl -translate-x-1/2 justify-end px-5">
                <ScrollButton variant="secondary" className="shadow-sm border" />
            </div>
        </ChatContainerRoot>
    )
}

export default AiChatList


interface AssistantMessageProps {
    message: any
    index: number
    isLastMessage: boolean
    isRewriteActive: boolean
    onToggleRewrite: () => void
    onSelection: () => void
    onRate: (feedback: 'up' | 'down' | null) => void
}

const AssistantMessage = ({ message, index, isLastMessage, isRewriteActive, onToggleRewrite, onSelection, onRate }: AssistantMessageProps) => {
    const [isCopied, setIsCopied] = useState(false)

    const handleCopyMessage = (content: string) => {
        navigator.clipboard.writeText(stripMarkdownBold(content))
        setIsCopied(true)
        toast.success("Copied to clipboard")
        setTimeout(() => setIsCopied(false), 2000)
    }

    // Helper to handle mouse up. We check if text is selected.
    const handleMouseUp = () => {
        if (!isRewriteActive) return
        onSelection()
    }

    const toggleRate = (type: 'up' | 'down') => {
        if (message.feedback === type) {
            onRate(null) // untoggle
        } else {
            onRate(type)
        }
    }

    return (
        <Message className="mx-auto flex w-full max-w-4xl gap-4 px-6 items-start">
            <Image
                className="h-9 w-9 border object-cover rounded-full mt-0.5"
                src="https://i.postimg.cc/ZYDgZQyF/aiag-logo.jpg"
                alt="Assistant Avatar"
                width={36}
                height={36}
            />
            <div className="flex flex-col gap-2 w-full min-w-0">
                <div className="group flex w-full flex-col gap-0 select-text">
                    <div
                        onMouseUp={handleMouseUp}
                        className={cn(
                            "rounded-lg transition-all border-2 border-transparent select-text", 
                            isRewriteActive && "cursor-text border-primary/20 bg-muted/20 p-2 -m-2 shadow-sm"
                        )}
                    >
                        <MessageContent
                            className="w-full space-y-6 flex-1 rounded-lg flex-col [&_p]:text-base! [&_li]:text-base! bg-transparent p-0 select-text"
                            markdown
                        >
                            {message.content}
                        </MessageContent>
                    </div>

                    <MessageActions
                        className={cn(
                            "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                            (isLastMessage || isRewriteActive) && "opacity-100"
                        )}
                    >
                        <MessageAction tooltip="Copy" delayDuration={100}>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCopyMessage(message.content)}
                            >
                                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </MessageAction>

                        <MessageAction tooltip={isRewriteActive ? "Disable Rewrite" : "Enable Rewrite"} delayDuration={100}>
                            <Button
                                variant={isRewriteActive ? "secondary" : "ghost"}
                                size="icon"
                                onClick={onToggleRewrite}
                                className={cn(isRewriteActive && "bg-secondary text-secondary-foreground")}
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </MessageAction>

                        <MessageAction tooltip="Upvote" delayDuration={100}>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleRate('up')}
                                className={cn(message.feedback === 'up' && "text-foreground")}
                            >
                                <ThumbsUp className={cn("w-4 h-4", message.feedback === 'up' && "fill-current")} />
                            </Button>
                        </MessageAction>
                        <MessageAction tooltip="Downvote" delayDuration={100}>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleRate('down')}
                                 className={cn(message.feedback === 'down' && "text-destructive")}
                            >
                                <ThumbsDown className={cn("w-4 h-4", message.feedback === 'down' && "fill-current")} />
                            </Button>
                        </MessageAction>
                    </MessageActions>
                </div>
            </div>
        </Message>
    )
}

interface UserMessageProps {
    user: any
    message: any
    index: number
    isLastMessage: boolean
    onDelete: () => void
    onEdit: (newContent: string) => void
}

const UserMessage = ({ user, message, index, isLastMessage, onDelete, onEdit }: UserMessageProps) => {
    const [isCopied, setIsCopied] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(message.content)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        setEditContent(message.content)
    }, [message.content])

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            textareaRef.current.focus();
        }
    }, [isEditing])

    const handleCopyMessage = (content: string) => {
        navigator.clipboard.writeText(stripMarkdownBold(content))
        setIsCopied(true)
        toast.success("Copied to clipboard")
        setTimeout(() => setIsCopied(false), 2000)
    }

    const handleSaveEdit = () => {
         if (editContent.trim() !== message.content) {
             onEdit(editContent)
         }
         setIsEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSaveEdit()
        }
        if (e.key === 'Escape') {
            setIsEditing(false)
            setEditContent(message.content)
        }
    }
    
    // Auto-resize textarea
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setEditContent(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    }

    const handleDeleteClick = () => {
        toast("Delete Message", {
            description: "Are you sure you want to delete this message?",
            action: {
                label: "Delete",
                onClick: onDelete
            }
        })
    }

    return (
        <Message className="mx-auto flex w-full max-w-4xl gap-4 px-6 items-start flex-row-reverse">
             <Image
                className="h-9 w-9 border object-cover rounded-full mt-0.5"
                src={user?.image || '/default-user.png'}
                alt="User Avatar"
                width={36}
                height={36}
            />
            <div className="flex flex-col gap-2 w-full min-w-0 items-end">
                <div className="group flex flex-col items-end gap-1 w-full relative">
                    <div className={cn(
                        "max-w-[85%] rounded-3xl sm:max-w-[75%]", 
                        isEditing ? "w-full bg-muted/50 p-2" : "bg-muted px-5 py-2.5"
                    )}>
                        {isEditing ? (
                            <div className="relative w-full">
                                <Textarea
                                    ref={textareaRef}
                                    value={editContent}
                                    onChange={handleInput}
                                    onKeyDown={handleKeyDown}
                                    className="min-h-[40px] w-full resize-none border-0 shadow-none bg-transparent p-0 text-base focus-visible:ring-0 leading-relaxed"
                                />
                                <div className="mt-2 flex justify-end gap-2">
                                    <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => {
                                        setIsEditing(false)
                                        setEditContent(message.content) // Reset
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button size="sm" className="h-7 px-2" onClick={handleSaveEdit}>
                                        <ArrowUp /> Save
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <MessageContent className="bg-transparent p-0 m-0">
                                {message.content}
                            </MessageContent>
                        )}
                    </div>

                    {!isEditing && (
                        <MessageActions
                            className={cn(
                                "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                            )}
                        >
                            <MessageAction tooltip="Copy" delayDuration={100}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleCopyMessage(message.content)}
                                >
                                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </MessageAction>
                            <MessageAction tooltip="Edit" delayDuration={100}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                            </MessageAction>
                            <MessageAction tooltip="Delete" delayDuration={100}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleDeleteClick}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </MessageAction>
                        </MessageActions>
                    )}
                </div>
            </div>
        </Message>
    )
}
