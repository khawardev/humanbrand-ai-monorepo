import { NextRequest, NextResponse } from 'next/server';
import { generateSocialReportPPTX, ExportData } from '@/lib/brandos-v2.1/pptx/socialReportGenerator';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { entity_name, export_data } = body;

        if (!export_data || !entity_name) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: entity_name, export_data' },
                { status: 400 }
            );
        }

        const buffer = await generateSocialReportPPTX(export_data as ExportData, entity_name);

        const uint8Array = new Uint8Array(buffer);
        
        const timestamp = new Date().toISOString().split('T')[0];
        const sanitizedName = entity_name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
        const channel = export_data.channel ? `_${export_data.channel}` : '';
        const filename = `${sanitizedName}${channel}_Audit_Report_${timestamp}.pptx`;

        return new NextResponse(uint8Array, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': buffer.length.toString(),
            },
        });
    } catch (error: any) {
        console.error('PPTX export error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to create PowerPoint presentation' },
            { status: 500 }
        );
    }
}
