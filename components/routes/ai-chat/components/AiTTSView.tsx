'use client'

import { useState } from "react"
import { Speech, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RiVoiceAiLine, RiMic2AiLine, RiChatAiLine } from "react-icons/ri";



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
                    <div className="flex flex-col items-center text-xl gap-2 text-muted-foreground">
                        <RiVoiceAiLine className="w-10 h-10" />
                        <span>Generate AI Audio</span>
                    </div>
                )}

                {isTTSLoading && (
                    <div className="flex flex-col items-center text-xl gap-2 text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Generating audio...</span>
                    </div>
                )}

                {audioUrl && (
                    <div className="space-y-3 flex gap-3 items-center">
                        <audio controls src={audioUrl} className="w-[400px]" />
                        <a href={audioUrl} download="tts-output.wav">
                            <Button size={'lg'} className="rounded-full h-12 mb-3" >
                                Download
                            </Button>
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}
