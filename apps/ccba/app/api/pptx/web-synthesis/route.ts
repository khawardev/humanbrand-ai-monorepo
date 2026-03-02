import { NextRequest, NextResponse } from 'next/server';
import { generateWebSynthesisPPTX } from '@/lib/brandos-v2.1/pptx/webSynthesisGenerator';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { export_data } = body;
        
        if (!export_data) {
            return NextResponse.json({ success: false, error: 'Missing export_data' }, { status: 400 });
        }

        const buffer = await generateWebSynthesisPPTX(export_data);
        const filename = `Web_Synthesis_Report_${Date.now()}.pptx`;

        return new NextResponse(new Uint8Array(buffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': buffer.length.toString(),
            },
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
