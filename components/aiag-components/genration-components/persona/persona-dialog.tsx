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
import { FileDropzone } from "../../reusable-components/uploads/file-dropzone";
import { RiUserSmileLine } from "react-icons/ri";


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
            <DialogTrigger >
                <Button size={'sm'} variant={'ghost'}>
                    <RiUserSmileLine size={16} className="opacity-60" aria-hidden="true" />
                    <span>Persona</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
                <section>
                    <span className="font-semibold text-accent-foreground tracking-tighter">Adapt Content for Hyper Relevance</span>
                    <Label className="text-sm text-muted-foreground mb-2">Describe Target Persona(s):</Label>
                    <Textarea
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (personasText.trim()) {
                                    handleSubmit();
                                }
                            }
                        }}
                        id="persona-description"
                        value={personasText}
                        onChange={(e) => setPersonasText(e.target.value)}
                        placeholder="e.g. Quality Manager at a Tier 1 automotive supplier..."
                        rows={6}
                    />
                    <Label className="text-sm text-muted-foreground mt-4 mb-2">Upload Persona Details (Optional):</Label>
                    <FileDropzone
                        onFilesChange={handlePersonaFileChange}
                    />
                </section>
                <DialogFooter>
                    <Button size={'sm'} onClick={handleSubmit} disabled={!personasText?.trim()}>Generate</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}