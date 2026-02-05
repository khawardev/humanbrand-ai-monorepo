'use client'

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { stripMarkdownBold, cn } from "@/lib/utils";
import {
    ChatContainerContent,
    ChatContainerRoot,
} from "@/components/ui/chat-container";
import {
    Message,
    MessageAction,
    MessageActions,
    MessageContent,
} from "@/components/ui/message";
import Image from "next/image";
import { ScrollButton } from "@/components/ui/scroll-button";
import { Copy, Check, Paperclip, ArrowUp, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { RiChatAiLine } from "react-icons/ri";
import {
    PromptInput,
    PromptInputActions,
    PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { FaStop } from "react-icons/fa6";
import { FileDropzone } from "../reusable/uploads/FileDropzone";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface AssistantMessageProps {
    message: any;
    isLastMessage: boolean;
    shouldAnimate?: boolean;
}

const AssistantMessage = ({ message, isLastMessage, shouldAnimate = false }: AssistantMessageProps) => {
    const [isCopied, setIsCopied] = useState(false);
    
    // Initialize displayedContent: if we shouldn't animate, or if it's not the last message, show full content.
    const [displayedContent, setDisplayedContent] = useState(
        (!shouldAnimate || !isLastMessage) ? message.content : ""
    );

    const handleCopyMessage = (content: string) => {
        navigator.clipboard.writeText(stripMarkdownBold(content));
        setIsCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setIsCopied(false), 2000);
    };

    useEffect(() => {
        if (!shouldAnimate || !isLastMessage) {
            setDisplayedContent(message.content);
            return;
        }
        if (displayedContent === message.content) return;

        let index = 0;
        const interval = setInterval(() => {
             const chunkSize = 3; 
             if (index < message.content.length) {
                 setDisplayedContent((prev: string) => message.content.slice(0, prev.length + chunkSize));
                 index += chunkSize;
             } else {
                 clearInterval(interval);
                 setDisplayedContent(message.content);
             }
        }, 10);

        return () => clearInterval(interval);
    }, [message.content, isLastMessage, shouldAnimate]);
    
    useEffect(() => {
        if (shouldAnimate && isLastMessage && displayedContent !== message.content) {
             const timer = setTimeout(() => {
                 setDisplayedContent(message.content);
             }, 2000 + (message.content.length * 5));
             return () => clearTimeout(timer);
        }
    }, [message.content, isLastMessage, shouldAnimate]);

    return (
        <Message className="mx-auto flex w-full max-w-4xl  items-start gap-4 px-3">
            <Image
                className="h-9 w-9 border object-cover rounded-full mt-0.5"
                src="https://i.postimg.cc/ZYDgZQyF/aiag-logo.jpg"
                alt="Assistant Avatar"
                width={36}
                height={36}
            />
            <div className="flex flex-col gap-2 w-full min-w-0">
                <div className="group flex w-full flex-col gap-0 select-text">
                    <div className="rounded-lg transition-all border-2 border-transparent select-text">
                        <MessageContent
                            className="w-full space-y-6 flex-1 rounded-lg flex-col [&_p]:text-base! [&_li]:text-base! [&_h1]:text-xl! [&_h2]:text-xl! [&_h3]:text-xl! [&_h4]:text-xl! [&_h5]:text-xl! [&_h6]:text-xl! [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold bg-transparent p-0 select-text"
                            markdown
                        >
                            {shouldAnimate && isLastMessage ? displayedContent : message.content}
                        </MessageContent>
                    </div>

                    <MessageActions
                        className={cn(
                            "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                            isLastMessage && "opacity-100"
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
                    </MessageActions>
                </div>
            </div>
        </Message>
    );
};

const UserMessage = ({ user, message }: { user: any, message: any }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyMessage = (content: string) => {
        navigator.clipboard.writeText(stripMarkdownBold(content));
        setIsCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <Message className="mx-auto flex w-full max-w-4xl items-start flex-row-reverse gap-4 px-3">
             <Image
                className="h-9 w-9 border object-cover rounded-full mt-0.5"
                src={user?.image || 'https://github.com/shadcn.png'}
                alt="User Avatar"
                width={36}
                height={36}
            />
            <div className="flex flex-col gap-2 w-full min-w-0 items-end">
                <div className="group flex flex-col items-end gap-1 w-full relative">
                    <div className="max-w-[85%] rounded-3xl bg-muted px-5 py-2.5 sm:max-w-[75%]">
                        <MessageContent className="bg-transparent p-0 m-0 [&_p]:text-base! [&_li]:text-base! [&_h1]:text-xl! [&_h2]:text-xl! [&_h3]:text-xl! [&_h4]:text-xl! [&_h5]:text-xl! [&_h6]:text-xl! [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold">
                            {message.content}
                        </MessageContent>
                    </div>
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
                    </MessageActions>
                </div>
            </div>
        </Message>
    );
};

export function ContentChat({ chatHistory = [], handleChatSend, onChatFileChange, chatFileInfos, isChatLoading, user }: any) {
    const [input, setInput] = useState<string>("");
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
    // Track initial history length to avoid animating existing messages
    const initialMessageCountRef = useRef(chatHistory.length);

    useEffect(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatHistory, isChatLoading]);

    const handleSend = async () => {
        if (!input.trim() || isChatLoading) return;
        const currentInput = input;
        setInput("");
        // Optimistic update handled by parent usually, but here we trigger send
        await handleChatSend(currentInput);
    };

    return (
        <section className="flex flex-col h-[80vh] ">
             <ChatContainerRoot className="flex-1 overflow-hidden relative">
                {chatHistory.length === 0 && !isChatLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                        <div className="flex flex-col items-center text-xl gap-2 text-muted-foreground">
                            <RiChatAiLine className="w-12 h-12 opacity-50" />
                            <span className="font-medium opacity-50">Ask about your content</span>
                        </div>
                    </div>
                )}
                
                <ChatContainerContent className="space-y-6 py-8 px-4">
                    {chatHistory.map((msg: any, index: number) => {
                        const isLastMessage = index === chatHistory.length - 1;
                        const shouldAnimate = index >= initialMessageCountRef.current;
                        
                        if (msg.role === 'assistant') {
                            return <AssistantMessage key={index} message={msg} isLastMessage={isLastMessage} shouldAnimate={shouldAnimate} />;
                        } else {
                            return <UserMessage key={index} user={user} message={msg} />;
                        }
                    })}

                    {isChatLoading && (
                        <Message className="mx-auto flex w-full max-w-4xl items-start gap-4 px-3">
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
                     <div ref={endOfMessagesRef} />
                </ChatContainerContent>
                
                 <div className="absolute bottom-4 left-1/2 flex w-full max-w-4xl -translate-x-1/2 justify-end px-3 pointer-events-none">
                    <div className="pointer-events-auto">
                        <ScrollButton variant="secondary" className="shadow-sm border" />
                    </div>
                </div>
             </ChatContainerRoot>

            <div className="z-10 shrink-0">
                <div className="mx-auto max-w-4xl">
                     <PromptInput
                        isLoading={isChatLoading}
                        value={input}
                        onValueChange={setInput}
                        onSubmit={handleSend}
                        disabled={isChatLoading}
                    >
                        <div className="flex flex-col">
                             <PromptInputTextarea
                                placeholder="Ask from Generated Content"
                                className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] shadow-none border-0 focus-visible:ring-0"
                            />
                            
                            <PromptInputActions className="mt-2 flex w-full items-center justify-end gap-2 px-3 pb-3">
                               
                                    <Button
                                        size="icon"
                                        disabled={!input.trim() || isChatLoading}
                                        onClick={handleSend}
                                        className="size-9 rounded-full"
                                    >
                                        {!isChatLoading ? (
                                            <ArrowUp size={18} />
                                        ) : (
                                            <FaStop size={18} />
                                        )}
                                    </Button>
                            </PromptInputActions>
                        </div>
                    </PromptInput>
                </div>
            </div>
        </section>
    );
}