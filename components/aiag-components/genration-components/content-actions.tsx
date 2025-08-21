'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Download, Stars } from "lucide-react";
import { TfiLoop } from "react-icons/tfi";
import { IoIosArrowDown } from "react-icons/io";
import { ReviseDialog } from "./revise-dialog";
import { toast } from "sonner";
import { PersonaDialog } from "./persona/persona-dialog";
import { RiUserSmileLine } from "react-icons/ri";

export function ContentActions({ content, handleRevise, feedback, setFeedback, setPersonasText, personasText, setUploadedPersonaFileData, handleAdaptPersona }: any) {
    const [isReviseOpen, setReviseOpen] = useState(false);
    const [isAdaptOpen, setAdaptOpen] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
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
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size={'sm'}>
                        Actions <IoIosArrowDown />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-22" align="end">
                    <DropdownMenuItem onClick={handleCopy}>
                        <Copy size={16} className="opacity-60 mr-2" aria-hidden="true" />
                        <span>Copy</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadTxt}>
                        <Download size={16} className="opacity-60 mr-2" aria-hidden="true" />
                        <span>Download .txt</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setReviseOpen(true); }}>
                        <TfiLoop size={16} className="opacity-60 mr-2" aria-hidden="true" />
                        <span>Revise</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setAdaptOpen(true); }}>
                        <RiUserSmileLine size={16} className="opacity-60 mr-2" aria-hidden="true" />
                        <span>Adapt for persona</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

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
        </>
    );
}