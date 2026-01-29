import { getUser } from "@/server/actions/usersActions";
import { getKnowledgeBaseChat } from "@/server/actions/knowledgeBaseChatActions";
import AI_Page from '@/components/AI/AiPage';
import { DashboardInnerLayout } from "@/components/shared/DashboardComponents";

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
        <DashboardInnerLayout>
            <AI_Page user={user} initialChatHistory={initialChatHistory} />
        </DashboardInnerLayout>
    );
}