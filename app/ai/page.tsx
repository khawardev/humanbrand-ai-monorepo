import React from 'react';
import { getUser } from "@/actions/users-actions";
import { getKnowledgeBaseChat } from "@/actions/knowledge-base-chat-actions";
import { redirect } from 'next/navigation';
import AI_Page from '@/components/AI/AI_Page';

const Page = async () => {
    const user = await getUser();
    let initialChatHistory = [];
    if (user) {
        const chat = await getKnowledgeBaseChat(user.id);
        if (chat && chat.chatHistory) {
            initialChatHistory = chat.chatHistory as any[];
        }
    }

    if (!user) {
        redirect('/')
    }
    return (
        <div className='div-center-md h-[90vh] '>
            <AI_Page user={user} initialChatHistory={initialChatHistory} />
        </div>
    );
};

export default Page;