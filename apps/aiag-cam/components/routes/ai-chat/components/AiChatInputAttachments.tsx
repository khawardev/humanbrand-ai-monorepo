"use client"

import * as React from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"
import { TfiPlus } from "react-icons/tfi"
import { toast } from "sonner"
import { PiFile, PiFilePdfFill, PiFileDocFill, PiFileXlsFill, PiFilePptFill, PiFileCsvFill, PiFileFill } from "react-icons/pi"
import { Spinner } from "@/components/shared/Spinner"

const FILE_ACCEPT_TYPES = ".pdf,.docx,.txt,.xlsx,.csv,.pptx"
const IMAGE_ACCEPT_TYPES = "image/*"

const FILE_ICON_MAP: Record<string, React.ReactNode> = {
    pdf: <PiFilePdfFill className="h-5 w-5 text-muted-foreground shrink-0" />,
    doc: <PiFileDocFill className="h-5 w-5 text-muted-foreground shrink-0" />,
    docx: <PiFileDocFill className="h-5 w-5 text-muted-foreground shrink-0" />,
    xls: <PiFileXlsFill className="h-5 w-5 text-muted-foreground shrink-0" />,
    xlsx: <PiFileXlsFill className="h-5 w-5 text-muted-foreground shrink-0" />,
    ppt: <PiFilePptFill className="h-5 w-5 text-muted-foreground shrink-0" />,
    pptx: <PiFilePptFill className="h-5 w-5 text-muted-foreground shrink-0" />,
    csv: <PiFileCsvFill className="h-5 w-5 text-muted-foreground shrink-0" />,
    txt: <PiFileFill className="h-5 w-5 text-muted-foreground shrink-0" />,
}

const DEFAULT_FILE_ICON = <PiFile className="h-5 w-5 text-muted-foreground shrink-0" />

function getFileIcon(fileName: string) {
    const extension = fileName.split('.').pop()?.toLowerCase() || ''
    return FILE_ICON_MAP[extension] || DEFAULT_FILE_ICON
}

function formatBytes(bytes: number, decimals = 1): string {
    if (!bytes) return "0 B"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}

export type FileAttachment = {
    name: string
    size: number
    parsedText: string
}

export type ImageAttachment = {
    file: File
    preview: string
}

async function parseFilesOnServer(files: any[]): Promise<string | null> {
    const formData = new FormData()
    files.forEach(file => formData.append("files", file))

    try {
        const response = await fetch("/api/parse-files", { method: "POST", body: formData })

        if (!response.ok) {
            let errorMessage = "Failed to parse files"
            try {
                const errorData = await response.json()
                errorMessage = errorData.message || errorMessage
            } catch (e) {
                if (response.status === 413) {
                    errorMessage = "File is too large. Please upload files smaller than 4MB."
                } else {
                    errorMessage = `Server error: ${response.statusText}`
                }
            }
            toast.error(errorMessage)
            return null
        }

        const data = await response.json()
        return data.parsedText || null
    } catch (error: any) {
        console.error("Fetch error:", error)
        return null
    }
}

