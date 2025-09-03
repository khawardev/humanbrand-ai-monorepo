import AI_Prompt from '@/components/ui/ai-prompt';
import React from 'react';
import { getUser } from "@/actions/users-actions";
import { getKnowledgeBaseChat } from "@/actions/knowledge-base-chat-actions";

const Page = async () => {
    const user = await getUser();
    let initialChatHistory = [];
    if (user) {
        const chat = await getKnowledgeBaseChat(user.id);
        if (chat && chat.chatHistory) {
            initialChatHistory = chat.chatHistory as any[];
        }
    }

    return (
        <div className='div-center-md h-[90vh] '>
            <AI_Prompt user={user} initialChatHistory={initialChatHistory} />
        </div>
    );
};

export default Page;