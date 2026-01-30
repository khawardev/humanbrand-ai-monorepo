'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Download } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import { TfiLoop } from "react-icons/tfi";
import { RiUserSmileLine } from "react-icons/ri";
import { ReviseDialog } from "./ReviseDialog";
import { toast } from "sonner";
import { PersonaDialog } from "./persona/PersonaDialog";
import { stripMarkdownBold } from "@/lib/utils";

export function ContentActions({ content, handleRevise, feedback, setFeedback, setPersonasText, personasText, setUploadedPersonaFileData, handleAdaptPersona }: any) {
    const [isReviseOpen, setReviseOpen] = useState(false);
    const [isAdaptOpen, setAdaptOpen] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(stripMarkdownBold(content));
        toast.success("Content copied to clipboard!");
    };

    const handleDownloadTxt = () => {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "AIAG_generatedContent.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };



    return (
        <section className="flex gap-2 items-center">
            <ReviseDialog
                handleRevise={handleRevise}
                feedback={feedback}
                setFeedback={setFeedback}
                isOpen={isReviseOpen}
                onOpenChange={setReviseOpen}
            />
            <PersonaDialog
                isOpen={isAdaptOpen}
                onOpenChange={setAdaptOpen}
                setPersonasText={setPersonasText}
                personasText={personasText}
                setUploadedPersonaFileData={setUploadedPersonaFileData}
                handleAdaptPersona={handleAdaptPersona}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={'ghost'}  >
                        Actions <IoIosArrowDown />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleCopy}>
                        <Copy size={16} aria-hidden="true" />
                        <span>Copy </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadTxt}>
                        <Download size={16} aria-hidden="true" />
                        <span>Download</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setReviseOpen(true)}>
                        <TfiLoop size={16}  aria-hidden="true" />
                        <span>Revise </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAdaptOpen(true)}>
                        <RiUserSmileLine size={16}  aria-hidden="true" />
                        <span>Adapt Persona</span>
                    </DropdownMenuItem>
                    
                </DropdownMenuContent>
            </DropdownMenu>
        </section>
    );
}