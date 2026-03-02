### Prompt input with actions

"use client"

import {
PromptInput,
PromptInputAction,
PromptInputActions,
PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { Button } from "@/components/ui/button"
import { ArrowUp, Globe, Mic, MoreHorizontal, Plus } from "lucide-react"
import type React from "react"
import { useState } from "react"

function PromptInputWithActions() {
const [prompt, setPrompt] = useState("")
const [isLoading, setIsLoading] = useState(false)

const handleSubmit = () => {
if (!prompt.trim()) return

    setIsLoading(true)

    // Simulate API call
    console.log("Processing:", prompt)
    setTimeout(() => {
      setPrompt("")
      setIsLoading(false)
    }, 1500)

}

return (
<div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-3 pb-3 md:px-5 md:pb-5">
<PromptInput
        isLoading={isLoading}
        value={prompt}
        onValueChange={setPrompt}
        onSubmit={handleSubmit}
        className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
      >
<div className="flex flex-col">
<PromptInputTextarea
            placeholder="Ask anything"
            className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
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
                <Button variant="outline" className="rounded-full">
                  <Globe size={18} />
                  Search
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
                  <span className="size-3 rounded-xs bg-white" />
                )}
              </Button>
            </div>
          </PromptInputActions>
        </div>
      </PromptInput>
    </div>

)
}

export { PromptInputWithActions }

---

### Basic full conversation

"use client"

import {
ChatContainerContent,
ChatContainerRoot,
} from "@/components/prompt-kit/chat-container"
import { Message, MessageContent } from "@/components/prompt-kit/message"
import { cn } from "@/lib/utils"

const messages = [
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
"Creating a responsive layout with CSS Grid is straightforward. Here's a basic example:\n\n```css\n.container {\n display: grid;\n grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n gap: 1rem;\n}\n```\n\nThis creates a grid where:\n- Columns automatically fit as many as possible\n- Each column is at least 250px wide\n- Columns expand to fill available space\n- There's a 1rem gap between items\n\nWould you like me to explain more about how this works?",
},
{
id: 5,
role: "user",
content: "What is the capital of France?",
},
{
id: 6,
role: "assistant",
content: "The capital of France is Paris.",
},
]

function FullConversation() {
return (
<ChatContainerRoot className="w-full">
<ChatContainerContent className="space-y-12 overflow-y-auto px-4 py-12">
{messages.map((message) => {
const isAssistant = message.role === "assistant"

          return (
            <Message
              key={message.id}
              className={cn(
                "mx-auto flex w-full max-w-3xl flex-col gap-2 px-0 md:px-6",
                isAssistant ? "items-start" : "items-end"
              )}
            >
              {isAssistant ? (
                <MessageContent
                  className="text-foreground prose w-full flex-1 rounded-lg bg-transparent p-2"
                  markdown
                >
                  {message.content}
                </MessageContent>
              ) : (
                <MessageContent className="bg-primary text-primary-foreground max-w-[85%] sm:max-w-[75%]">
                  {message.content}
                </MessageContent>
              )}
            </Message>
          )
        })}
      </ChatContainerContent>
    </ChatContainerRoot>

)
}

export { FullConversation }

### Conversation with avatars

"use client"

import {
ChatContainerContent,
ChatContainerRoot,
} from "@/components/prompt-kit/chat-container"
import {
Message,
MessageAvatar,
MessageContent,
} from "@/components/prompt-kit/message"
import { cn } from "@/lib/utils"

const messages = [
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
"Creating a responsive layout with CSS Grid is straightforward. Here's a basic example:\n\n```css\n.container {\n display: grid;\n grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n gap: 1rem;\n}\n```\n\nThis creates a grid where:\n- Columns automatically fit as many as possible\n- Each column is at least 250px wide\n- Columns expand to fill available space\n- There's a 1rem gap between items\n\nWould you like me to explain more about how this works?",
},
{
id: 5,
role: "user",
content: "What is the capital of France?",
},
{
id: 6,
role: "assistant",
content: "The capital of France is Paris.",
},
]

