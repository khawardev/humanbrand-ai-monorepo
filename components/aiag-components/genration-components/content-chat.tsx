'use client'

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LuLoaderCircle } from "react-icons/lu";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { PdfFileDropzone } from "../reusable-components/uploads/PdfFileDropzone";
import { Skeleton } from "@/components/ui/skeleton";

export function ContentChat({ chatHistory = [], handleChatSend, onChatFileChange, chatPdfInfo, isChatLoading, user }: any) {
    const [messages, setMessages] = useState(chatHistory);
    const [input, setInput] = useState<string>("");
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages(chatHistory);
    }, [chatHistory])

    useEffect(() => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isChatLoading) return;
        const currentInput = input;
        setInput("");
        setMessages((prev: any) => [...prev, { role: 'user', content: currentInput }]);
        await handleChatSend(currentInput);
    };
    
    return (
        <section className="space-y-4 flex flex-col h-[90vh]">
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto  space-y-4 pl-2  ">
                {messages.length === 0 && !isChatLoading ? (
                    <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
                        Start the conversation by typing below.
                    </div>
                ) : (
                    messages.map((msg: any, index: number) => (
                        <div key={index} className="flex items-start gap-2 my-2 no-scrollbar">
                            <img
                                src={msg.role === 'user' ? user?.image && user?.image : 'https://i.postimg.cc/ZYDgZQyF/aiag-logo.jpg'}
                                alt={`${msg.role} avatar`}
                                className={`w-10 h-10  rounded-md object-cover mt-1 ${msg.role !== 'user' && 'mt-3'} `}
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
                {isChatLoading && (
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

            <div className="space-y-2 pt-2">
                <Label className="text-sm text-muted-foreground">Upload docs for chat (Optional)</Label>
                <PdfFileDropzone
                    onFileChange={onChatFileChange}
                    initialFileInfo={chatPdfInfo}
                />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 ">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about the generated content..."
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                    disabled={isChatLoading}
                />
                <Button type="submit" disabled={isChatLoading || !input.trim()}>
                    {isChatLoading ? <LuLoaderCircle className="text-background size-3 animate-spin" /> : 'Send'}
                </Button>
            </form>
        </section>
    );
}