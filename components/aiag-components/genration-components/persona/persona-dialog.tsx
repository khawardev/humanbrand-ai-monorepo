'use client'

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PdfFileDropzone } from "../../reusable-components/uploads/PdfFileDropzone";

export function PersonaDialog({ isOpen, onOpenChange, setPersonasText, setUploadedPersonaFileData, handleAdaptPersona, personasText }: any) {

    const handleSubmit = () => {
        handleAdaptPersona();
        onOpenChange(false);
    };

    const handlePersonaFileChange = (data: any) => {
        const parsedText = data ? data.parsedText : null;
        setUploadedPersonaFileData(parsedText);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <section>
                    <span className="font-semibold text-accent-foreground tracking-tighter">Adapt Content for Hyper Relevance</span>
                    <Label className="text-sm text-muted-foreground mb-2">Describe Target Persona(s):</Label>
                    <Textarea
                        id="persona-description"
                        value={personasText}
                        onChange={(e) => setPersonasText(e.target.value)}
                        placeholder="e.g. Quality Manager at a Tier 1 automotive supplier..."
                        rows={6}
                    />
                    <Label className="text-sm text-muted-foreground mt-4 mb-2">Upload Persona Details (Optional):</Label>
                    <PdfFileDropzone
                        onFileChange={handlePersonaFileChange}
                    />
                </section>
                <DialogFooter>
                    <Button size={'sm'} onClick={handleSubmit} disabled={!personasText?.trim()}>Generate</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}