'use client'

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Download } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import { toast } from "sonner";

export function PersonaContentActions({ content }: any) {

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        toast.success("Content copied to clipboard!");
    };

    const handleDownloadTxt = () => {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "AIAG_HyperRelevantPersona_Version.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

   

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size={'xs'}>
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
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}