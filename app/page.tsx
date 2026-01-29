import React from 'react';
import { getUser } from "@/server/actions/usersActions";
import { getKnowledgeBaseChat } from "@/server/actions/knowledgeBaseChatActions";
import AI_Page from '@/components/AI/AiPage';

export default async function HomePage() {
    const user = await getUser();
    let initialChatHistory: any[] = [];
    
    if (user) {
        const chat = await getKnowledgeBaseChat(user.id);
        if (chat && chat.chatHistory) {
            initialChatHistory = chat.chatHistory as any[];
        }
    }

    return (
        <div className='div-center-md h-[90vh] '>
            <AI_Page user={user} initialChatHistory={initialChatHistory} />
        </div>
    );
}