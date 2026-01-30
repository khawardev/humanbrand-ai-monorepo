import { getUser } from "@/server/actions/usersActions";
import { getKnowledgeBaseChat } from "@/server/actions/knowledgeBaseChatActions";
import { DashboardInnerLayout } from "@/components/shared/DashboardComponents";
import AiChatPageComponent from "@/components/AIAGComponents/ai-chat/AiChatPageComponent";

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
            <AiChatPageComponent user={user} initialChatHistory={initialChatHistory} />
        </DashboardInnerLayout>
    );
}