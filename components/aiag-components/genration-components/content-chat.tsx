// 'use client';

// import React, { useState, useRef, useEffect } from "react";
// import { Label } from "@/components/ui/label";
// import { PdfFileDropzone } from "@/components/aiag-components/reusable-components/uploads/PdfFileDropzone";
// import { Button } from "@/components/ui/button";
// import { generateNewContent } from "@/actions/generate-new-content";
// import { getChatSystemPrompt } from "@/lib/aiag/prompts";
// import { knowledgeBaseContent } from "@/lib/aiag/knowledge_base";
// import { LuLoaderCircle } from "react-icons/lu";
// import remarkGfm from "remark-gfm";
// import ReactMarkdown from "react-markdown";
// import { LineSpinner } from "@/shared/spinner";
// import { Input } from "@/components/ui/input";

// interface Message {
//     role: 'user' | 'assistant';
//     content: string;
// }

// export function ContentChat({ originalContent, modelAlias, temperature }: any) {
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [input, setInput] = useState<string>("");
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([]);
//     const [referenceMaterial, setReferenceMaterial] = useState<string>();
//     const chatContainerRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         chatContainerRef.current?.scrollTo({
//             top: chatContainerRef.current.scrollHeight,
//             behavior: 'smooth',
//         });
//     }, [messages]);

//     const formatConversationHistory = (msgs: Message[]): string => {
//         if (!msgs || msgs.length === 0) return "No history yet.";
//         return msgs.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
//     };

//     const handleSendMessage = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!input.trim() || isLoading) return;

//         const userMessage: Message = { role: 'user', content: input };
//         const updatedMessages = [...messages, userMessage];
//         setMessages(updatedMessages);
//         setIsLoading(true);
//         setInput("");

//         const systemPrompt = getChatSystemPrompt({
//             originalContent: originalContent,
//             conversationHistory: formatConversationHistory(updatedMessages),
//             uploadedFileText: referenceMaterial,
//             knowledgeBaseContent: knowledgeBaseContent,
//         });

//         const generateChatData = {
//             modelAlias: modelAlias,
//             temperature: temperature,
//             systemPrompt: systemPrompt,
//             userPrompt: input,
//         };

//         const result = await generateNewContent(generateChatData);
//         setIsLoading(false);

//         const assistantMessage: Message = {
//             role: 'assistant',
//             content: result.generatedText || `Sorry, I encountered an error. ${result.errorReason || 'Please try again.'}`
//         };

//         setMessages(prev => [...prev, assistantMessage]);
//         setUploadedPdfs([]);
//         setReferenceMaterial(undefined);
//     };

//     return (
//         <section className="space-y-4 flex flex-col h-[90vh]">
//             <div>
//                 <span className="text-lg tracking-tight font-bold">Chat with Generated Content</span>
//                 <Label className="text-sm text-muted-foreground">Upload docs for chat (Optional)</Label>
//             </div>

//             <div ref={chatContainerRef} className="flex-1 overflow-y-auto  space-y-4 pr-2">
//                 {messages.length === 0 ? (
//                     <div className="flex items-center justify-center h-full text-muted-foreground">
//                         Start the conversation by typing below.
//                     </div>
//                 ) : (
//                     messages.map((msg, index) => (
//                         <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//                             <div className={`max-w-xl p-2 rounded-lg text-[15px] ${msg.role === 'user' ? 'bg-primary text-primary-foreground border ' : 'bg-accent border '}`}>
//                                 <div className="markdown-body-sm text-[15px]">
//                                     <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 )}
//                 {isLoading && (
//                     <div className="flex justify-start">
//                         <div className="max-w-xl p-2 rounded-lg bg-accent border">
//                             <LineSpinner>Thinking</LineSpinner>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             <div className=" pt-2">
//                 <PdfFileDropzone
//                     files={uploadedPdfs}
//                     setFiles={setUploadedPdfs}
//                     setReferenceMaterial={setReferenceMaterial}
//                     maxFiles={1}
//                 />
//             </div>

//             <form onSubmit={handleSendMessage} className="flex items-center gap-2 ">
//                 <Input
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     placeholder="Ask a question about the generated content..."
//                     onKeyDown={(e) => {
//                         if (e.key === 'Enter' && !e.shiftKey) {
//                             e.preventDefault();
//                             handleSendMessage(e);
//                         }
//                     }}
//                     disabled={isLoading}
//                 />
//                 <Button type="submit" disabled={isLoading || !input.trim()}>
//                     {isLoading ? <LuLoaderCircle className="text-background size-3 animate-spin" /> : 'Send'}
//                 </Button>
//             </form>
//         </section>
//     );
// }





