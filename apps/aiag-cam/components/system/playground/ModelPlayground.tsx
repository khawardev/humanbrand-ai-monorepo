'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Bot, User, Trash2 } from 'lucide-react';
import { ModelsSection } from '@/components/shared/selections/ModelsSection';
import { modelTabs } from '@/config/formData';
import { generateNewContent } from '@/server/actions/generateNewContentActions';
import { toast } from 'sonner';
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
    role: 'user' | 'assistant';
    content: string;
    model?: string;
};

export function ModelPlayground() {
    const [selectedModelId, setSelectedModelId] = useState<number>(1);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const selectedModelAlias = modelTabs.find(m => m.id === selectedModelId)?.label || 'recommended';

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            // We use 'chat' type to test general chat capabilities or 'ai_chat' if specific logic needed.
            // Using 'chat' for direct prompt testing seems appropriate for a playground.
            const result = await generateNewContent({
                type: 'chat',
                modelAlias: selectedModelAlias as any,
                userPrompt: userMsg.content,
                conversationHistory: messages.map(m => `${m.role}: ${m.content}`).join('\n'), // Simple history context
                temperature: 0.7
            });

            if (result.errorReason) {
                toast.error(`Error: ${result.errorReason}`);
                setMessages(prev => [...prev, { 
                    role: 'assistant', 
                    content: `Error: ${result.errorReason}`,
                    model: selectedModelAlias 
                }]);
            } else if (result.generatedText) {
                setMessages(prev => [...prev, { 
                    role: 'assistant', 
                    content: result.generatedText!, 
                    model: selectedModelAlias
                }]);
            }
        } catch (error) {
            console.error("Playground error:", error);
            toast.error("Failed to generate response.");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setMessages([]);
        setInput('');
    };

    return (
        <Card className="w-full h-[600px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                <div className="space-y-1">
                    <CardTitle>Model Playground</CardTitle>
                    <CardDescription>Test different AI models interactively.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleClear} title="Clear Chat">
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden relative">
                 <div className="absolute top-2 right-2 z-10">
                     <ModelsSection 
                        selectedValue={selectedModelId} 
                        onValueChange={setSelectedModelId} 
                        variant="minimal"
                    />
                 </div>
                <ScrollArea className="h-full p-4">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-2 mt-20">
                            <Bot className="h-12 w-12" />
                            <p>Select a model and start chatting to test.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 pb-4">
                            {messages.map((msg, idx) => (
                                <div 
                                    key={idx} 
                                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div 
                                        className={`max-w-[80%] rounded-lg p-3 ${
                                            msg.role === 'user' 
                                                ? 'bg-primary text-primary-foreground' 
                                                : 'bg-muted border'
                                        }`}
                                    >
                                        {msg.role === 'assistant' && (
                                            <div className="flex items-center gap-1 mb-1 opacity-70 border-b pb-1 border-border/50">
                                                <Bot className="h-3 w-3" />
                                                <span className="text-[10px] font-mono uppercase">
                                                    {msg.model || 'AI'}
                                                </span>
                                            </div>
                                        )}
                                        <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                                    </div>
                                </div>
                            ))}
                             {loading && (
                                <div className="flex justify-start w-full">
                                    <div className="bg-muted border rounded-lg p-3 flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-xs text-muted-foreground">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t gap-2 bg-background z-20">
                <Textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Message ${selectedModelAlias}...`}
                    className="min-h-[50px] resize-none flex-1"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <Button onClick={handleSend} disabled={loading || !input.trim()} size="icon" className="h-[50px] w-[50px] shrink-0">
                    <Send className="h-5 w-5" />
                </Button>
            </CardFooter>
        </Card>
    );
}
