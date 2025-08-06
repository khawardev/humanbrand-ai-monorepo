'use client'

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LuLoaderCircle } from "react-icons/lu";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { useKnowledgeBaseChat } from "@/hooks/aiag_hooks/use-knowledge-base-chat";

export default function KnowledgeBaseChatUI({ user, initialChatHistory }: { user: any, initialChatHistory: any[] }) {
    const { chatHistory, isResponding, handleSendMessage } = useKnowledgeBaseChat({ user, initialChatHistory });
    const [input, setInput] = useState<string>("");
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight });
        }
    }, [chatHistory, isResponding]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(input);
        setInput("");
    };

    return (
        <div className="flex flex-col h-[70vh]">
            <div ref={chatContainerRef} className="flex flex-col flex-1 overflow-y-auto space-y-4 ">
                {chatHistory.length === 0 && !isResponding ? (
                    <div className="flex text-center items-center justify-center min-h-[50vh] text-muted-foreground">
                        Ask a question from the Knowledge base to get started.
                    </div>
                ) : (
                    chatHistory.map((msg: any, index: any) => (
                        <div key={index} className="flex items-start gap-2 no-scrollbar">
                            <img
                                src={msg.role === 'user' ? user?.image && user?.image : 'https://i.postimg.cc/ZYDgZQyF/aiag-logo.jpg'}
                                alt={`${msg.role} avatar`}
                                className={`w-9 h-9  rounded-md object-cover mt-1 ${msg.role !== 'user' && 'mt-3 '} `}
                            />
                            <div className={`w-full p-2 rounded-lg text-[15px]  ${msg.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : ''
                                }`}
                            >
                                <div className="markdown-body space-y-1 text-[15px]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {isResponding && (
                    <div className="flex items-start gap-3 my-2">
                        <img
                            src={'https://i.postimg.cc/ZYDgZQyF/aiag-logo.jpg'}
                            alt="assistant avatar"
                            className="w-9 h-9  rounded-md object-cover mt-1"
                        />
                        <div className='w-full space-y-2 p-3 bg-accent rounded-lg'>
                            <Skeleton className='w-[30%] h-4 bg-muted-foreground/20' />
                            <Skeleton className='w-[70%] h-4 bg-muted-foreground/20' />
                        </div>
                    </div>
                )}
            </div>
            <form onSubmit={handleSend} className="flex items-center gap-2 border-t pt-4 mt-4">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Chat with knowledge base"
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { handleSend(e); } }}
                    disabled={isResponding || !user}
                />
                <Button type="submit" disabled={isResponding || !input.trim() || !user}>
                    {isResponding ? <LuLoaderCircle className="text-background size-4 animate-spin" /> : 'Send'}
                </Button>
            </form>
        </div>

    );
}