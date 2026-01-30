"use client"

import { Copy, Download } from "lucide-react"
import { IoIosArrowDown } from "react-icons/io"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { AIAG_VERSION } from "@/lib/aiag/constants"

interface CampaignGeneratedContentDisplayProps {
    content: string | null;
    onCopy: () => void;
    onDownload: () => void;
}

export function CampaignGeneratedContentDisplay({ content, onCopy, onDownload }: CampaignGeneratedContentDisplayProps) {
    if (!content) return null;

    return (
        <section>
            <div>
                <div className="md:flex md:space-y-0 space-y-3 md:items-center items-end justify-between mb-4">
                    <h4 className="font-semibold text-lg">AIAG - Campaign Content Generation Details ({AIAG_VERSION})</h4>
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" >
                                    Actions <IoIosArrowDown className="ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={onCopy}>
                                    <Copy size={16} className="opacity-60 mr-2" aria-hidden="true" />
                                    <span>Copy</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onDownload}>
                                    <Download size={16} className="opacity-60 mr-2" aria-hidden="true" />
                                    <span>Download .txt</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <Separator className="mb-4" />
            </div>
            <div className="prose prose-neutral max-w-none markdown-body space-y-3 dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
        </section>
    );
}
