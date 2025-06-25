'use client'

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getKnowledgeBaseChat, upsertKnowledgeBaseChat } from "@/actions/knowledge-base-chat-actions";
import { getUser } from "@/actions/users-actions";

export function useKnowledgeBaseChat() {
    const [user, setUser] = useState<any>(null);
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isResponding, setIsResponding] = useState(false);

    useEffect(() => {
        const initializeChat = async () => {
            setIsLoading(true);
            const currentUser = await getUser();
            if (currentUser) {
                setUser(currentUser);
                const existingChat = await getKnowledgeBaseChat(currentUser.id);
                if (existingChat && existingChat.chatHistory) {
                    setChatHistory(existingChat.chatHistory as any[]);
                }
            }
            setIsLoading(false);
        };
        initializeChat();
    }, []);

    const handleSendMessage = async (userInput: string) => {
        if (!user) {
            toast.error("Please log in to use the chat.");
            return;
        }
        if (!userInput.trim() || isResponding) return;

        setIsResponding(true);
        const optimisticHistory = [...chatHistory, { role: 'user', content: userInput }];
        setChatHistory(optimisticHistory);

        const result = await upsertKnowledgeBaseChat(user.id, userInput, chatHistory);

        if (result.success && result.newHistory) {
            setChatHistory(result.newHistory);
        } else {
            toast.error(result.error || "An unexpected error occurred.");
            setChatHistory(chatHistory);
        }
        setIsResponding(false);
    };

    return {
        user,
        chatHistory,
        isLoading,
        isResponding,
        handleSendMessage,
    };
}