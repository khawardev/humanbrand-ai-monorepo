import React from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { stripMarkdownBold } from '@/lib/utils';

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
        <div className="flex items-start gap-3 w-full">
            <Image
                src={isAssistant ? 'https://i.postimg.cc/ZYDgZQyF/aiag-logo.jpg' : (user?.image || '/default-user.png')}
                alt={avatarAlt}
                width={36}
                height={36}
                className="w-9 h-9 rounded-md object-cover mt-1"
            />
            <div className={`w-full p-3 rounded-lg ${!isAssistant ? 'bg-primary text-primary-foreground border' : 'bg-black/5 dark:bg-white/5 border'}`}>
                <div className="markdown-body space-y-1 text-[15px]" onMouseUp={isAssistant ? handleMouseUp : undefined}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {stripMarkdownBold(message.content)}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
}