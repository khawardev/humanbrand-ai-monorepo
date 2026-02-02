"use client";

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { stripMarkdownBold } from '@/lib/utils';
import { BiRevision } from "react-icons/bi";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface RewriteInputProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedText: string;
    onSubmit: (prompt: string) => void;
}

export default function RewriteInput({ open, onOpenChange, selectedText, onSubmit }: RewriteInputProps) {
    const [prompt, setPrompt] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onSubmit(prompt);
            setPrompt("");
            onOpenChange(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (prompt.trim()) {
                onSubmit(prompt);
                setPrompt("");
                onOpenChange(false);
            }
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(stripMarkdownBold(selectedText));
        setIsCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setIsCopied(false), 1500);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="sr-only">
                    <DialogTitle>Rewrite Text</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="p-4 bg-muted/30">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <p className='mb-2'>Selected text</p>
                                <p>{selectedText}</p>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={handleCopy}
                                className="h-8 w-8 shrink-0 mt-4 text-muted-foreground hover:text-foreground"
                            >
                                {isCopied ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="p-4 bg-background">
                        <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="How would you like to rewrite this? (e.g., 'Make this content formal', 'Summarize it')"
                            className="min-h-[100px] w-full resize-none border-muted focus-visible:ring-primary/20 bg-background text-base"
                            autoFocus
                        />
                    </div>

                    <DialogFooter className="p-4 pt-0 bg-background">
                        <div className="flex items-center justify-end gap-2 w-full">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={!prompt.trim()} className="gap-2">
                                <BiRevision className="w-4 h-4" /> Rewrite
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}