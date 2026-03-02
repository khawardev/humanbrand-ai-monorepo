import { TableData } from './markdownToSlides';

export interface WebSlideSection {
    type: 'title' | 'executive_summary' | 'intro' | 'corpus_summary' | 'synthesis_overview' | 'detailed_finding' | 'table_section' | 'narrative' | 'archetype' | 'platform_table' | 'strategic_context' | 'conclusion' | 'section_header' | 'generic_section';
    title: string;
    subtitle?: string;
    finding?: string;
    rationale?: string;
    implication?: string;
    content?: string;
    table?: TableData;
    bullets?: string[];
    order: number;
}

export interface WebSynthesisExportData {
    title: string;
    prepared_by: string;
    analysis_date: string;
    sections: WebSlideSection[];
    raw_markdown: string;
}

function cleanMarkdown(text: string | undefined): string {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/`(.*?)`/g, '$1')
        .replace(/^> /gm, '')
        .trim();
}

function parseTable(tableText: string): TableData | undefined {
    // Basic table parser
    const lines = tableText.trim().split('\n').filter(line => line.trim() && line.includes('|'));
    if (lines.length < 2) return undefined;

    // Check if second line is separator |---|
    let dataLines = lines;
    if (lines[1] && lines[1].match(/^\s*\|?[-:| ]+\|?\s*$/)) {
        dataLines = [lines[0]!, ...lines.slice(2)];
    }

    const firstLine = dataLines[0];
    if (!firstLine) return undefined;
    const headers = firstLine.split('|').map(c => c.trim()).filter((val, i, arr) => {
        // Filter empty start/end if pipe is at boundary
        if (i === 0 && val === '') return false;
        if (i === arr.length - 1 && val === '') return false;
        return true;
    });

    const rows = dataLines.slice(1).map(line => 
        line.split('|').map(c => c.trim()).filter((val, i, arr) => {
             if (i === 0 && val === '') return false;
             if (i === arr.length - 1 && val === '') return false;
             return true;
        })
    );

    return { headers, rows };
}

