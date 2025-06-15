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
import { BiSolidFilePdf } from "react-icons/bi";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
import { ReviseDialog } from "./revise-dialog";
import { AdaptDialog } from "./adapt-dialog";

interface ContentActionsProps {
    content: string;
    contentRef: React.RefObject<HTMLDivElement>;
}

export function ContentActions({ content, contentRef }: ContentActionsProps) {
    const [isReviseOpen, setReviseOpen] = useState(false);
    const [isAdaptOpen, setAdaptOpen] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
    };

    const handleDownloadTxt = () => {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "AIAG_Generated_Content.txt";
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
                <DropdownMenuContent className="max-w-64" align="end">
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
                        <Stars size={16} className="opacity-60 mr-2" aria-hidden="true" />
                        <span>Adapt for persona</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ReviseDialog isOpen={isReviseOpen} onOpenChange={setReviseOpen} />
            <AdaptDialog isOpen={isAdaptOpen} onOpenChange={setAdaptOpen} />
        </>
    );
}