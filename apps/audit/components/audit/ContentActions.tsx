'use client'

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Download, FileType, Loader2, Stars } from "lucide-react";
import { IoIosArrowDown } from "react-icons/io";
import { toast } from "sonner";

export function ContentActions({ content, handleDownloadPdf, handleDownloadDocx, isDownloadingDocx, notdocx }: any) {
    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        toast.success("Content copied to clipboard");
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size={'sm'}>
                        Actions <IoIosArrowDown />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-10" align="end">
                    <DropdownMenuItem onClick={handleCopy}>
                        <Copy size={16} className="opacity-60 mr-2" aria-hidden="true" />
                        <span>Copy</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadPdf}>
                        <Download size={16} className="opacity-60 mr-2" aria-hidden="true" />
                        <span>Download pdf</span>
                    </DropdownMenuItem>
                    {notdocx &&
                        <DropdownMenuItem onClick={handleDownloadDocx} disabled={isDownloadingDocx}>
                            {isDownloadingDocx ? (
                                <Loader2 className="size-3 animate-spin" />
                            ) : (
                                <FileType className="mr-2 h-4 w-4" />
                            )}
                            <span>Download DOCX</span>
                        </DropdownMenuItem>
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