// 'use client'

// import React, { useState, useRef, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { LuLoaderCircle } from "react-icons/lu";
// import remarkGfm from "remark-gfm";
// import ReactMarkdown from "react-markdown";
// import { LineSpinner } from "@/shared/spinner";
// import { PdfFileDropzone } from "../reusable-components/uploads/PdfFileDropzone";

// export function ContentChat({ originalContent, chatHistory = [], handleChatSend }: any) {
//     const [messages, setMessages] = useState(chatHistory);
//     const [input, setInput] = useState<string>("");
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([]);
//     const [chatPdfInfo, setChatPdfInfo] = useState<any>();
//     const chatContainerRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         setMessages(chatHistory);
//     }, [chatHistory])

//     useEffect(() => {
//         chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
//     }, [messages]);

//     const handleSend = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!input.trim() || isLoading) return;

//         setIsLoading(true);
//         const currentInput = input;
//         const currentPdfInfo = chatPdfInfo;

//         setInput("");
//         setUploadedPdfs([]);
//         setChatPdfInfo(undefined);

//         setMessages((prev:any) => [...prev, { role: 'user', content: currentInput }]);

//         await handleChatSend(currentInput, currentPdfInfo);

//         setIsLoading(false);
//     };

//     return (
//         <section className="space-y-4 flex flex-col h-[90vh]">
//             <div>
//                 <span className="text-lg tracking-tight font-bold">Chat with Generated Content</span>
//             </div>

//             <div ref={chatContainerRef} className="flex-1 overflow-y-auto  space-y-4 pr-2">
//                 {messages.length === 0 && !isLoading ? (
//                     <div className="flex items-center justify-center h-full text-muted-foreground">
//                         Start the conversation by typing below.
//                     </div>
//                 ) : (
//                     messages.map((msg: any, index: number) => (
//                         <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//                             <div className={`max-w-xl p-2 rounded-lg text-[15px] ${msg.role === 'user' ? 'bg-primary text-primary-foreground border ' : 'bg-accent border '}`}>
//                                 <div className="markdown-body-sm text-[15px]">
//                                     <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 )}
//                 {isLoading && (
//                     <div className="flex justify-start">
//                         <div className="max-w-xl p-2 rounded-lg bg-accent border">
//                             <LineSpinner>Thinking</LineSpinner>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             <div className="space-y-2 pt-2">
//                 <Label className="text-sm text-muted-foreground">Upload docs for chat (Optional)</Label>
//                 <PdfFileDropzone files={uploadedPdfs} setFiles={setUploadedPdfs} setReferenceMaterial={setChatPdfInfo} maxFiles={1} />
//             </div>

//             <form onSubmit={handleSend} className="flex items-center gap-2 ">
//                 <Input
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     placeholder="Ask a question about the generated content..."
//                     onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
//                     disabled={isLoading}
//                 />
//                 <Button type="submit" disabled={isLoading || !input.trim()}>
//                     {isLoading ? <LuLoaderCircle className="text-background size-3 animate-spin" /> : 'Send'}
//                 </Button>
//             </form>
//         </section>
//     );
// }









// 'use client'

// import React, { useState, useRef, useEffect } from "react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { LuLoaderCircle } from "react-icons/lu";
// import remarkGfm from "remark-gfm";
// import ReactMarkdown from "react-markdown";
// import { LineSpinner } from "@/shared/spinner";
// import { PdfFileDropzone } from "../reusable-components/uploads/PdfFileDropzone";

// export function ContentChat({ chatHistory = [], handleChatSend, onChatFileChange, chatPdfInfo }: any) {
//     const [messages, setMessages] = useState(chatHistory);
//     const [input, setInput] = useState<string>("");
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const chatContainerRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         setMessages(chatHistory);
//     }, [chatHistory])

//     useEffect(() => {
//         chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
//     }, [messages]);

//     const handleSend = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!input.trim() || isLoading) return;

//         setIsLoading(true);
//         const currentInput = input;
//         setInput("");

//         setMessages((prev: any) => [...prev, { role: 'user', content: currentInput }]);

//         await handleChatSend(currentInput);

//         setIsLoading(false);
//     };

//     return (
//         <section className="space-y-4 flex flex-col h-[90vh]">
//             <div>
//                 <span className="text-lg tracking-tight font-bold">Chat with Generated Content</span>
//             </div>

