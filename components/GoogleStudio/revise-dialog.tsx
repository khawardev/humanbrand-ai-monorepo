'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ReviseDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function ReviseDialog({ isOpen, onOpenChange }: ReviseDialogProps) {
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        console.log("Revision feedback submitted:", feedback);
        // Here you would typically trigger the revision API call
        onOpenChange(false);
        setFeedback('');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <section >
                        <span className=" font-semibold text-accent-foreground tracking-tight">Provide Feedback for Revision</span>
                        <Label className=" text-sm text-muted-foreground  mb-2">Changes requested:</Label>                        <Textarea
                            id="revision-feedback"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="e.g. Make the tone more formal..."
                            rows={6}
                        />
                </section>
                <DialogFooter>
                    <Button size={'sm'} onClick={handleSubmit} disabled={!feedback.trim()}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}