export function parseWebSynthesisMarkdown(markdown: string): WebSynthesisExportData {
    const sections: WebSlideSection[] = [];
    let order = 0;

    // Metadata
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    const preparedByMatch = markdown.match(/\*\*Prepared by\s+(.+)\*\*/);
    const dateMatch = markdown.match(/\*\*Analysis Date:\*\*\s+(.+)/);

    // Split by level 2 headers "## "
    // Use positive lookahead to keep delimiter or split and process
    const h2Parts = markdown.split(/\n##\s+/);
    
    // First part is usually metadata/title, skip it
    
    for (let i = 1; i < h2Parts.length; i++) {
        const part = h2Parts[i]!;
        const firstLineEnd = part.indexOf('\n');
        const h2Title = firstLineEnd > -1 ? part.substring(0, firstLineEnd).trim() : part.trim();
        let content = firstLineEnd > -1 ? part.substring(firstLineEnd).trim() : '';

        // Determine Section Type
        if (h2Title.toLowerCase().includes('executive summary')) {
            sections.push({ type: 'executive_summary', title: h2Title, content: cleanMarkdown(content), order: order++ });
            continue;
        }
        if (h2Title.toLowerCase().includes('introduction')) {
            sections.push({ type: 'intro', title: h2Title, content: cleanMarkdown(content), order: order++ });
            continue;
        }
        if (h2Title.toLowerCase().includes('corpus analysis')) {
            const bullets = content.match(/[-*]\s+(.+)/g)?.map(b => cleanMarkdown(b.replace(/^[-*]\s+/, ''))) || [];
            sections.push({ type: 'corpus_summary', title: h2Title, bullets, order: order++ });
            continue;
        }
        if (h2Title.toLowerCase().includes('synthesis overview')) {
             sections.push({ type: 'synthesis_overview', title: h2Title, content: cleanMarkdown(content.split('---')[0]), order: order++ });
             continue; // '---' might be handled, but usually fine
        }
        if (h2Title.toLowerCase().includes('conclusion')) {
             sections.push({ type: 'conclusion', title: h2Title, content: cleanMarkdown(content), order: order++ });
             continue;
        }

        // Generic numbered sections (I. The Brand Narrative)
        // Check if it has SUB-SECTIONS (###)
        const h3Parts = content.split(/\n###\s+/);
        
        // Push the H2 Divider Slide
        sections.push({ type: 'section_header', title: h2Title, order: order++ });
        
        // If there is content BEFORE the first ###, it might be a preamble or "At a Glance" table
        if (h3Parts.length > 0 && !content.startsWith('###')) {
             const preamble = h3Parts[0] ? h3Parts[0].trim() : '';
             if (preamble) {
                 // Check for Table
                 const tableMatch = preamble.match(/\|[\s\S]*\|[\s\S]*\|/);
                 if (tableMatch) {
                     sections.push({
                         type: 'platform_table', // Or generic table
                         title: h2Title + ' Overview',
                         table: parseTable(tableMatch[0]),
                         order: order++
                     });
                 } else if (h2Title.includes('Jungian Archetype')) {
                      // Special case for content that isn't ### but is bullets
                      const bullets = preamble.match(/[-*]\s+(.+)/g)?.map(b => cleanMarkdown(b.replace(/^[-*]\s+/, '')));
                      if (bullets) {
                           sections.push({ type: 'archetype', title: h2Title, bullets, content: cleanMarkdown(preamble), order: order++ });
                      }
                 } else if (h2Title.includes('Brand Narrative')) {
                        sections.push({ type: 'narrative', title: 'Brand Narrative', content: cleanMarkdown(preamble), order: order++ });
                 } else if (h2Title.includes('Strategic Context')) {
                        // Context usually has findings structure without ###
                        const findingMatch = preamble.match(/\*\*Synthesized Finding:\*\*\s*([\s\S]*?)(?=\n\n\*\*|$)/);
                        const rationaleMatch = preamble.match(/\*\*Deep Rationale:\*\*\s*([\s\S]*?)(?=\n\n\*\*|$)/);
                        const implicationMatch = preamble.match(/\*\*Strategic Implication:\*\*\s*([\s\S]*?)(?=\n|$)/);
                        
                        if (findingMatch && findingMatch[1]) {
                            sections.push({
                                type: 'detailed_finding',
                                title: 'Strategic Context',
                                finding: cleanMarkdown(findingMatch[1]),
                                rationale: rationaleMatch && rationaleMatch[1] ? cleanMarkdown(rationaleMatch[1]) : undefined,
                                implication: implicationMatch && implicationMatch[1] ? cleanMarkdown(implicationMatch[1]) : undefined,
                                order: order++
                            });
                        } else {
                            sections.push({ type: 'generic_section', title: h2Title, content: cleanMarkdown(preamble), order: order++ });
                        }
                 }
             }
        }

        // Process H3 parts (1..N)
        for (let j = 1; j < h3Parts.length; j++) {
            const h3Part = h3Parts[j]!;
            const h3FirstLineEnd = h3Part.indexOf('\n');
            const h3TitleRaw = h3FirstLineEnd > -1 ? h3Part.substring(0, h3FirstLineEnd).trim() : h3Part.trim();
            const h3Body = h3FirstLineEnd > -1 ? h3Part.substring(h3FirstLineEnd).trim() : '';

            // Extract Title and Subtitle "1. Mission: Answering..."
            // Usually "1. Mission: Answering, '...'"
            const titleSplit = h3TitleRaw.split(/:\s*Answering,?\s*/i);
            const title = titleSplit[0] ? titleSplit[0].trim() : (h3TitleRaw || 'Findings');
            const subtitle = titleSplit[1] ? `Answering: ${titleSplit[1].replace(/^"|"$/g, '')}` : undefined;

            // Extract Finding, Rationale, Implication
            const findingMatch = h3Body.match(/\*\*Synthesized Finding:\*\*\s*([\s\S]*?)(?=\n\n\*\*|$)/);
            const rationaleMatch = h3Body.match(/\*\*Deep Rationale:\*\*\s*([\s\S]*?)(?=\n\n\*\*|$)/);
            const implicationMatch = h3Body.match(/\*\*Strategic Implication:\*\*\s*([\s\S]*?)(?=\n\n\*\*|$)/);
            
            const tableMatch = h3Body.match(/\|[\s\S]*\|[\s\S]*\|/);

            if (tableMatch && !findingMatch) {
                // Table Section (like Tonal Range)
                sections.push({
                    type: 'table_section',
                    title: title,
                    subtitle: subtitle,
                    table: parseTable(tableMatch[0]),
                    content: cleanMarkdown(h3Body.replace(tableMatch[0], '')),
                    order: order++
                });
            } else {
                sections.push({
                    type: 'detailed_finding',
                    title: title,
                    subtitle: subtitle,
                    finding: (findingMatch && findingMatch[1]) ? cleanMarkdown(findingMatch[1]) : undefined,
                    rationale: (rationaleMatch && rationaleMatch[1]) ? cleanMarkdown(rationaleMatch[1]) : undefined,
                    implication: (implicationMatch && implicationMatch[1]) ? cleanMarkdown(implicationMatch[1]) : undefined,
                    content: (!findingMatch && !rationaleMatch) ? cleanMarkdown(h3Body) : undefined, // Fallback
                    order: order++
                });
            }
        }
    }

    return {
        title: (titleMatch && titleMatch[1]) ? cleanMarkdown(titleMatch[1]) : 'Web Synthesis Report',
        prepared_by: (preparedByMatch && preparedByMatch[1]) ? cleanMarkdown(preparedByMatch[1]) : 'Humanbrand AI',
        analysis_date: (dateMatch && dateMatch[1]) ? cleanMarkdown(dateMatch[1]) : new Date().toLocaleDateString(),
        sections: sections.sort((a, b) => a.order - b.order),
        raw_markdown: markdown
    };
}