export function useAiChatAttachments() {
    const [imageAttachments, setImageAttachments] = React.useState<ImageAttachment[]>([])
    const [fileAttachments, setFileAttachments] = React.useState<FileAttachment[]>([])
    const [isParsingFiles, setIsParsingFiles] = React.useState(false)

    const imageInputRef = React.useRef<HTMLInputElement>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleImageSelect = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return

        const files = Array.from(e.target.files)
        const newAttachments = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }))
        setImageAttachments((prev) => [...prev, ...newAttachments])

        if (imageInputRef.current) imageInputRef.current.value = ""
    }, [])

    const MAX_TOKENS = 1_000_000
    const estimateTokens = (text: string) => Math.ceil(text.length / 4)

    const handleFileSelect = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        const files = Array.from(e.target.files)
        
        // 4MB limit check
        const MAX_SIZE = 4 * 1024 * 1024
        const totalSize = files.reduce((sum, f) => sum + f.size, 0)
        
        if (totalSize > MAX_SIZE) {
            toast.error("Total file size exceeds 4MB limit. Please upload smaller files.")
            if (fileInputRef.current) fileInputRef.current.value = ""
            return
        }

        setIsParsingFiles(true)

        try {
            const parsedText = await parseFilesOnServer(files)
            if (!parsedText) return

            const tokenCount = estimateTokens(parsedText)
            if (tokenCount > MAX_TOKENS) {
                toast.warning(`File content (${tokenCount.toLocaleString()} tokens) exceeds the limit. Please upload a smaller file.`)
                return
            }

            const combinedAttachment: FileAttachment = {
                name: files.length === 1 ? files[0]!.name : `${files.length} files`,
                size: files.reduce((sum, f) => sum + f.size, 0),
                parsedText,
            }

            setFileAttachments((prev) => [...prev, combinedAttachment])
            toast.success(`${files.length} file${files.length > 1 ? "s" : ""} attached`)
        } catch {
            toast.error("An error occurred while parsing files")
        } finally {
            setIsParsingFiles(false)
            if (fileInputRef.current) fileInputRef.current.value = ""
        }
    }, [])

    const removeImageAttachment = React.useCallback((index: number) => {
        setImageAttachments((prev) => {
            const updated = [...prev]
            if (updated[index]) {
                URL.revokeObjectURL(updated[index]!.preview)
            }
            updated.splice(index, 1)
            return updated
        })
    }, [])

    const removeFileAttachment = React.useCallback((index: number) => {
        setFileAttachments((prev) => {
            const updated = [...prev]
            updated.splice(index, 1)
            return updated
        })
    }, [])

    const clearAttachments = React.useCallback(() => {
        setImageAttachments((prev) => {
            prev.forEach(a => URL.revokeObjectURL(a.preview))
            return []
        })
        setFileAttachments([])
    }, [])

    const getCombinedFileText = React.useCallback((): string => {
        if (fileAttachments.length === 0) return ""
        return fileAttachments.map(f => f.parsedText).join("\n\n")
    }, [fileAttachments])

    return {
        imageAttachments,
        fileAttachments,
        isParsingFiles,
        imageInputRef,
        fileInputRef,
        handleImageSelect,
        handleFileSelect,
        removeImageAttachment,
        removeFileAttachment,
        clearAttachments,
        getCombinedFileText,
    }
}

type AiInputAttachmentTriggerProps = {
    imageInputRef: React.RefObject<HTMLInputElement | null>
    fileInputRef: React.RefObject<HTMLInputElement | null>
    handleImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
    isParsingFiles?: boolean
}

export function AiInputAttachmentTrigger({
    imageInputRef,
    fileInputRef,
    handleImageSelect,
    handleFileSelect,
    disabled,
    isParsingFiles,
}: AiInputAttachmentTriggerProps) {
    return (
        <>
            <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageSelect}
                className="hidden"
                accept={IMAGE_ACCEPT_TYPES}
                multiple
                disabled={disabled}
            />
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept={FILE_ACCEPT_TYPES}
                multiple
                disabled={disabled}
            />
            <DropdownMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild disabled={disabled || isParsingFiles}>
                            <Button size="icon" variant="ghost">
                                {isParsingFiles ? <Spinner /> : <TfiPlus />}
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        Attachments
                    </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align="start" side="top">
                    <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                        Upload File
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => imageInputRef.current?.click()}>
                        Upload Photo
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

type AiInputAttachmentPreviewProps = {
    imageAttachments: ImageAttachment[]
    fileAttachments: FileAttachment[]
    onRemoveImage: (index: number) => void
    onRemoveFile: (index: number) => void
}

export function AiInputAttachmentPreview({
    imageAttachments,
    fileAttachments,
    onRemoveImage,
    onRemoveFile,
}: AiInputAttachmentPreviewProps) {
    const hasAttachments = imageAttachments.length > 0 || fileAttachments.length > 0
    if (!hasAttachments) return null

    return (
        <div className="flex gap-2 p-3 overflow-x-auto">
            {imageAttachments.map((attachment, index) => (
                <div key={`img-${index}`} className="relative group shrink-0">
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg border">
                        <Image
                            src={attachment.preview}
                            alt="Attachment"
                            fill
                            className="object-cover"
                            sizes="56px"
                        />
                    </div>
                    <button
                        onClick={() => onRemoveImage(index)}
                        className="absolute cursor-pointer -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                    >
                        <X size={12} />
                    </button>
                </div>
            ))}

            {fileAttachments.map((attachment, index) => (
                <div key={`file-${index}`} className="relative group shrink-0">
                    <div className="flex items-center gap-2 h-12 px-3 rounded-md border bg-muted/50">
                        {getFileIcon(attachment.name)}
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-medium truncate max-w-[120px]">{attachment.name}</span>
                            <span className="text-[10px] text-muted-foreground">{formatBytes(attachment.size)}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => onRemoveFile(index)}
                        className="absolute cursor-pointer -right-1 -top-1 rounded-full bg-destructive p-0.5 text-destructive-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                    >
                        <X size={12} />
                    </button>
                </div>
            ))}
        </div>
    )
}
