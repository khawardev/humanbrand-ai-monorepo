'use client'

import { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    saveUserMessage,
    generateChatResponse,
    rewriteSessionAssistantMessage,
    deleteSessionMessage,
    editUserMessage,
    rateSessionMessage,
} from "@/server/actions/savedSessionActions";

type UseAiChatOptions = {
    user: any
    initialChatHistory: any[]
    sessionId?: string
    retrievalStrategy?: 'full-context' | 'rag'
}

function convertAttachmentsToBase64(attachments: File[]): Promise<string[]> {
    return Promise.all(
        attachments.map(
            (file) =>
                new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                })
        )
    );
}

export function useAiChat({
    user,
    initialChatHistory,
    sessionId: initialSessionId,
    retrievalStrategy: rawStrategy,
}: UseAiChatOptions) {
    const [chatHistory, setChatHistory] = useState<any[]>(initialChatHistory || []);
    const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId);
    const [isResponding, setIsResponding] = useState(false);

    const router = useRouter();
    const retrievalStrategy = rawStrategy === 'rag' ? 'rag' : 'knowledgeBase';
    const isRespondingRef = useRef(false);

    const handleSendMessage = useCallback(async (
        userInput: string,
        imageFiles: File[] = [],
        fileText?: string,
    ) => {
        if (!user) {
            toast.error("Please log in to use the chat.");
            return;
        }

        const hasText = userInput.trim().length > 0;
        const hasImages = imageFiles.length > 0;
        const hasFileText = !!fileText;

        if ((!hasText && !hasImages && !hasFileText) || isRespondingRef.current) return;

        isRespondingRef.current = true;
        setIsResponding(true);

        const base64Images = await convertAttachmentsToBase64(imageFiles);

        const userMessage: any = { role: 'user', content: userInput };
        if (base64Images.length > 0) userMessage.images = base64Images;
        if (hasFileText) userMessage.fileText = fileText;

        setChatHistory(prev => [...prev, userMessage]);

        let shouldResetResponding = true;

        try {
            const result = await saveUserMessage(
                sessionId || null,
                user.id,
                userInput,
                chatHistory,
                base64Images,
                fileText,
            );

            if (result.success && result.sessionId) {
                // If it's a new session, redirect immediately
                if (!sessionId && result.sessionId) {
                    shouldResetResponding = false; // Don't reset, let unmount handle it
                    router.replace(`/dashboard/ai-chat/${result.sessionId}`);
                    return;
                }

                // For existing sessions, generate response in-place
                const currentHistory = result.history || [...chatHistory, userMessage];
                const responseResult = await generateChatResponse(
                    result.sessionId,
                    user.id,
                    currentHistory,
                    retrievalStrategy,
                );

                if (responseResult.success && responseResult.newHistory) {
                    setChatHistory(responseResult.newHistory);
                } else {
                    toast.error(responseResult.error || "Failed to generate response.");
                    setChatHistory(currentHistory);
                }
            } else {
                toast.error(result.error || "Failed to save message.");
                setChatHistory(prev => prev.slice(0, -1));
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to send message");
            setChatHistory(prev => prev.slice(0, -1));
        } finally {
            if (shouldResetResponding) {
                isRespondingRef.current = false;
                setIsResponding(false);
            }
        }
    }, [user, chatHistory, sessionId, router, retrievalStrategy]);

    // Auto-trigger response if the last message is from user (e.g. after redirect or page load)
    useEffect(() => {
        const lastMessage = chatHistory[chatHistory.length - 1];
        if (
            sessionId && 
            chatHistory.length > 0 && 
            lastMessage?.role === 'user' && 
            !isRespondingRef.current
        ) {
            const generate = async () => {
                isRespondingRef.current = true;
                setIsResponding(true);
                try {
                    const responseResult = await generateChatResponse(
                        sessionId,
                        user.id,
                        chatHistory,
                        retrievalStrategy
                    );
                    
                    if (responseResult.success && responseResult.newHistory) {
                        setChatHistory(responseResult.newHistory);
                    } else {
                        toast.error(responseResult.error || "Failed to generate response.");
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    isRespondingRef.current = false;
                    setIsResponding(false);
                }
            };
            generate();
        }
    }, [sessionId, chatHistory, user.id, retrievalStrategy]);

    const handleRewriteMessage = useCallback(async (
        messageIndex: number,
        originalContent: string,
        selectedText: string,
        rewritePrompt: string,
    ) => {
        if (!user) {
            toast.error("Please log in to perform this action.");
            return;
        }
        if (!rewritePrompt.trim() || isRespondingRef.current || !sessionId) return;

        isRespondingRef.current = true;
        setIsResponding(true);

        try {
            const result = await rewriteSessionAssistantMessage(
                sessionId, messageIndex, originalContent, selectedText, rewritePrompt,
            );

            if (result.success && result.newHistory) {
                setChatHistory(result.newHistory);
            } else {
                toast.error(result.error || "Failed to rewrite the message.");
            }
        } finally {
            isRespondingRef.current = false;
            setIsResponding(false);
        }
    }, [user, sessionId]);

    const handleDeleteMessage = useCallback(async (messageIndex: number) => {
        if (!sessionId) return;

        setChatHistory(prev => {
            const optimistic = [...prev];
            const targetMessage = optimistic[messageIndex];

            if (targetMessage.role === 'user') {
                const hasFollowingAssistant =
                    messageIndex + 1 < optimistic.length &&
                    optimistic[messageIndex + 1].role === 'assistant';
                optimistic.splice(messageIndex, hasFollowingAssistant ? 2 : 1);
            } else {
                optimistic.splice(messageIndex, 1);
            }
            return optimistic;
        });

        const result = await deleteSessionMessage(sessionId, messageIndex);
        if (result.success && result.newHistory) {
            setChatHistory(result.newHistory);
        } else {
            toast.error("Failed to delete message");
            setChatHistory(initialChatHistory);
        }
    }, [sessionId, initialChatHistory]);

    const handleEditUserMessage = useCallback(async (messageIndex: number, newContent: string) => {
        if (!sessionId || !newContent.trim()) return;

        isRespondingRef.current = true;
        setIsResponding(true);

        setChatHistory(prev => {
            const truncated = prev.slice(0, messageIndex);
            return [...truncated, { role: 'user', content: newContent }];
        });

        try {
            const result = await editUserMessage(sessionId, messageIndex, newContent);
            if (result.success && result.history) {
                const responseResult = await generateChatResponse(
                    sessionId, user.id, result.history, retrievalStrategy,
                );
                if (responseResult.success && responseResult.newHistory) {
                    setChatHistory(responseResult.newHistory);
                } else {
                    toast.error(responseResult.error || "Failed to generate response.");
                }
            } else {
                toast.error("Failed to edit message");
            }
        } catch (e) {
            console.error(e);
            toast.error("Failed to edit message");
        } finally {
            isRespondingRef.current = false;
            setIsResponding(false);
        }
    }, [sessionId, user, retrievalStrategy]);

    const handleRateMessage = useCallback(async (messageIndex: number, feedback: 'up' | 'down' | null) => {
        if (!sessionId) return;

        setChatHistory(prev => {
            const updated = [...prev];
            updated[messageIndex] = { ...updated[messageIndex], feedback };
            return updated;
        });

        const result = await rateSessionMessage(sessionId, messageIndex, feedback);
        if (result.success && result.newHistory) {
            setChatHistory(result.newHistory);
        } else {
            toast.error("Failed to rate message");
        }
    }, [sessionId]);

    return {
        chatHistory,
        isResponding,
        handleSendMessage,
        handleRewriteMessage,
        handleDeleteMessage,
        handleEditUserMessage,
        handleRateMessage,
    };
}
