"use client";

import { ArrowRight, Bot, Check, ChevronDown, Speech, Download, Loader2, Copy } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { RiChatSmileAiLine, RiVoiceAiLine } from "react-icons/ri";
import Image from "next/image";
import { useKnowledgeBaseChat } from "@/hooks/aiag_hooks/use-knowledge-base-chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Gemini_Live_AIAG from "@/components/gemini-live-api-components/gemini-live-app-shared/gemini-live-aiag";
import { Skeleton } from "@/components/ui/skeleton";
import RewriteInput from "./Rewrite-Input";
import { toast } from "sonner";

interface AI_PromptProps {
    user: any;
    initialChatHistory: any[];
}

export default function AI_Page({ user, initialChatHistory }: AI_PromptProps) {
    const [value, setValue] = useState("");
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 72,
        maxHeight: 300,
    });
    const [selectedModel, setSelectedModel] = useState("AI Chat");

    const { chatHistory, isResponding, handleSendMessage, handleRewriteMessage } = useKnowledgeBaseChat({ user, initialChatHistory });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isTTSLoading, setTTSLoading] = useState(false);

    const [rewriteState, setRewriteState] = useState<{
        text: string;
        position: { top: number; left: number };
        messageIndex: number;
    } | null>(null);

    const AI_MODELS = ["AI Chat", "AI Ask", "Genrate TTS"];
    const MODEL_ICONS: Record<string, React.ReactNode> = {
        "AI Chat": <RiChatSmileAiLine />,
        "AI Ask": <RiVoiceAiLine />,
        "Genrate TTS": <Speech />,
    };

    useEffect(() => {
        if (selectedModel === "AI Chat") {
            messagesEndRef.current?.scrollIntoView();
        }
    }, [chatHistory, isResponding, selectedModel]);

    const handleSelection = (messageIndex: number) => {
        const selection = window.getSelection();
        const selectedText = selection?.toString().trim();

        if (selectedText && selection) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setRewriteState({
                text: selectedText,
                position: {
                    top: window.scrollY + rect.bottom + 8,
                    left: window.scrollX + rect.left,
                },
                messageIndex: messageIndex,
            });
        }
    };

    const submitRewrite = async (rewritePrompt: string) => {
        if (!rewriteState) return;

        const { messageIndex, text: selectedText } = rewriteState;
        const originalContent = chatHistory[messageIndex]?.content;

        if (originalContent) {
            await handleRewriteMessage(messageIndex, originalContent, selectedText, rewritePrompt);
        }

        setRewriteState(null);
    };

    const generateAudio = async () => {
        if (!value.trim()) return;
        setTTSLoading(true);
        setAudioUrl(null);
        try {
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: value }),
            });

            if (!res.ok) throw new Error("Failed to generate audio");

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
        } catch (error) {
            console.error('Error generating TTS audio:', error);
        } finally {
            setTTSLoading(false);
        }
    };

    const handlePrimaryAction = () => {
        if (selectedModel === "AI Chat") {
            handleSendMessage(value);
            setValue("");
            adjustHeight(true);
        } else if (selectedModel === "Genrate TTS") {
            generateAudio();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handlePrimaryAction();
        }
    };

    const isTextareaDisabled = selectedModel === "AI Ask" || isResponding || isTTSLoading || !!rewriteState;
    const isSendButtonDisabled = !value.trim() || isTextareaDisabled;
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

    const renderContent = () => {
        switch (selectedModel) {
            case "AI Chat":
                return (
                    <div className="flex flex-col flex-1 overflow-y-auto space-y-4">
                        <AnimatePresence>
                            {rewriteState && (
                                <motion.div
                                    key="rewrite-modal"
                                    className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                    >
                                        <RewriteInput
                                            position={rewriteState.position}
                                            selectedText={rewriteState.text}
                                            onSubmit={submitRewrite}
                                            onClose={() => setRewriteState(null)}
                                        />
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        {chatHistory.map((msg: any, index: any) => (
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
                                        onClick={() => {
                                            navigator.clipboard.writeText(msg.content)
                                            setCopiedIndex(index)
                                            toast.success("Copied to clipboard")
                                            setTimeout(() => setCopiedIndex(null), 1500)
                                        }}
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
                                <Image src={'https://i.postimg.cc/ZYDgZQyF/aiag-logo.jpg'} alt="assistant avatar" width={36} height={36} className="w-9 h-9 rounded-md object-cover mt-1" />
                                <div className='w-full space-y-2 px-2 rounded-lg'>
                                    <Skeleton className='w-[30%] h-4 bg-muted-foreground/20' />
                                    <Skeleton className='w-[70%] h-4 bg-muted-foreground/20' />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                );
            case "AI Ask":
                return (
                    <div className="flex flex-col items-center justify-center text-center h-[60vh]">
                        <Gemini_Live_AIAG />
                    </div>
                );
            case "Genrate TTS":
                return (
                    <div className="flex flex-col items-center justify-center text-center h-[60vh]">
                        <div className="p-4 space-y-3 ">
                            {!audioUrl && !isTTSLoading && (
                                <div className="flex items-center text-sm gap-2 text-muted-foreground">
                                    <Speech className="w-4 h-4" />
                                    <span >Generate audio</span>
                                </div>
                            )}

                            {isTTSLoading && (
                                <div className="flex items-center text-sm gap-2 text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span >Generating audio...</span>
                                </div>
                            )}
                            {audioUrl && (
                                <div className="space-y-3 ">
                                    <audio controls src={audioUrl} className="w-[400px]" />
                                    <a href={audioUrl} download="tts-output.wav">
                                        <Button size={'xs'} >
                                            Download
                                        </Button>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className=" flex flex-col h-full">
            <div className="flex-grow overflow-y-auto">
                {renderContent()}
            </div>
            <div className="relative mt-auto pt-4 ">
                <Textarea
                    id="ai-input-15"
                    value={value}
                    placeholder={isTextareaDisabled ? "Please wait..." : selectedModel === "AI Chat" ? "Chat with knowledge base..." : selectedModel === "Genrate TTS" ? "Enter text to generate audio..." : "Microphone is active for AI Ask"}
                    className={cn(
                        "w-full rounded-xl rounded-b-none px-4 py-3 border-none resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
                        "min-h-[72px]"
                    )}
                    ref={textareaRef}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => {
                        setValue(e.target.value);
                        adjustHeight();
                    }}
                    disabled={isTextareaDisabled}
                />
                <div className="h-14 bg-input/20 border-none rounded-b-xl flex items-center px-3 ">
                    <div className="flex items-center justify-between w-full">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-1 h-8 px-3 text-xs rounded-md  focus-visible:ring-1 focus-visible:ring-offset-0 "
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
                                            {MODEL_ICONS[selectedModel]}
                                            {selectedModel}
                                            <ChevronDown className="w-3 h-3 opacity-50" />
                                        </motion.div>
                                    </AnimatePresence>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className={cn(
                                    "min-w-[6rem]",
                                    "border-background/10 dark:border-white/10",
                                    "bg-gradient-to-b from-white via-white to-neutral-100 dark:from-background dark:via-neutral-900 dark:to-neutral-800"
                                )}
                            >
                                {AI_MODELS.map((model) => (
                                    <DropdownMenuItem
                                        key={model}
                                        onSelect={() => setSelectedModel(model)}
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
    );
}