"use client"

import {
    ChatContainerContent,
    ChatContainerRoot,
} from "@/components/ui/chat-container"
import {
    Message,
    MessageAction,
    MessageActions,
    MessageContent,
} from "@/components/ui/message"
import {
    PromptInput,
    PromptInputAction,
    PromptInputActions,
    PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { ScrollButton } from "@/components/ui/scroll-button"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import {
    ArrowUp,
    Copy,
    Globe,
    Mic,
    MoreHorizontal,
    Pencil,
    Plus,
    ThumbsDown,
    ThumbsUp,
    Trash,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { FaStop } from "react-icons/fa6";

// Initial chat messages
const initialMessages = [
    {
        id: 1,
        role: "user",
        content: "Hello! Can you help me with a coding question?",
    },
    {
        id: 2,
        role: "assistant",
        content:
            "Of course! I'd be happy to help with your coding question. What would you like to know?",
    },
    {
        id: 3,
        role: "user",
        content: "How do I create a responsive layout with CSS Grid?",
    },
    {
        id: 4,
        role: "assistant",
        content:
            "Creating a responsive layout with CSS Grid is straightforward.\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1rem;\n}\n```",
    },
    {
        id: 5,
        role: "user",
        content: "Can you show all Markdown elements in one message?",
    },
    {
        id: 6,
        role: "assistant",
        content:
            "# Heading 1\n## Heading 2\n### Heading 3\n#### Heading 4\n##### Heading 5\n###### Heading 6\n\n---\n\n**Bold text**\n\n*Italic text*\n\n***Bold & Italic***\n\n~~Strikethrough~~\n\n`Inline code`\n\n---\n\n### Unordered List\n- Item One\n- Item Two\n  - Sub Item A\n  - Sub Item B\n- Item Three\n\n### Ordered List\n1. First item\n2. Second item\n3. Third item\n\n### Task List\n- [x] Completed task\n- [ ] Pending task\n\n---\n\n### Blockquote\n> This is a blockquote\n>> Nested blockquote\n\n---\n\n### Code Block (JavaScript)\n```js\nconst sum = (a, b) => a + b\n```\n\n### Code Block (CSS)\n```css\n.card {\n  padding: 16px;\n  border-radius: 8px;\n}\n```\n\n---\n\n### Table\n| Feature | Grid | Flexbox |\n|-------|------|---------|\n| Layout | 2D | 1D |\n| Use case | Pages | Components |\n| Responsive | Excellent | Good |\n\n---\n\n### Links\n[Visit MDN](https://developer.mozilla.org)\n\n### Images\n![Placeholder Image](https://via.placeholder.com/150)\n\n---\n\n### Horizontal Rule Above and Below\n\n---\n\n### Emoji Support 😄🚀🔥\n\n### Escaped Characters\n\\*Not italic\\*\n\n### HTML inside Markdown\n<div><strong>HTML works too</strong></div>\n\n---\n\nMarkdown demo complete. Safari on macOS renders this cleanly.",
    },
    {
        id: 7,
        role: "user",
        content: "Show me Markdown tables examples",
    },
    {
        id: 8,
        role: "assistant",
        content:
            "### Basic Table\n\n| Name | Role | Experience |\n|------|------|------------|\n| Alice | Frontend | 3 Years |\n| Bob | Backend | 5 Years |\n| Carol | Full Stack | 4 Years |\n\n---\n\n### Table with Alignment\n\n| Feature | Grid | Flexbox |\n|:--------|:----:|--------:|\n| Dimension | 2D | 1D |\n| Learning Curve | Medium | Easy |\n| Control | High | Medium |\n\n---\n\n### Comparison Table\n\n| Tech | Pros | Cons |\n|------|------|------|\n| React | Component-based, Fast | Boilerplate |\n| Vue | Easy syntax | Smaller ecosystem |\n| Svelte | No virtual DOM | Fewer jobs |\n\n---\n\n### Status Table\n\n| Task | Owner | Status |\n|------|-------|--------|\n| UI Design | Khawar | ✅ Done |\n| API Integration | Alex | ⏳ In Progress |\n| Testing | Sam | ❌ Pending |\n\n---\n\n### Pricing Table\n\n| Plan | Price | Features |\n|------|-------|----------|\n| Free | $0 | Basic Access |\n| Pro | $19 | Advanced Tools |\n| Enterprise | $49 | All Features |\n\nTables render cleanly on macOS browsers and markdown editors.",
    },
]


function ChatContent() {
    const [prompt, setPrompt] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [chatMessages, setChatMessages] = useState(initialMessages)

    const handleSubmit = () => {
        if (!prompt.trim()) return

        setPrompt("")
        setIsLoading(true)

        // Add user message immediately
        const newUserMessage = {
            id: chatMessages.length + 1,
            role: "user",
            content: prompt.trim(),
        }

        setChatMessages([...chatMessages, newUserMessage])

        // Simulate API response
        setTimeout(() => {
            const assistantResponse = {
                id: chatMessages.length + 2,
                role: "assistant",
                content: `This is a response to: "${prompt.trim()}"`,
            }

            setChatMessages((prev) => [...prev, assistantResponse])
            setIsLoading(false)
        }, 1500)
    }

    return (
        <main className="flex h-[93vh] flex-col overflow-hidden">
            <div className="relative flex-1 overflow-hidden">
                <ChatContainerRoot className="h-full">
                    <ChatContainerContent className="space-y-0 py-12">
                        {chatMessages.map((message, index) => {
                            const isAssistant = message.role === "assistant"
                            const isLastMessage = index === chatMessages.length - 1

                            return (
                                <Message
                                    key={message.id}
                                    className={cn(
                                        "mx-auto flex w-full max-w-4xl flex-col gap-2 px-6",
                                        isAssistant ? "items-start" : "items-end"
                                    )}
                                >
                                    {isAssistant ? (
                                        <div className="group flex w-full flex-col gap-0">
                                            <MessageContent
                                                className="w-full space-y-6 flex-1 rounded-lg flex-col [&_p]:text-base! [&_li]:text-base! bg-transparent p-0"
                                                markdown
                                            >
                                                {message.content}
                                            </MessageContent>
                                            <MessageActions
                                                className={cn(
                                                    "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                                                    isLastMessage && "opacity-100"
                                                )}
                                            >
                                                <MessageAction tooltip="Copy" delayDuration={100}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <Copy />
                                                    </Button>
                                                </MessageAction>
                                                <MessageAction tooltip="Upvote" delayDuration={100}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <ThumbsUp />
                                                    </Button>
                                                </MessageAction>
                                                <MessageAction tooltip="Downvote" delayDuration={100}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <ThumbsDown />
                                                    </Button>
                                                </MessageAction>
                                            </MessageActions>
                                        </div>
                                    ) : (
                                        <div className="group flex flex-col items-end gap-1">
                                            <MessageContent className="bg-muted  max-w-[85%] rounded-3xl px-5 py-2.5 sm:max-w-[75%]">
                                                {message.content}
                                            </MessageContent>
                                            <MessageActions
                                                className={cn(
                                                    "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                                                )}
                                            >
                                                <MessageAction tooltip="Edit" delayDuration={100}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        >
                                                        <Pencil />
                                                    </Button>
                                                </MessageAction>
                                                <MessageAction tooltip="Delete" delayDuration={100}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        >
                                                        <Trash />
                                                    </Button>
                                                </MessageAction>
                                                <MessageAction tooltip="Copy" delayDuration={100}>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        >
                                                        <Copy />
                                                    </Button>
                                                </MessageAction>
                                            </MessageActions>
                                        </div>
                                    )}
                                </Message>
                            )
                        })}
                    </ChatContainerContent>
                    <div className="absolute bottom-4 left-1/2 flex w-full max-w-4xl -translate-x-1/2 justify-end px-5">
                        <ScrollButton variant='secondary' className="shadow-sm border" />
                    </div>
                </ChatContainerRoot>
            </div>

            <div className="z-10 shrink-0 px-3 pb-3 md:px-5 md:pb-5">
                <div className="mx-auto max-w-4xl">
                    <PromptInput
                        isLoading={isLoading}
                        value={prompt}
                        onValueChange={setPrompt}
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col">
                            <PromptInputTextarea
                                placeholder="Ask anything"
                                className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3]"
                            />

                            <PromptInputActions className="mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3">
                                <div className="flex items-center gap-2">
                                    <PromptInputAction tooltip="Add a new action">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="size-9 rounded-full"
                                        >
                                            <Plus size={18} />
                                        </Button>
                                    </PromptInputAction>

                                    <PromptInputAction tooltip="Search">
                                        <Button variant="outline" className="rounded-full px-3 md:px-4">
                                            <Globe size={18} />
                                            <span className="hidden md:inline">Search</span>
                                        </Button>
                                    </PromptInputAction>

                                    <PromptInputAction tooltip="More actions">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="size-9 rounded-full"
                                        >
                                            <MoreHorizontal size={18} />
                                        </Button>
                                    </PromptInputAction>
                                </div>
                                <div className="flex items-center gap-2">
                                    <PromptInputAction tooltip="Voice input">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="size-9 rounded-full"
                                        >
                                            <Mic size={18} />
                                        </Button>
                                    </PromptInputAction>

                                    <Button
                                        size="icon"
                                        disabled={!prompt.trim() || isLoading}
                                        onClick={handleSubmit}
                                        className="size-9 rounded-full"
                                    >
                                        {!isLoading ? (
                                            <ArrowUp size={18} />
                                        ) : (
                                            <FaStop size={18} />
                                        )}
                                    </Button>
                                </div>
                            </PromptInputActions>
                        </div>
                    </PromptInput>
                </div>
            </div>
        </main>
    )
}

function FullChatApp() {
    return (
        <ChatContent />
    )
}

export { FullChatApp }
