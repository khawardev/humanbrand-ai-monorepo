'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Textarea } from '../../../ui/textarea';

export default function TTSPage() {
    const [text, setText] = useState('');
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const generateAudio = async () => {
        if (!text.trim()) return alert('Please enter some text');

        setLoading(true);
        setAudioUrl(null);

        const res = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        setLoading(false);

        if (!res.ok) {
            console.error('Error generating TTS audio');
            return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
    };

    return (
        <main className="flex space-y-1  flex-col" >
            <h4>Gemini TTS Generator</h4>

            <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text here..."
                rows={4}
            />

            <div className="mt-3">
                <Button
                    size={'sm'}
                    onClick={generateAudio}
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate Audio'}
                </Button>
            </div>

            {audioUrl && (
                <div className="mt-5">
                    <audio controls src={audioUrl} className="w-full" />
                    <div className="mt-3">
                        <a href={audioUrl} download="tts-output.wav">
                            <Button size={'sm'}>
                                Download Audio
                            </Button>
                        </a>
                    </div>
                </div>
            )}
        </main>
    );
}
