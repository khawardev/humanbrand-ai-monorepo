'use client'

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TfiLoop } from "react-icons/tfi";

export function ReviseDialog({ isOpen, onOpenChange, handleRevise, feedback, setFeedback }: any) {

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>

            <DialogContent className="sm:max-w-3xl">
                <section >
                    <DialogTitle></DialogTitle>
                    <span className=" font-medium text-accent-foreground tracking-tighter">Provide Feedback for Revision</span>
                    <Label className=" text-sm text-muted-foreground mb-2">Changes requested:</Label>
                    <Textarea
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (feedback.trim()) {
                                    handleRevise();
                                }
                            }
                        }}
                        id="revision-feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="e.g. Make the tone more formal..."
                        rows={6}
                    />
                </section>
                <DialogFooter>
                    <Button onClick={handleRevise} disabled={!feedback.trim()}>Revise</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}