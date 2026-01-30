'use client'

import { useState } from "react"
import { Speech, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

type AiTTSViewProps = {
    value: string
}

export default function AiTTSView({ value }: AiTTSViewProps) {
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [isTTSLoading, setTTSLoading] = useState(false)

    const generateAudio = async () => {
        if (!value.trim()) return

        setTTSLoading(true)
        setAudioUrl(null)

        try {
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: value }),
            })

            if (!res.ok) throw new Error("Failed to generate audio")

            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            setAudioUrl(url)
        } catch (error) {
            console.error('Error generating TTS audio:', error)
        } finally {
            setTTSLoading(false)
        }
    }

    return {
        audioUrl,
        isTTSLoading,
        generateAudio,
        TTSContent: (
            <div className="flex flex-col items-center justify-center text-center h-[60vh]">
                <div className="p-4 space-y-3">
                    {!audioUrl && !isTTSLoading && (
                        <div className="flex items-center text-sm gap-2 text-muted-foreground">
                            <Speech className="w-4 h-4" />
                            <span>Generate audio</span>
                        </div>
                    )}

                    {isTTSLoading && (
                        <div className="flex items-center text-sm gap-2 text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Generating audio...</span>
                        </div>
                    )}

                    {audioUrl && (
                        <div className="space-y-3">
                            <audio controls src={audioUrl} className="w-[400px]" />
                            <a href={audioUrl} download="tts-output.wav">
                                <Button size="xs">
                                    Download
                                </Button>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export function useTTS(value: string) {
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [isTTSLoading, setTTSLoading] = useState(false)

    const generateAudio = async () => {
        if (!value.trim()) return

        setTTSLoading(true)
        setAudioUrl(null)

        try {
            const res = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: value }),
            })

            if (!res.ok) throw new Error("Failed to generate audio")

            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            setAudioUrl(url)
        } catch (error) {
            console.error('Error generating TTS audio:', error)
        } finally {
            setTTSLoading(false)
        }
    }

    return { audioUrl, isTTSLoading, generateAudio }
}

export function TTSContent({ audioUrl, isTTSLoading }: { audioUrl: string | null; isTTSLoading: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center text-center h-[60vh]">
            <div className="p-4 space-y-3">
                {!audioUrl && !isTTSLoading && (
                    <div className="flex items-center text-sm gap-2 text-muted-foreground">
                        <Speech className="w-4 h-4" />
                        <span>Generate audio</span>
                    </div>
                )}

                {isTTSLoading && (
                    <div className="flex items-center text-sm gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating audio...</span>
                    </div>
                )}

                {audioUrl && (
                    <div className="space-y-3">
                        <audio controls src={audioUrl} className="w-[400px]" />
                        <a href={audioUrl} download="tts-output.wav">
                            <Button size="xs">
                                Download
                            </Button>
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}
