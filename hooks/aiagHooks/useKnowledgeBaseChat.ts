'use client'

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { upsertKnowledgeBaseChat, rewriteAssistantMessage } from "@/server/actions/knowledgeBaseChatActions";
import { saveUserMessage, generateChatResponse, rewriteSessionAssistantMessage, deleteSessionMessage, editUserMessage, rateSessionMessage } from "@/server/actions/savedSessionActions";

export function useKnowledgeBaseChat(initialData: { user: any; initialChatHistory: any[]; sessionId?: string }) {
    const [user, setUser] = useState<any>(initialData.user);
    const [chatHistory, setChatHistory] = useState<any[]>(initialData.initialChatHistory || []);
    const [sessionId, setSessionId] = useState<string | undefined>(initialData.sessionId);
    const [isResponding, setIsResponding] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setUser(initialData.user);
    }, [initialData.user]);

    // Track processed history length to prevent double-firing in Strict Mode
    const processedRef = useRef(0);

    // Sync processedRef with history length when not responding or when last is not user
    useEffect(() => {
        const lastMessage = chatHistory[chatHistory.length - 1];
        if (chatHistory.length > 0 && lastMessage?.role !== 'user') {
            processedRef.current = chatHistory.length;
        }
    }, [chatHistory]);

    // Check if we need to auto-generate a response (e.g. after redirect or page load with pending user message)
    useEffect(() => {
        const lastMessage = chatHistory[chatHistory.length - 1];
        if (
            sessionId && 
            user && 
            !isResponding && 
            chatHistory.length > 0 && 
            lastMessage?.role === 'user'
        ) {
            // Only trigger if we haven't processed this exact history state yet
            if (chatHistory.length !== processedRef.current) {
                processedRef.current = chatHistory.length;
                triggerResponse(sessionId, chatHistory);
            }
        }
    }, [chatHistory, sessionId, user, isResponding]);

    const triggerResponse = async (currentSessionId: string, currentHistory: any[]) => {
        setIsResponding(true);
        try {
            const result = await generateChatResponse(currentSessionId, user.id, currentHistory);
            if (result.success && result.newHistory) {
                setChatHistory(result.newHistory);
            } else {
                toast.error(result.error || "Failed to generate response.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error generating response.");
        }
        setIsResponding(false);
    }

    const handleSendMessage = useCallback(async (userInput: string) => {
        if (!user) {
             toast.error("Please log in to use the chat.");
             return;
        }

        if (!userInput.trim() || isResponding) return;

        setIsResponding(true);
        const optimisticHistory = [...chatHistory, { role: 'user', content: userInput }];
        setChatHistory(optimisticHistory);

        try {
            // 1. Save User Message
            const result = await saveUserMessage(sessionId || null, user.id, userInput, chatHistory);

            if (result.success && result.sessionId) {
                // If it was a new session, redirect immediately
                if (!sessionId && result.sessionId) {
                    router.replace(`/dashboard/ai-chat/${result.sessionId}`);
                    return; // Stop here, let the new page handle the generation
                } 
                
                // For existing session, trigger response directly
                // We update with result.history in case server modified it, or fall back to optimistic
                const currentHistory = result.history || optimisticHistory;
                if (result.history) {
                    setChatHistory(result.history);
                }
                
                await triggerResponse(result.sessionId, currentHistory);

            } else {
                toast.error(result.error || "Failed to save message.");
                setChatHistory(chatHistory); // Revert
                setIsResponding(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to send message");
            setChatHistory(chatHistory); // Revert
            setIsResponding(false);
        }
    }, [user, isResponding, chatHistory, sessionId, router]);

    const handleRewriteMessage = useCallback(async (messageIndex: number, originalContent: string, selectedText: string, rewritePrompt: string) => {
        if (!user) {
            toast.error("Please log in to perform this action.");
            return;
        }
        if (!rewritePrompt.trim() || isResponding) return;

        setIsResponding(true);

        let result;
        if (sessionId) {
            result = await rewriteSessionAssistantMessage(sessionId, messageIndex, originalContent, selectedText, rewritePrompt);
        } else {
            // Fallback to legacy structure if separate from session (unlikely in new flow)
             result = await rewriteAssistantMessage(user.id, messageIndex, originalContent, selectedText, rewritePrompt);
        }

        if (result.success && result.newHistory) {
            setChatHistory(result.newHistory);
        } else {
            toast.error(result.error || "Failed to rewrite the message.");
        }

        setIsResponding(false);
    }, [user, isResponding, sessionId]);

    const handleDeleteMessage = useCallback(async (messageIndex: number) => {
        if (!sessionId) return;
        
        // Optimistic update
        const targetMessage = chatHistory[messageIndex];
        let optimisticHistory = [...chatHistory];
        if (targetMessage.role === 'user') {
             if (messageIndex + 1 < optimisticHistory.length && optimisticHistory[messageIndex + 1].role === 'assistant') {
                 optimisticHistory.splice(messageIndex, 2);
             } else {
                 optimisticHistory.splice(messageIndex, 1);
             }
        } else {
            optimisticHistory.splice(messageIndex, 1);
        }
        setChatHistory(optimisticHistory);

        const result = await deleteSessionMessage(sessionId, messageIndex);
        if (result.success && result.newHistory) {
             setChatHistory(result.newHistory);
        } else {
            toast.error("Failed to delete message");
            setChatHistory(chatHistory); // Revert
        }
    }, [sessionId, chatHistory]);

    const handleEditUserMessage = useCallback(async (messageIndex: number, newContent: string) => {
        if (!sessionId) return;
        if (!newContent.trim()) return;

        setIsResponding(true);
        // Optimistic update
        // Truncate history after edited message
        const truncated = chatHistory.slice(0, messageIndex);
        const optimisticHistory = [...truncated, { role: 'user', content: newContent }];
        setChatHistory(optimisticHistory);

        try {
            const result = await editUserMessage(sessionId, messageIndex, newContent);
            if (result.success && result.history) {
                 // Trigger response immediately
                 await triggerResponse(sessionId, result.history);
            } else {
                toast.error("Failed to edit message");
                setChatHistory(chatHistory); // Revert
                setIsResponding(false);
            }
        } catch (e) {
            console.error(e);
            setChatHistory(chatHistory);
            setIsResponding(false);
        }
    }, [sessionId, chatHistory]);

    const handleRateMessage = useCallback(async (messageIndex: number, feedback: 'up' | 'down' | null) => {
        if (!sessionId) return;
        
        // Optimistic update
        const updatedHistory = [...chatHistory];
        updatedHistory[messageIndex] = { ...updatedHistory[messageIndex], feedback };
        setChatHistory(updatedHistory);

        const result = await rateSessionMessage(sessionId, messageIndex, feedback);
        if (result.success && result.newHistory) {
             setChatHistory(result.newHistory);
        } else {
            toast.error("Failed to rate message");
            setChatHistory(chatHistory); // Revert
        }
    }, [sessionId, chatHistory]);

    return {
        user,
        chatHistory,
        isResponding,
        handleSendMessage,
        handleRewriteMessage,
        handleDeleteMessage,
        handleEditUserMessage,
        handleRateMessage
    };
}