import { getUser } from "@/server/actions/usersActions";
import { getKnowledgeBaseChat } from "@/server/actions/knowledgeBaseChatActions";
import KnowledgeBaseChatUI from "./KnowledgeBaseChatUi";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RiChatSmileAiLine, RiChatVoiceAiFill, RiChatVoiceAiLine, RiVoiceAiLine } from "react-icons/ri";
import { CustomTabs } from "@/components/shared/CustomTabs";
import { Button } from "@/components/ui/button";
import TTSPage from "@/components/routes/ai-chat/KnowledgebaseChat/TtsPage";
import GeminiLiveAiag from "@/components/gemini-api/gemini-live-app-shared/GeminiLiveAiag";

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
                    <RiChatVoiceAiFill />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl w-[820px] p-3 mx-auto " align='end'>
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
                                    <GeminiLiveAiag />
                                </div>
                            ),
                        },
                        {
                            label: "Genrate TTS",
                            value: "genrate_tts",
                            icon: <RiVoiceAiLine />,
                            content: (
                                <div >
                                    <TTSPage />
                                </div>
                            ),
                        },
                    ]}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}