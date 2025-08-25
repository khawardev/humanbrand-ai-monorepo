"use client";
import { ArrowRight, Bot, Check, ChevronDown, Speech, Download, Loader2 } from "lucide-react";
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

// Define the component's props
interface AI_PromptProps {
    user: any;
    initialChatHistory: any[];
}

export default function AI_Prompt({ user, initialChatHistory }: AI_PromptProps) {
    const [value, setValue] = useState("");
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 72,
        maxHeight: 300,
    });
    const [selectedModel, setSelectedModel] = useState("AI Chat");

    // Hook for AI Chat functionality
    const { chatHistory, isResponding, handleSendMessage } = useKnowledgeBaseChat({ user, initialChatHistory });
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // State for TTS functionality
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isTTSLoading, setTTSLoading] = useState(false);

    const AI_MODELS = ["AI Chat", "AI Ask", "Genrate TTS"];
    const MODEL_ICONS: Record<string, React.ReactNode> = {
        "AI Chat": <RiChatSmileAiLine />,
        "AI Ask": <RiVoiceAiLine />,
        "Genrate TTS": <Speech />,
    };

    // Auto-scroll for chat
    useEffect(() => {
        if (selectedModel === "AI Chat" && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory, isResponding, selectedModel]);

    // TTS Audio Generation Logic
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

    const isTextareaDisabled = selectedModel === "AI Ask" || isResponding || isTTSLoading;
    const isSendButtonDisabled = !value.trim() || isTextareaDisabled;

    const renderContent = () => {
        switch (selectedModel) {
            case "AI Chat":
                return (
                    <div ref={chatContainerRef} className="flex flex-col flex-1 overflow-y-auto space-y-4  no-scrollbar">
                        {chatHistory.map((msg: any, index: any) => (
                            <div key={index} className="flex items-start gap-3 w-full">
                                <Image
                                    src={msg.role === 'user' ? (user?.image || '/default-user.png') : 'https://i.postimg.cc/ZYDgZQyF/aiag-logo.jpg'}
                                    alt={`${msg.role} avatar`}
                                    width={36}
                                    height={36}
                                    className="w-9 h-9 rounded-md object-cover mt-1"
                                />
                                <div className={`w-full p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-black/5 dark:bg-white/5'}`}>
                                    <div className="markdown-body space-y-1 text-[15px]">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isResponding && (
                            <div className="flex items-start gap-3 my-2">
                                <Image src={'https://i.postimg.cc/ZYDgZQyF/aiag-logo.jpg'} alt="assistant avatar" width={36} height={36} className="w-9 h-9 rounded-md object-cover mt-1" />
                                <div className='w-full space-y-2 p-3 bg-accent rounded-lg'>
                                    <Skeleton className='w-[30%] h-4 bg-muted-foreground/20' />
                                    <Skeleton className='w-[70%] h-4 bg-muted-foreground/20' />
                                </div>
                            </div>
                        )}
                    </div>
                );
            case "AI Ask":
                return (
                    <div className="flex flex-col items-center justify-center text-center h-[60vh]">
                        <Gemini_Live_AIAG user={user} />
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
                                    <audio controls src={audioUrl} className="w-full" />
                                    <a href={audioUrl} download="tts-output.wav">
                                        <Button size={'xs'}  >
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
            <div className="flex-grow overflow-y-auto" style={{ maxHeight: "calc(100% - 150px)" }}>
                {renderContent()}
            </div>
            <div className="relative mt-auto pt-4 ">
                <Textarea
                    id="ai-input-15"
                    value={value}
                    placeholder={selectedModel === "AI Chat" ? "Chat with knowledge base..." : selectedModel === "Genrate TTS" ? "Enter text to generate audio..." : "Microphone is active for AI Ask"}
                    className={cn(
                        "w-full rounded-xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
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
                <div className="h-14 bg-black/5 dark:bg-white/5 rounded-b-xl flex items-center px-3">
                    <div className="flex items-center justify-between w-full">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-1 h-8 pl-1 pr-2 text-xs rounded-md hover:bg-black/10 dark:hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
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
                                    "min-w-[10rem]",
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