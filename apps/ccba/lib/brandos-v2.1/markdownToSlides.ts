export type SectionType = 
    | 'title' 
    | 'section_header' 
    | 'content' 
    | 'content_with_sections'
    | 'table' 
    | 'metrics' 
    | 'recommendations'
    | 'whitespace'
    | 'comparison'
    | 'archetype';

export interface SlideSection {
    type: SectionType;
    title: string;
    subtitle?: string;
    content?: string;
    contentSections?: { heading: string; content: string; bullets?: string[] }[];
    tableData?: TableData;
    metrics?: MetricItem[];
    items?: ContentItem[];
    bulletPoints?: string[];
    order: number;
}

export interface TableData {
    headers: string[];
    rows: string[][];
    highlightFirstColumn?: boolean;
}

export interface MetricItem {
    label: string;
    value: string;
    notes?: string;
}

export interface ContentItem {
    title?: string;
    description: string;
    evidence?: string[];
    targetAudience?: string;
    action?: string;
    expectedEffect?: string;
    confidence?: string;
}

export interface ParsedReportData {
    reportTitle: string;
    entityName: string;
    analysisWindow: string;
    channel: string;
    sections: SlideSection[];
    coverageShortfalls?: string[];
    totalPosts?: number;
    totalComments?: number;
}

function parseMarkdownTable(tableText: string): TableData | null {
    const lines = tableText.trim().split('\n').filter(line => line.trim() && line.includes('|'));
    if (lines.length < 2) return null;

    const parseRow = (row: string): string[] => {
        const cells = row
            .split('|')
            .map(cell => cell.trim())
            .filter((cell, idx, arr) => {
                if (idx === 0 && cell === '') return false;
                if (idx === arr.length - 1 && cell === '') return false;
                if (cell.match(/^[-:]+$/)) return false;
                return true;
            });
        return cells;
    };

    const isSeparator = (line: string): boolean => {
        return /^[\|\s\-:]+$/.test(line.replace(/\s/g, ''));
    };

    let headerIndex = 0;
    let separatorIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
        if (isSeparator(lines[i]!)) {
            separatorIndex = i;
            headerIndex = i - 1;
            break;
        }
    }

    if (separatorIndex === -1) {
        separatorIndex = 1;
        headerIndex = 0;
    }

    const headers = parseRow(lines[headerIndex]!);
    if (headers.length === 0) return null;

    const rows: string[][] = [];
    for (let i = separatorIndex + 1; i < lines.length; i++) {
        if (isSeparator(lines[i]!)) continue;
        const row = parseRow(lines[i]!);
        if (row.length > 0) {
            while (row.length < headers.length) {
                row.push('');
            }
            rows.push(row.slice(0, headers.length));
        }
    }

    return { 
        headers, 
        rows,
        highlightFirstColumn: true
    };
}

function extractMetricsFromTable(tableData: TableData): MetricItem[] {
    const metrics: MetricItem[] = [];
    for (const row of tableData.rows) {
        if (row.length >= 2) {
            metrics.push({
                label: cleanMarkdownFormatting(row[0]!),
                value: cleanMarkdownFormatting(row[1]!),
                notes: row.length > 2 ? cleanMarkdownFormatting(row.slice(2).join(' ')) : undefined
            });
        }
    }
    return metrics;
}

function cleanMarkdownFormatting(text: string): string {
    if (!text) return '';
    return text
        .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')
        .replace(/_(.*?)_/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/~~(.*?)~~/g, '$1')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/\[e:\d+\]/g, '')
        .replace(/\[e:\d+[a-zA-Z]*\]/g, '')
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/^#+\s*/gm, '')
        .replace(/>\s*/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function extractBulletPoints(text: string): string[] {
    const bullets: string[] = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
        const match = line.match(/^[\s]*[-*•]\s+(.+)$/);
        if (match && match[1]) {
            bullets.push(cleanMarkdownFormatting(match[1]));
        }
        const numberedMatch = line.match(/^[\s]*\d+[.)]\s+(.+)$/);
        if (numberedMatch && numberedMatch[1]) {
            bullets.push(cleanMarkdownFormatting(numberedMatch[1]));
        }
    }
    
    return bullets;
}

