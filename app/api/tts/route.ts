import { GoogleGenAI } from '@google/genai';
import wav from 'wav';
import { NextResponse } from 'next/server';

async function saveWaveBuffer(
    pcmData: Buffer,
    channels = 1,
    rate = 24000,
    sampleWidth = 2
): Promise<Buffer> {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
        const writer = new wav.Writer({
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
        });

        writer.on('data', (chunk: Buffer) => chunks.push(chunk));
        writer.on('finish', () => resolve(Buffer.concat(chunks)));
        writer.on('error', reject);

        writer.write(pcmData);
        writer.end();
    });
}

export async function POST(req: Request) {
    try {
        const { text } = await req.json();
        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY as string,
        });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!data) {
            return NextResponse.json({ error: 'No audio data received' }, { status: 500 });
        }

        const audioBuffer = Buffer.from(data, 'base64');
        const wavBuffer: any = await saveWaveBuffer(audioBuffer);

        return new NextResponse(wavBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'audio/wav',
                'Content-Disposition': 'inline; filename="tts-output.wav"',
            },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
