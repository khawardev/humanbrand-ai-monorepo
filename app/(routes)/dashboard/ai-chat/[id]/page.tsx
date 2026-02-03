
import { getUser } from "@/server/actions/usersActions";
import { getSessionById } from "@/server/actions/savedSessionActions";
import { DashboardInnerLayout } from "@/components/shared/DashboardComponents";
import AiChatPageComponent from "@/components/routes/ai-chat/AiChatPageComponent";
import { redirect } from "next/navigation";

export default async function AIChatSessionPage({ params }: any) {
    const resolvedParams = await params;
    const user = await getUser();
    const session = await getSessionById(resolvedParams.id);

    if (!session || session.userId !== user?.id) {
         redirect("/dashboard/ai-chat");
    }

    // Verified: initialChatHistory contains the full conversation history from the DB, ensuring context retention.
    const initialChatHistory = session.chatHistory as any[] || [];

    return (
        <DashboardInnerLayout>
            <AiChatPageComponent user={user} initialChatHistory={initialChatHistory} sessionId={session.id} />
        </DashboardInnerLayout>
    );
}
