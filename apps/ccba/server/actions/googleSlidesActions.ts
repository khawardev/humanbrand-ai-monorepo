'use server';

import { prepareGoogleSlidesExportData } from '@/lib/brandos-v2.1/markdownToSlides';
import { parseWebSynthesisMarkdown } from '@/lib/brandos-v2.1/markdownToWebSynthesisSlides';
import { generateWebSynthesisPPTX } from '@/lib/brandos-v2.1/pptx/webSynthesisGenerator';

type ExportToPPTXParams = {
    social_report: string;
    entity_name: string;
    channel_name: string;
};

type ExportWebSynthesisToPPTXParams = {
    synthesis_report: string;
    entity_name: string;
};

type ExportResult = {
    success: boolean;
    data?: {
        blob?: Blob;
        filename?: string;
        download_url?: string;
    };
    error?: string;
};

import { generateSocialReportPPTX } from '@/lib/brandos-v2.1/pptx/socialReportGenerator';

export async function exportToGoogleSlides(params: ExportToPPTXParams): Promise<ExportResult> {
    const {
        social_report,
        entity_name,
        channel_name,
    } = params;

    if (!social_report || typeof social_report !== 'string') {
        return {
            success: false,
            error: 'No report content provided'
        };
    }

    try {
        const exportData = prepareGoogleSlidesExportData(social_report);
        
        // Ensure exportData matches the expected interface for generateSocialReportPPTX
        // We might need to map or cast if interfaces slightly differ, but they should be compatible
        // based on previous analysis.
        const buffer = await generateSocialReportPPTX(exportData as any, entity_name);
        const base64 = buffer.toString('base64');
        const filename = `${entity_name}_Report.pptx`;

        return {
            success: true,
            data: {
                download_url: `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${base64}`,
                filename: filename
            }
        };
    } catch (error: any) {
        console.error('Export to PPTX error:', error);
        return {
            success: false,
            error: error.message || 'An unexpected error occurred'
        };
    }
}

export async function exportWebSynthesisToSlides(params: ExportWebSynthesisToPPTXParams): Promise<ExportResult> {
    const { synthesis_report, entity_name } = params;

    if (!synthesis_report || typeof synthesis_report !== 'string') {
        return {
            success: false,
            error: 'No synthesis report content provided'
        };
    }

    try {
        const exportData = parseWebSynthesisMarkdown(synthesis_report);

        // DIRECT GENERATION (Authentication Safe)
        const buffer = await generateWebSynthesisPPTX(exportData);
        const base64 = buffer.toString('base64');
        const filename = `${entity_name}_Web_Synthesis_Report.pptx`;

        return {
            success: true,
            data: {
                download_url: `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${base64}`,
                filename: filename
            }
        };

    } catch (error: any) {
        console.error('Export Web Synthesis to PPTX error:', error);
        return {
            success: false,
            error: error.message || 'An unexpected error occurred'
        };
    }
}

export async function exportToPPTX(params: ExportToPPTXParams): Promise<ExportResult> {
    return exportToGoogleSlides(params);
}
