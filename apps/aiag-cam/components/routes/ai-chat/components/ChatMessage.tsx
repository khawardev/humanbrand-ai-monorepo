import React from 'react';
import Image from 'next/image';
import { Markdown } from '@/components/ui/markdown';

interface ChatMessageProps {
    message: any;
    user: any;
    messageIndex: number;
    onSelectText: (text: string, messageIndex: number) => void;
}

export default function ChatMessage({ message, user, messageIndex, onSelectText }: ChatMessageProps) {
    const isAssistant = message.role !== 'user';

    const handleMouseUp = () => {
        if (!isAssistant) return;
        const selection = window.getSelection();
        const selectedText = selection?.toString().trim();
        if (selectedText && selectedText.length > 0) {
            onSelectText(selectedText, messageIndex);
        }
    };

    const avatarAlt = `${message.role} avatar`;

    return (
        <div className="flex items-start gap-4 w-full group">
            <Image
                src={isAssistant ? 'https://i.postimg.cc/ZYDgZQyF/aiag-logo.jpg' : (user?.image || '/default-user.png')}
                alt={avatarAlt}
                width={36}
                height={36}
                className="w-9 h-9 rounded-md object-cover mt-1 shrink-0"
            />
            <div className={`w-full overflow-hidden ${!isAssistant ? 'bg-primary text-primary-foreground p-3 rounded-lg' : ''}`}>
                <div 
                    className={`text-[15px] leading-relaxed ${isAssistant ? '' : 'prose-invert'}`} 
                    onMouseUp={isAssistant ? handleMouseUp : undefined}
                >
                    <Markdown>
                        {message.content}
                    </Markdown>
                </div>
            </div>
        </div>
    );
}