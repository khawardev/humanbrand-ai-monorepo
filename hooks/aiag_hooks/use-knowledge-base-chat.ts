'use client'



import { useState, useEffect } from "react";

import { toast } from "sonner";

import { upsertKnowledgeBaseChat } from "@/actions/knowledge-base-chat-actions";



export function useKnowledgeBaseChat(initialData: { user: any; initialChatHistory: any[] }) {

    const [user, setUser] = useState<any>(initialData.user);

    const [chatHistory, setChatHistory] = useState<any[]>(initialData.initialChatHistory || []);

    const [isResponding, setIsResponding] = useState(false);



    useEffect(() => {

        setUser(initialData.user);

    }, [initialData.user]);



    const handleSendMessage = async (userInput: string) => {

        if (!user) {

            toast.error("Please log in to use the chat.");

            return;

        }

        if (user?.adminVerified === false) {

            toast.error('Please wait for the Admin to Approve')

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

        isResponding,

        handleSendMessage,

    };

}