function extractContentSections(text: string): { heading: string; content: string; bullets?: string[] }[] {
    const sections: { heading: string; content: string; bullets?: string[] }[] = [];
    const lines = text.split('\n');
    
    let currentHeading = '';
    let currentContent: string[] = [];
    let currentBullets: string[] = [];
    
    const finalizeSection = () => {
        if (currentHeading || currentContent.length > 0 || currentBullets.length > 0) {
            sections.push({
                heading: currentHeading || 'Overview',
                content: currentContent.join('\n').trim(),
                bullets: currentBullets.length > 0 ? currentBullets : undefined
            });
            currentHeading = '';
            currentContent = [];
            currentBullets = [];
        }
    };

    for (const line of lines) {
        const boldMatch = line.match(/^\*\*(.*?)\*\*$/) || line.match(/^###\s+(.*?)$/);
        
        if (boldMatch && boldMatch[1]) {
            finalizeSection();
            currentHeading = cleanMarkdownFormatting(boldMatch[1]);
        } else {
            const bulletMatch = line.match(/^[\s]*[-*•]\s+(.+)$/);
            if (bulletMatch && bulletMatch[1]) {
                currentBullets.push(cleanMarkdownFormatting(bulletMatch[1]));
            } else if (line.trim()) {
                currentContent.push(line.trim());
            }
        }
    }
    
    finalizeSection();
    return sections;
}

function extractSectionContent(markdown: string, startPattern: RegExp, endPatterns: RegExp[]): string {
    const startMatch = markdown.match(startPattern);
    if (!startMatch) return '';
    
    const startIndex = startMatch.index! + startMatch[0].length;
    let endIndex = markdown.length;
    
    for (const endPattern of endPatterns) {
        const endMatch = markdown.slice(startIndex).match(endPattern);
        if (endMatch && endMatch.index !== undefined) {
            const possibleEnd = startIndex + endMatch.index;
            if (possibleEnd < endIndex) {
                endIndex = possibleEnd;
            }
        }
    }
    
    return markdown.slice(startIndex, endIndex).trim();
}

function extractAllTables(sectionContent: string): TableData[] {
    const tables: TableData[] = [];
    const tablePattern = /(\|[^\n]+\|\n)+/g;
    let match;
    
    while ((match = tablePattern.exec(sectionContent)) !== null) {
        const tableText = match[0];
        const parsed = parseMarkdownTable(tableText);
        if (parsed && parsed.rows.length > 0) {
            tables.push(parsed);
        }
    }
    
    return tables;
}

export function parseMarkdownReport(markdown: string): ParsedReportData {
    if (!markdown || typeof markdown !== 'string') {
        return {
            reportTitle: 'Social Media Audit Report',
            entityName: 'Unknown Entity',
            analysisWindow: '',
            channel: 'SOCIAL MEDIA',
            sections: []
        };
    }

    const sections: SlideSection[] = [];
    let orderCounter = 0;
    
    const titleMatch = markdown.match(/^#\s+(.+?)(?:\n|$)/m);
    const reportTitle = titleMatch && titleMatch[1] ? cleanMarkdownFormatting(titleMatch[1]) : 'Social Media Audit Report';

    let entityName = '';
    const channelConfirmedMatch = markdown.match(/\*\*Channel Confirmed:\*\*\s*(.+?)(?:\n|$)/);
    if (channelConfirmedMatch && channelConfirmedMatch[1]) {
        entityName = cleanMarkdownFormatting(channelConfirmedMatch[1]).replace(/\s*\(.*?\)\s*$/, '');
    } else {
        const dashMatch = reportTitle.match(/[—–-]\s*(.+?)$/);
        if (dashMatch && dashMatch[1]) {
            entityName = cleanMarkdownFormatting(dashMatch[1]);
        } else {
            entityName = reportTitle.replace(/AUDIT REPORT/i, '').trim();
        }
    }

    const windowMatch = markdown.match(/\*\*Analysis Window:\*\*\s*(.+?)(?:\n|$)/);
    const analysisWindow = windowMatch && windowMatch[1] ? cleanMarkdownFormatting(windowMatch[1]) : '';

    const channelPatterns = [
        { pattern: /LINKEDIN/i, name: 'LINKEDIN' },
        { pattern: /FACEBOOK/i, name: 'FACEBOOK' },
        { pattern: /INSTAGRAM/i, name: 'INSTAGRAM' },
        { pattern: /TWITTER|^X\s/i, name: 'X/TWITTER' },
        { pattern: /YOUTUBE/i, name: 'YOUTUBE' },
        { pattern: /TIKTOK/i, name: 'TIKTOK' },
    ];
    
    let channel = 'SOCIAL MEDIA';
    for (const { pattern, name } of channelPatterns) {
        if (pattern.test(reportTitle)) {
            channel = name;
            break;
        }
    }

    sections.push({
        type: 'title',
        title: reportTitle,
        subtitle: `Analysis Window: ${analysisWindow}`,
        content: entityName,
        order: orderCounter++
    });

    // Check for Executive Summary first as it usually appears at the top
    const executiveSummaryContent = extractSectionContent(
        markdown,
        /##\s*Executive Summary/i,
        [/##/]
    );
    
    if (executiveSummaryContent) {
        sections.push({
            type: 'section_header',
            title: 'EXECUTIVE SUMMARY',
            order: orderCounter++
        });
        
        const subSections = extractContentSections(executiveSummaryContent);
        if (subSections.length > 0) {
            sections.push({
                type: 'content_with_sections',
                title: 'THE CORE FINDINGS',
                contentSections: subSections,
                order: orderCounter++
            });
        }
    }

    const sectionDefinitions = [
        {
            pattern: /##\s*0\)\s*Channel Identification[^\n]*/i,
            title: 'CHANNEL IDENTIFICATION & CORPUS BASELINE',
            type: 'section_header' as SectionType,
            createDivider: true
        },
        {
            pattern: /##\s*0b\)\s*Homepage[^\n]*/i,
            title: 'HOMEPAGE → FEED ALIGNMENT',
            type: 'table' as SectionType,
            createDivider: false
        },
        {
            pattern: /##\s*1\)\s*Emergent Intended Audience[^\n]*/i,
            title: 'EMERGENT INTENDED AUDIENCE',
            type: 'section_header' as SectionType,
            createDivider: true
        },
        {
            pattern: /##\s*2\)\s*Emergent Key Channel Drivers[^\n]*/i,
            title: 'KEY CHANNEL DRIVERS',
            type: 'section_header' as SectionType,
            createDivider: true
        },
        {
            pattern: /##\s*3\)\s*Channel-Fit Brand Attributes[^\n]*/i,
            title: 'BRAND ATTRIBUTES',
            type: 'section_header' as SectionType,
            createDivider: true
        },
        {
            pattern: /##\s*3a\)\s*Drivers[^\n]*/i,
            title: 'DRIVERS — EMERGENT & MANDATED',
            type: 'table' as SectionType,
            createDivider: false
        },
        {
            pattern: /##\s*3b\)\s*Evidence Metrics[^\n]*/i,
            title: 'EVIDENCE METRICS',
            type: 'metrics' as SectionType,
            createDivider: false
        },
        {
            pattern: /##\s*4\)\s*Sentiment[^\n]*/i,
            title: 'SENTIMENT & CONVERSATION DYNAMICS',
            type: 'section_header' as SectionType,
            createDivider: true
        },
        {
            pattern: /##\s*5\)\s*Strategic Recommendations[^\n]*/i,
            title: 'STRATEGIC RECOMMENDATIONS',
            type: 'recommendations' as SectionType,
            createDivider: true
        },
        {
            pattern: /##\s*EVIDENCE LEDGER/i,
            title: 'EVIDENCE LEDGER',
            type: 'section_header' as SectionType,
            createDivider: true
        }
    ];

    const endPatterns = sectionDefinitions.map(s => s.pattern);
    endPatterns.push(/##\s*COVERAGE SHORTFALLS/i);
    endPatterns.push(/##\s*Executive Summary/i);
    endPatterns.push(/```/);
    endPatterns.push(/---\s*$/m);

    for (const sectionDef of sectionDefinitions) {
        const sectionContent = extractSectionContent(markdown, sectionDef.pattern, endPatterns);
        
        if (!sectionContent && sectionDef.type !== 'section_header') continue;

        if (sectionDef.createDivider) {
            sections.push({
                type: 'section_header',
                title: sectionDef.title,
                order: orderCounter++
            });
        }

        if (sectionDef.type === 'recommendations') {
            const tables = extractAllTables(sectionContent);
            if (tables.length > 0) {
                const recTable = tables[0]!;
                const recommendations: ContentItem[] = [];
                
                for (const row of recTable.rows) {
                    if (row.length >= 2) {
                        recommendations.push({
                            title: cleanMarkdownFormatting(row[0]!),
                            targetAudience: row.length > 1 ? cleanMarkdownFormatting(row[1]!) : undefined,
                            description: row.length > 2 ? cleanMarkdownFormatting(row[2]!) : cleanMarkdownFormatting(row[1]!),
                            action: row.length > 3 ? cleanMarkdownFormatting(row[3]!) : undefined,
                            expectedEffect: row.length > 4 ? cleanMarkdownFormatting(row[4]!) : undefined,
                            confidence: row.length > 6 ? cleanMarkdownFormatting(row[6]!) : undefined
                        });
                    }
                }
                
                sections.push({
                    type: 'recommendations',
                    title: sectionDef.title,
                    items: recommendations,
                    order: orderCounter++
                });
            }
        } else if (sectionDef.type === 'metrics') {
            const tables = extractAllTables(sectionContent);
            for (const table of tables) {
                const metrics = extractMetricsFromTable(table);
                if (metrics.length > 0) {
                    sections.push({
                        type: 'metrics',
                        title: table.headers[0] || sectionDef.title,
                        metrics: metrics,
                        order: orderCounter++
                    });
                }
            }
        } else if (sectionDef.type === 'table' || sectionContent) {
            const tables = extractAllTables(sectionContent);
            
            for (const table of tables) {
                sections.push({
                    type: 'table',
                    title: sectionDef.title,
                    tableData: table,
                    order: orderCounter++
                });
            }

            const nonTableContent = sectionContent
                .replace(/(\|[^\n]+\|\n)+/g, '')
                .trim();
            
            if (nonTableContent && tables.length === 0) {
                const bulletPoints = extractBulletPoints(nonTableContent);
                sections.push({
                    type: 'content',
                    title: sectionDef.title,
                    content: cleanMarkdownFormatting(nonTableContent),
                    bulletPoints: bulletPoints.length > 0 ? bulletPoints : undefined,
                    order: orderCounter++
                });
            }
        }
    }

    const baselineContent = extractSectionContent(
        markdown, 
        /###\s*Baseline Table/i, 
        [/###/, /##/, /\*\*Coverage/i]
    );
    
    if (baselineContent) {
        const tables = extractAllTables(baselineContent);
        if (tables.length > 0 && tables[0]) {
            const metrics = extractMetricsFromTable(tables[0]);
            const existingMetricsIdx = sections.findIndex(s => s.title === 'Baseline Metrics');
            if (existingMetricsIdx === -1) {
                sections.splice(1, 0, {
                    type: 'metrics',
                    title: 'BASELINE METRICS',
                    metrics: metrics,
                    order: 1
                });
            }
        }
    }

    let totalPosts: number | undefined;
    let totalComments: number | undefined;
    
    const postsMatch = markdown.match(/Total posts\s*\|\s*(\d+)/i);
    if (postsMatch && postsMatch[1]) totalPosts = parseInt(postsMatch[1]);
    
    const commentsMatch = markdown.match(/Total comments analyzed\s*\|\s*(\d+)/i);
    if (commentsMatch && commentsMatch[1]) totalComments = parseInt(commentsMatch[1]);

    const shortfallsMatch = markdown.match(/\*\*Coverage Shortfalls:\*\*([\s\S]*?)(?=\n---|\n##|$)/);
    const coverageShortfalls: string[] = [];
    if (shortfallsMatch && shortfallsMatch[1]) {
        const bullets = extractBulletPoints(shortfallsMatch[1]);
        coverageShortfalls.push(...bullets);
    }

    sections.sort((a, b) => a.order - b.order);

    return {
        reportTitle,
        entityName,
        analysisWindow,
        channel,
        sections,
        coverageShortfalls: coverageShortfalls.length > 0 ? coverageShortfalls : undefined,
        totalPosts,
        totalComments
    };
}

export function extractSlideSections(markdown: string): SlideSection[] {
    const parsed = parseMarkdownReport(markdown);
    return parsed.sections;
}

export interface GoogleSlidesExportData {
    title: string;
    entity_name: string;
    analysis_window: string;
    channel: string;
    sections: {
        type: string;
        title: string;
        subtitle?: string;
        content?: string;
        contentSections?: { heading: string; content: string; bullets?: string[] }[];
        table_data?: {
            headers: string[];
            rows: string[][];
        };
        metrics?: {
            label: string;
            value: string;
            notes?: string;
        }[];
        items?: {
            title?: string;
            description: string;
            evidence?: string[];
            targetAudience?: string;
            action?: string;
            expectedEffect?: string;
            confidence?: string;
        }[];
        bullet_points?: string[];
    }[];
    raw_markdown: string;
    total_posts?: number;
    total_comments?: number;
    coverage_shortfalls?: string[];
}

export function prepareGoogleSlidesExportData(markdown: string): GoogleSlidesExportData {
    const parsed = parseMarkdownReport(markdown);
    
    return {
        title: parsed.reportTitle,
        entity_name: parsed.entityName,
        analysis_window: parsed.analysisWindow,
        channel: parsed.channel,
        sections: parsed.sections.map(section => ({
            type: section.type,
            title: section.title,
            subtitle: section.subtitle,
            content: section.content,
            contentSections: section.contentSections,
            table_data: section.tableData ? {
                headers: section.tableData.headers,
                rows: section.tableData.rows
            } : undefined,
            metrics: section.metrics,
            items: section.items,
            bullet_points: section.bulletPoints
        })),
        raw_markdown: markdown,
        total_posts: parsed.totalPosts,
        total_comments: parsed.totalComments,
        coverage_shortfalls: parsed.coverageShortfalls
    };
}