//             <div ref={chatContainerRef} className="flex-1 overflow-y-auto  space-y-4 pr-2">
//                 {messages.length === 0 && !isLoading ? (
//                     <div className="flex items-center justify-center h-full text-muted-foreground">
//                         Start the conversation by typing below.
//                     </div>
//                 ) : (
//                     messages.map((msg: any, index: number) => (
//                         <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
//                             <div className={`max-w-xl p-2 rounded-lg text-[15px] ${msg.role === 'user' ? 'bg-primary text-primary-foreground border ' : 'bg-accent border '}`}>
//                                 <div className="markdown-body-sm text-[15px]">
//                                     <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 )}
//                 {isLoading && (
//                     <div className="flex justify-start">
//                         <div className="max-w-xl p-2 rounded-lg bg-accent border">
//                             <LineSpinner>Thinking</LineSpinner>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             <div className="space-y-2 pt-2">
//                 <Label className="text-sm text-muted-foreground">Upload docs for chat (Optional)</Label>
//                 <PdfFileDropzone
//                     onFileChange={onChatFileChange}
//                     initialFileInfo={chatPdfInfo}
//                 />
//             </div>

//             <form onSubmit={handleSend} className="flex items-center gap-2 ">
//                 <Input
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     placeholder="Ask a question about the generated content..."
//                     onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
//                     disabled={isLoading}
//                 />
//                 <Button type="submit" disabled={isLoading || !input.trim()}>
//                     {isLoading ? <LuLoaderCircle className="text-background size-3 animate-spin" /> : 'Send'}
//                 </Button>
//             </form>
//         </section>
//     );
// }
















'use client'

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LuLoaderCircle } from "react-icons/lu";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { LineSpinner } from "@/shared/spinner";
import { PdfFileDropzone } from "../reusable-components/uploads/PdfFileDropzone";

export function ContentChat({ chatHistory = [], handleChatSend, onChatFileChange, chatPdfInfo, isChatLoading }: any) {
    const [messages, setMessages] = useState(chatHistory);
    const [input, setInput] = useState<string>("");
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages(chatHistory);
    }, [chatHistory])

    useEffect(() => {
        chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isChatLoading) return;
        const currentInput = input;
        setInput("");
        setMessages((prev: any) => [...prev, { role: 'user', content: currentInput }]);
        await handleChatSend(currentInput);
    };
    
    return (
        <section className="space-y-4 flex flex-col h-[90vh]">
            <div>
                <span className="text-lg tracking-tight font-bold">Chat with Generated Content</span>
            </div>

            <div ref={chatContainerRef} className="flex-1 overflow-y-auto  space-y-4 pr-2">
                {messages.length === 0 && !isChatLoading ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        Start the conversation by typing below.
                    </div>
                ) : (
                    messages.map((msg: any, index: number) => (
                        <div key={index} className="flex items-start gap-2 my-2 no-scrollbar">
                            {/* Avatar */}
                            <img
                                src={msg.role === 'user' ? 'https://lh3.googleusercontent.com/a/ACg8ocKctIUVaiLHfumqG0mGTEmK6sc2AgpaTJzxnOU4J-h1S-wY0y-h=s96-c' : 'http://localhost:3000/_next/image?url=https%3A%2F%2Fi.postimg.cc%2FZYDgZQyF%2Faiag-logo.jpg&w=256&q=75'}
                                alt={`${msg.role} avatar`}
                                className={`w-9 h-9 border rounded-md object-cover mt-1 ${msg.role !== 'user' && 'mt-3'} `}
                            />

                            <div className={`w-full p-2 rounded-lg text-[15px]  ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : ''
                                    }`}
                            >
                                <div className="markdown-body space-y-1 text-[15px]">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        </div>

                    ))
                )}
                {isChatLoading && (
                    <div className="flex items-start gap-2 my-2">
                        <img
                            src={'http://localhost:3000/_next/image?url=https%3A%2F%2Fi.postimg.cc%2FZYDgZQyF%2Faiag-logo.jpg&w=256&q=75'}
                            alt={` avatar`}
                            className="w-9 h-9 border rounded-md object-cover mt-1"
                        />
                        <span className="p-2"> <LineSpinner>Thinking</LineSpinner></span>
                    </div>
                )}
            </div>

            <div className="space-y-2 pt-2">
                <Label className="text-sm text-muted-foreground">Upload docs for chat (Optional)</Label>
                <PdfFileDropzone
                    onFileChange={onChatFileChange}
                    initialFileInfo={chatPdfInfo}
                />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 ">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about the generated content..."
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                    disabled={isChatLoading}
                />
                <Button type="submit" disabled={isChatLoading || !input.trim()}>
                    {isChatLoading ? <LuLoaderCircle className="text-background size-3 animate-spin" /> : 'Send'}
                </Button>
            </form>
        </section>
    );
}