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
        <div className="flex flex-col items-center justify-center text-center h-[75vh] w-full px-4">
            <div className="p-4 space-y-3 w-full flex flex-col items-center">
                {!audioUrl && !isTTSLoading && (
                    <div className="flex flex-col items-center text-xl gap-2 text-muted-foreground">
                        <RiVoiceAiLine className="w-10 h-10" />
                        <span>Generate AI Audio</span>
                    </div>
                )}

                {isTTSLoading && (
                    <div className="flex items-center justify-center text-xl gap-2 text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating audio</span>
                    </div>
                )}

                {audioUrl && (
                    <div className="flex flex-col md:flex-row gap-4 items-center w-full justify-center max-w-3xl">
                        <audio controls src={audioUrl} className="w-full max-w-[300px] md:max-w-[400px]" />
                        <a href={audioUrl} download="tts-output.wav" className="w-full max-w-[300px] md:w-auto">
                            <Button size={'lg'} className="rounded-full h-12 w-full md:w-auto" >
                                Download
                            </Button>
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}
