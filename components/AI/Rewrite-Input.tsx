"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ArrowUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BiRevision } from "react-icons/bi";

interface RewriteInputProps {
    position: { top: number; left: number };
    onSubmit: (prompt: string) => void;
    onClose: () => void;
}

export default function RewriteInput({ position, onSubmit, onClose }: RewriteInputProps) {
    const [prompt, setPrompt] = useState('');
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


    return (
        <div
            ref={containerRef}
            className="absolute z-50 w-100 rounded-xl border bg-background shadow-xl"
            style={{ top: position.top, left: position.left }}
        >
            <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="p-2">
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