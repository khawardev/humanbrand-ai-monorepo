import { getUser } from "@/actions/users-actions";
import { getKnowledgeBaseChat } from "@/actions/knowledge-base-chat-actions";
import KnowledgeBaseChatUI from "./knowledge-base-chat-ui";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RiChatSmileAiLine, RiVoiceAiLine } from "react-icons/ri";
import { CustomTabs } from "@/shared/CustomTabs";
import Gemini_Live_AIAG from "@/components/gemini-live-api-components/gemini-live-app-shared/gemini-live-aiag";
import { Button } from "@/components/ui/button";
import { BsStars } from "react-icons/bs";

export default async function KnowledgeBaseChatComponent() {
    const user = await getUser();
    let initialChatHistory = [];
    if (user) {
        const chat = await getKnowledgeBaseChat(user.id);
        if (chat && chat.chatHistory) {
            initialChatHistory = chat.chatHistory as any[];
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="size-10 rounded-full" size="icon">
                    <BsStars />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl w-[320px] p-3" align='end'>
                <CustomTabs
                    defaultValue="content_ask"
                    triggerMaxWidthClass="max-w-30"
                    tabs={[
                        {
                            label: "AI Chat",
                            value: "content_chat",
                            icon: <RiChatSmileAiLine />,
                            content: (
                                <KnowledgeBaseChatUI
                                    user={user}
                                    initialChatHistory={initialChatHistory}
                                />
                            ),
                        },
                        {
                            label: "AI Ask",
                            value: "content_ask",
                            icon: <RiVoiceAiLine />,
                            content: (
                                <div className="text-center items-center flex space-y-1 justify-center flex-col">
                                    <span className="text-muted-foreground">Ask from knowledge base</span>
                                    <Gemini_Live_AIAG user={user} />
                                </div>
                            ),
                        },
                    ]}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}