function ConversationWithAvatars() {
return (
<ChatContainerRoot className="px-1 py-12 md:px-4">
<ChatContainerContent className="space-y-12 px-1 py-12 md:px-4">
{messages.map((message) => {
const isAssistant = message.role === "assistant"

          return (
            <Message
              key={message.id}
              className={cn(
                "mx-auto flex w-full max-w-3xl flex-col gap-2 px-0 md:px-6",
                isAssistant ? "items-start" : "items-end"
              )}
            >
              <div
                className={cn(
                  "flex w-full items-end gap-3",
                  isAssistant ? "flex-row" : "flex-row-reverse"
                )}
              >
                {isAssistant ? (
                  <MessageAvatar
                    className="mb-0.5 h-6 w-6"
                    src="https://prompt-kit.com/logo.png"
                    alt={`Avatar of the assistant`}
                  />
                ) : (
                  <MessageAvatar
                    className="h-6 w-6"
                    src="https://github.com/ibelick.png"
                    alt={`Avatar of the user`}
                  />
                )}
                {isAssistant ? (
                  <MessageContent
                    className="prose text-primary w-full max-w-[85%] flex-1 overflow-x-auto rounded-lg bg-transparent p-0 py-0 sm:max-w-[75%]"
                    markdown
                  >
                    {message.content}
                  </MessageContent>
                ) : (
                  <MessageContent className="bg-secondary text-primary max-w-[85%] sm:max-w-[75%]">
                    {message.content}
                  </MessageContent>
                )}
              </div>
            </Message>
          )
        })}
      </ChatContainerContent>
    </ChatContainerRoot>

)
}

export { ConversationWithAvatars }

### Conversation with actions

"use client"

import {
ChatContainerContent,
ChatContainerRoot,
} from "@/components/prompt-kit/chat-container"
import {
Message,
MessageAction,
MessageActions,
MessageContent,
} from "@/components/prompt-kit/message"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Copy, Pencil, ThumbsDown, ThumbsUp, Trash } from "lucide-react"

const messages = [
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
"Creating a responsive layout with CSS Grid is straightforward. Here's a basic example:\n\n```css\n.container {\n display: grid;\n grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n gap: 1rem;\n}\n```\n\nThis creates a grid where:\n- Columns automatically fit as many as possible\n- Each column is at least 250px wide\n- Columns expand to fill available space\n- There's a 1rem gap between items\n\nWould you like me to explain more about how this works?",
},
{
id: 5,
role: "user",
content: "What is the capital of France?",
},
{
id: 6,
role: "assistant",
content: "The capital of France is Paris.",
},
]

