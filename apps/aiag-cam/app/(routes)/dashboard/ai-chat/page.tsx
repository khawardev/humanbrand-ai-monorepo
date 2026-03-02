import { getUser } from "@/server/actions/usersActions";
import { DashboardInnerLayout } from "@/components/shared/DashboardComponents";
import AiChatPageComponent from "@/components/routes/ai-chat/AiChatPageComponent";

export default async function AIChatPage() {
    const user = await getUser();
    let initialChatHistory: any[] = [];

    return (
        <DashboardInnerLayout>
            <AiChatPageComponent user={user} initialChatHistory={initialChatHistory} />
        </DashboardInnerLayout>
    );
}