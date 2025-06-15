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
import { PdfFileDropzone } from "@/components/home/PdfFileDropzone";

interface AdaptDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

export function AdaptDialog({ isOpen, onOpenChange }: AdaptDialogProps) {
    const [personaDescription, setPersonaDescription] = useState('');
    const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([]);
    const [referenceMaterial, setReferenceMaterial] = useState<string>();

    const handleSubmit = () => {
        console.log("Adaptation submitted:", {
            personaDescription,
            referenceMaterial: referenceMaterial ? 'PDF material provided' : 'No PDF material'
        });
        // Here you would trigger the adaptation API call
        onOpenChange(false);
        setPersonaDescription('');
        setUploadedPdfs([]);
        setReferenceMaterial(undefined);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <section >
                    <span className=" font-semibold text-accent-foreground tracking-tight">Adapt Content for Hyper Relevance</span>
                    <Label className=" text-sm text-muted-foreground  mb-2">Describe Target Persona(s):</Label>                        <Textarea
                        id="persona-description"
                        value={personaDescription}
                        onChange={(e) => setPersonaDescription(e.target.value)}
                        placeholder="e.g. Quality Manager at a Tier 1 automotive supplier..."
                        rows={6}
                    />
                    <Label className="text-sm text-muted-foreground mt-4 mb-2">Upload Persona Details (Optional):</Label>
                    <PdfFileDropzone
                        files={uploadedPdfs}
                        setFiles={setUploadedPdfs}
                        setReferenceMaterial={setReferenceMaterial}
                        maxFiles={1}
                    />
                </section>
                <DialogFooter>
                    <Button size={'sm'} onClick={handleSubmit} disabled={!personaDescription.trim()}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}