function ConversationWithActions() {
return (
<ChatContainerRoot className="px-4 py-12">
<ChatContainerContent>
{messages.map((message, index) => {
const isAssistant = message.role === "assistant"
const isLastMessage = index === messages.length - 1

          return (
            <Message
              key={message.id}
              className={cn(
                "mx-auto flex w-full max-w-3xl flex-col gap-2 px-0 md:px-6",
                isAssistant ? "items-start" : "items-end"
              )}
            >
              {isAssistant ? (
                <div className="group flex w-full flex-col gap-0">
                  <MessageContent
                    className="text-foreground prose w-full flex-1 rounded-lg bg-transparent p-0"
                    markdown
                  >
                    {message.content}
                  </MessageContent>
                  <MessageActions
                    className={cn(
                      "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                      isLastMessage && "opacity-100"
                    )}
                  >
                    <MessageAction tooltip="Copy" delayDuration={100}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <Copy />
                      </Button>
                    </MessageAction>
                    <MessageAction tooltip="Upvote" delayDuration={100}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <ThumbsUp />
                      </Button>
                    </MessageAction>
                    <MessageAction tooltip="Downvote" delayDuration={100}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <ThumbsDown />
                      </Button>
                    </MessageAction>
                  </MessageActions>
                </div>
              ) : (
                <div className="group flex flex-col items-end gap-1">
                  <MessageContent className="bg-muted text-primary max-w-[85%] rounded-3xl px-5 py-2.5 sm:max-w-[75%]">
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
                        className="rounded-full"
                      >
                        <Pencil />
                      </Button>
                    </MessageAction>
                    <MessageAction tooltip="Delete" delayDuration={100}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <Trash />
                      </Button>
                    </MessageAction>
                    <MessageAction tooltip="Copy" delayDuration={100}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
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
    </ChatContainerRoot>

)
}

export { ConversationWithActions }

### Conversation with scroll to bottom

"use client"

import {
ChatContainerContent,
ChatContainerRoot,
ChatContainerScrollAnchor,
} from "@/components/prompt-kit/chat-container"
import { Message, MessageContent } from "@/components/prompt-kit/message"
import { ScrollButton } from "@/components/prompt-kit/scroll-button"
import { cn } from "@/lib/utils"

const messages = [
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
"Creating a responsive layout with CSS Grid is straightforward. Here's a basic example:\n\n```css\n.container {\n display: grid;\n grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n gap: 1rem;\n}\n```\n\nThis creates a grid where:\n- Columns automatically fit as many as possible\n- Each column is at least 250px wide\n- Columns expand to fill available space\n- There's a 1rem gap between items\n\nWould you like me to explain more about how this works?",
},
{
id: 5,
role: "user",
content: "What is the capital of France?",
},
{
id: 6,
role: "assistant",
content: "The capital of France is Paris.",
},
{
id: 7,
role: "user",
content: "Can you tell me more about CSS Grid?",
},
{
id: 8,
role: "assistant",
content:
"Sure! CSS Grid is a powerful two-dimensional layout system designed for the browser. Unlike Flexbox which is primarily designed for either a row or a column, Grid can work with both rows and columns together.\n\nHere are some key features of CSS Grid:\n\n1. **Two-dimensional layout**: Control both rows and columns simultaneously\n2. **Grid lines**: Position items by referencing grid lines\n3. **Grid tracks**: Rows and columns can be explicitly sized or can adjust automatically\n4. **Grid cells**: Intersections of rows and columns\n5. **Grid areas**: Named regions spanning multiple grid cells\n\nBasic syntax example:\n```css\n.container {\n display: grid;\n grid-template-columns: 1fr 2fr 1fr;\n grid-template-rows: auto 200px auto;\n gap: 20px;\n}\n\n.item {\n grid-column: 1 / 3; /* Start at line 1, end at line 3 */\n grid-row: 2 / 3; /* Start at line 2, end at line 3 */\n}\n```\n\nThis creates a layout with three columns (the middle one being twice as wide) and three rows (middle one fixed at 200px), with 20px gaps between all cells.",
},
{
id: 9,
role: "user",
content: "What about Flexbox vs Grid?",
},
{
id: 10,
role: "assistant",
content:
"**Flexbox vs. Grid: When to Use Each**\n\n**Flexbox (one-dimensional):**\n- Best for arranging items in a single row or column\n- Great for distributing space among items within a container\n- Perfect for:\n - Navigation menus\n - Card layouts with variable content length\n - Centering items vertically and horizontally\n - Simple layouts that need to be flexible in one direction\n\n**Grid (two-dimensional):**\n- Best for complex layouts with both rows and columns\n- Excellent for precisely positioning items in a grid system\n- Perfect for:\n - Full-page layouts\n - Dashboard interfaces\n - Image galleries with consistent spacing\n - Any design that requires alignment across both rows and columns\n\n**When to use both:**\nIt's common to use Grid for the main page layout and Flexbox for individual components within that layout. They complement each other well!",
},
{
id: 11,
role: "user",
content: "Thanks for all this information about CSS layouts!",
},
{
id: 12,
role: "assistant",
content:
"You're welcome! CSS layout systems like Flexbox and Grid have revolutionized web design, making it much easier to create responsive and complex layouts without relying on hacks or workarounds.\n\nIf you ever have more questions about CSS or web development in general, feel free to ask. Happy coding! 😊",
},
]

function ConversationWithScrollBottom() {
return (
<div className="relative flex h-screen flex-1 flex-col overflow-hidden">
<ChatContainerRoot className="h-full overflow-y-auto">
<ChatContainerContent className="space-y-12 px-4 py-12">
{messages.map((message) => {
const isAssistant = message.role === "assistant"

            return (
              <Message
                key={message.id}
                className={cn(
                  "mx-auto flex w-full max-w-3xl flex-col gap-2 px-0 md:px-6",
                  isAssistant ? "items-start" : "items-end"
                )}
              >
                {isAssistant ? (
                  <MessageContent
                    className="text-foreground prose w-full flex-1 rounded-lg bg-transparent p-2"
                    markdown
                  >
                    {message.content}
                  </MessageContent>
                ) : (
                  <MessageContent className="bg-primary text-primary-foreground max-w-[85%] sm:max-w-[75%]">
                    {message.content}
                  </MessageContent>
                )}
              </Message>
            )
          })}
          <ChatContainerScrollAnchor />
        </ChatContainerContent>

        <div className="absolute right-7 bottom-4 z-10">
          <ScrollButton
            className="bg-primary hover:bg-primary/90 shadow-sm"
            variant="default"
            size="icon"
          />
        </div>
      </ChatContainerRoot>
    </div>

)
}

export { ConversationWithScrollBottom }

### Conversation with prompt input

"use client"

import {
ChatContainerContent,
ChatContainerRoot,
} from "@/components/prompt-kit/chat-container"
import {
Message,
MessageAction,
MessageActions,
MessageContent,
} from "@/components/prompt-kit/message"
import {
PromptInput,
PromptInputAction,
PromptInputActions,
PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
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
import { useState } from "react"

const messages = [
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
"Creating a responsive layout with CSS Grid is straightforward. Here's a basic example:\n\n```css\n.container {\n display: grid;\n grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n gap: 1rem;\n}\n```\n\nThis creates a grid where:\n- Columns automatically fit as many as possible\n- Each column is at least 250px wide\n- Columns expand to fill available space\n- There's a 1rem gap between items\n\nWould you like me to explain more about how this works?",
},
{
id: 5,
role: "user",
content: "What is the capital of France?",
},
{
id: 6,
role: "assistant",
content: "The capital of France is Paris.",
},
]

function ConversationPromptInput() {
const [prompt, setPrompt] = useState("")
const [isLoading, setIsLoading] = useState(false)
const [chatMessages, setChatMessages] = useState(messages)

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
<div className="flex h-screen flex-col overflow-hidden">
<ChatContainerRoot className="relative flex-1 space-y-0 overflow-y-auto px-4 py-12">
<ChatContainerContent className="space-y-12 px-4 py-12">
{chatMessages.map((message, index) => {
const isAssistant = message.role === "assistant"
const isLastMessage = index === chatMessages.length - 1

            return (
              <Message
                key={message.id}
                className={cn(
                  "mx-auto flex w-full max-w-3xl flex-col gap-2 px-0 md:px-6",
                  isAssistant ? "items-start" : "items-end"
                )}
              >
                {isAssistant ? (
                  <div className="group flex w-full flex-col gap-0">
                    <MessageContent
                      className="text-foreground prose w-full flex-1 rounded-lg bg-transparent p-0"
                      markdown
                    >
                      {message.content}
                    </MessageContent>
                    <MessageActions
                      className={cn(
                        "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                        isLastMessage && "opacity-100"
                      )}
                    >
                      <MessageAction tooltip="Edit" delayDuration={100}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <Copy />
                        </Button>
                      </MessageAction>
                      <MessageAction tooltip="Upvote" delayDuration={100}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <ThumbsUp />
                        </Button>
                      </MessageAction>
                      <MessageAction tooltip="Downvote" delayDuration={100}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <ThumbsDown />
                        </Button>
                      </MessageAction>
                    </MessageActions>
                  </div>
                ) : (
                  <div className="group flex flex-col items-end gap-1">
                    <MessageContent className="bg-muted text-primary max-w-[85%] rounded-3xl px-5 py-2.5 sm:max-w-[75%]">
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
                          className="rounded-full"
                        >
                          <Pencil />
                        </Button>
                      </MessageAction>
                      <MessageAction tooltip="Delete" delayDuration={100}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <Trash />
                        </Button>
                      </MessageAction>
                      <MessageAction tooltip="Copy" delayDuration={100}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
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
      </ChatContainerRoot>
      <div className="inset-x-0 bottom-0 mx-auto w-full max-w-3xl shrink-0 px-3 pb-3 md:px-5 md:pb-5">
        <PromptInput
          isLoading={isLoading}
          value={prompt}
          onValueChange={setPrompt}
          onSubmit={handleSubmit}
          className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
        >
          <div className="flex flex-col">
            <PromptInputTextarea
              placeholder="Ask anything"
              className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
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
                  <Button variant="outline" className="rounded-full">
                    <Globe size={18} />
                    Search
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
                    <span className="size-3 rounded-xs bg-white" />
                  )}
                </Button>
              </div>
            </PromptInputActions>
          </div>
        </PromptInput>
      </div>
    </div>

)
}

export { ConversationPromptInput }

### Prompt input with suggestions

"use client"

import {
PromptInput,
PromptInputActions,
PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { PromptSuggestion } from "@/components/prompt-kit/prompt-suggestion"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon, BrainIcon } from "lucide-react"
import { useState } from "react"

const suggestionGroups = [
{
label: "Summary",
highlight: "Summarize",
items: [
"Summarize a document",
"Summarize a video",
"Summarize a podcast",
"Summarize a book",
],
},
{
label: "Code",
highlight: "Help me",
items: [
"Help me write React components",
"Help me debug code",
"Help me learn Python",
"Help me learn SQL",
],
},
{
label: "Design",
highlight: "Design",
items: [
"Design a small logo",
"Design a hero section",
"Design a landing page",
"Design a social media post",
],
},
{
label: "Research",
highlight: "Research",
items: [
"Research the best practices for SEO",
"Research the best running shoes",
"Research the best restaurants in Paris",
"Research the best AI tools",
],
},
]

export function PromptInputWithSuggestions() {
const [inputValue, setInputValue] = useState("")
const [activeCategory, setActiveCategory] = useState("")

const handleSend = () => {
if (inputValue.trim()) {
console.log("Sending:", inputValue)
setInputValue("")
setActiveCategory("")
}
}

const handleKeyDown = (e: React.KeyboardEvent) => {
if (e.key === "Enter" && !e.shiftKey) {
e.preventDefault()
handleSend()
}
}

const handlePromptInputValueChange = (value: string) => {
setInputValue(value)
// Clear active category when typing something different
if (value.trim() === "") {
setActiveCategory("")
}
}

// Get suggestions based on active category
const activeCategoryData = suggestionGroups.find(
(group) => group.label === activeCategory
)

// Determine which suggestions to show
const showCategorySuggestions = activeCategory !== ""

return (
<div className="absolute inset-x-0 top-1/2 mx-auto flex max-w-3xl -translate-y-1/2 flex-col items-center justify-center gap-4 px-3 pb-3 md:px-5 md:pb-5">
<PromptInput
        className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
        value={inputValue}
        onValueChange={handlePromptInputValueChange}
        onSubmit={handleSend}
      >
<PromptInputTextarea
          placeholder="Ask anything..."
          className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
          onKeyDown={handleKeyDown}
        />
<PromptInputActions className="mt-5 flex w-full items-end justify-end gap-2 px-3 pb-3">
<Button
            size="sm"
            className="h-9 w-9 rounded-full"
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
<ArrowUpIcon className="h-4 w-4" />
</Button>
</PromptInputActions>
</PromptInput>

      <div className="relative flex w-full flex-col items-center justify-center space-y-2">
        <div className="absolute top-0 left-0 h-[70px] w-full">
          {showCategorySuggestions ? (
            <div className="flex w-full flex-col space-y-1">
              {activeCategoryData?.items.map((suggestion) => (
                <PromptSuggestion
                  key={suggestion}
                  highlight={activeCategoryData.highlight}
                  onClick={() => {
                    setInputValue(suggestion)
                    // Optional: auto-send
                    // handleSend()
                  }}
                >
                  {suggestion}
                </PromptSuggestion>
              ))}
            </div>
          ) : (
            <div className="relative flex w-full flex-wrap items-stretch justify-start gap-2">
              {suggestionGroups.map((suggestion) => (
                <PromptSuggestion
                  key={suggestion.label}
                  onClick={() => {
                    setActiveCategory(suggestion.label)
                    setInputValue("") // Clear input when selecting a category
                  }}
                  className="capitalize"
                >
                  <BrainIcon  />
                  {suggestion.label}
                </PromptSuggestion>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

)
}

---

import { createOpenAI } from "@ai-sdk/openai"
import { convertToModelMessages, streamText, tool, UIMessage } from "ai"
import { z } from "zod"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
const { messages, apiKey }: { messages: UIMessage[]; apiKey?: string } =
await req.json()

if (!apiKey) {
return new Response("OpenAI API key is required", { status: 400 })
}

const openai = createOpenAI({ apiKey })

const result = streamText({
model: openai("gpt-4.1-nano"),
system:
"You are a helpful assistant with access to tools. Use the getCurrentDate tool when users ask about dates, time, or current information. You are also able to use the getTime tool to get the current time in a specific timezone.",
messages: convertToModelMessages(messages),
tools: {
getTime: tool({
description: "Get the current time in a specific timezone",
inputSchema: z.object({
timezone: z
.string()
.describe("A valid IANA timezone, e.g. 'Europe/Paris'"),
}),
execute: async ({ timezone }) => {
try {
const now = new Date()
const time = now.toLocaleString("en-US", {
timeZone: timezone,
hour: "2-digit",
minute: "2-digit",
second: "2-digit",
hour12: false,
})

            return { time, timezone }
          } catch {
            return { error: "Invalid timezone format." }
          }
        },
      }),
      getCurrentDate: tool({
        description: "Get the current date and time with timezone information",
        inputSchema: z.object({}),
        execute: async () => {
          const now = new Date()
          return {
            timestamp: now.getTime(),
            iso: now.toISOString(),
            local: now.toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZoneName: "short",
            }),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            utc: now.toUTCString(),
          }
        },
      }),
    },

})

return result.toUIMessageStreamResponse()
}
