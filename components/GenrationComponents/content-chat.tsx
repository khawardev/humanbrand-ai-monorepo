'use client';

import React, { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { PdfFileDropzone } from "@/components/home/PdfFileDropzone";
import { Button } from "@/components/ui/button";
import { generateNewContent } from "@/actions/generate-new-content";
import { getChatSystemPrompt } from "@/lib/ai/prompts";
import { knowledgeBaseContent } from "@/lib/ai/knowledge_base";
import { LineSpinner } from './../../shared/spinner';
import { LuLoaderCircle } from "react-icons/lu";
import { Input } from "../ui/input";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function ContentChat({ originalContent, modelAlias, temperature }: any) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([]);
    const [referenceMaterial, setReferenceMaterial] = useState<string>();
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatContainerRef.current?.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: 'smooth',
        });
    }, [messages]);

    const formatConversationHistory = (msgs: Message[]): string => {
        if (!msgs || msgs.length === 0) return "No history yet.";
        return msgs.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setIsLoading(true);
        setInput("");

        const systemPrompt = getChatSystemPrompt({
            originalContent: originalContent,
            conversationHistory: formatConversationHistory(updatedMessages),
            uploadedFileText: referenceMaterial,
            knowledgeBaseContent: knowledgeBaseContent,
        });

        const generateChatData = {
            modelAlias: modelAlias,
            temperature: temperature,
            systemPrompt: systemPrompt,
            userPrompt: input,
        };

        const result = await generateNewContent(generateChatData);
        setIsLoading(false);

        const assistantMessage: Message = {
            role: 'assistant',
            content: result.generatedText || `Sorry, I encountered an error. ${result.errorReason || 'Please try again.'}`
        };

        setMessages(prev => [...prev, assistantMessage]);
        setUploadedPdfs([]);
        setReferenceMaterial(undefined);
    };

    return (
        <section className="space-y-4 flex flex-col h-[90vh]">
            <div>
                <h4>Chat with Generated Content</h4>
                <Label className="text-sm text-muted-foreground">Upload docs for chat (Optional)</Label>
            </div>

            <div ref={chatContainerRef} className="flex-1 overflow-y-auto  space-y-4 pr-2">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        Start the conversation by typing below.
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xl p-2 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                <div className="markdown-body-sm text-sm">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-xl p-2 rounded-lg bg-muted">
                            <LineSpinner>Thinking</LineSpinner>
                        </div>
                    </div>
                )}
            </div>

            <div className=" pt-2">
                <PdfFileDropzone
                    files={uploadedPdfs}
                    setFiles={setUploadedPdfs}
                    setReferenceMaterial={setReferenceMaterial}
                    maxFiles={1}
                />
            </div>

            <form onSubmit={handleSendMessage} className="flex items-center gap-2 ">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about the generated content..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                    }}
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !input.trim()}>
                    {isLoading ? <LuLoaderCircle className="text-background size-3 animate-spin" /> : 'Send'}
                </Button>
            </form>
        </section>
    );
}
