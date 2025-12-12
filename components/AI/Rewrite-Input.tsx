"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp, X, Copy, Check } from 'lucide-react';
import { cn, stripMarkdownBold } from '@/lib/utils';
import { BiRevision } from "react-icons/bi";
import { toast } from "sonner";

interface RewriteInputProps {
    position: { top: number; left: number };
    selectedText: string;
    onSubmit: (prompt: string) => void;
    onClose: () => void;
}

export default function RewriteInput({ position, selectedText, onSubmit, onClose }: RewriteInputProps) {
    const [prompt, setPrompt] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        inputRef.current?.focus();

        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onSubmit(prompt);
        }
        onClose()
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(stripMarkdownBold(selectedText));
        setIsCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setIsCopied(false), 1500);
    };

    return (
        <div
            ref={containerRef}
            className="absolute z-50 w-[500px] rounded-xl border bg-background shadow-xl"
            style={{ top: position.top, left: position.left }}
        >
            <form onSubmit={handleSubmit} className="flex flex-col">
                {/* Selected Text Display */}
                <div className="p-3 border-b bg-muted/30 rounded-xl ">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground mb-1">Selected text:</p>
                            <div className='line-clamp-2 overflow-y-auto'>
                                <p className="text-sm break-words">{selectedText}</p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleCopy}
                            className="h-7 w-7 shrink-0"
                        >
                            {isCopied ? (
                                <Check className="w-3.5 h-3.5" />
                            ) : (
                                <Copy className="w-3.5 h-3.5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Prompt Input */}
                <div className="p-2 ">
                    <Textarea
                        ref={inputRef}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., Make this more formal..."
                        className="h-20 w-full resize-none border-0 shadow-none bg-transparent px-2 py-1 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </div>

                <div className="flex items-center justify-end gap-2  p-2">
                    <Button type="submit" size="xs" disabled={!prompt.trim()}>
                        <BiRevision /> Rewrite
                    </Button>
                </div>
            </form>
        </div>
    );
}