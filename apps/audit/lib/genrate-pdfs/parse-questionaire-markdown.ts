// src/lib/genrate-pdfs/parse-questionaire-markdown.ts

export interface ContentBlock {
    type: 'mainTitle' | 'sectionHeader' | 'paragraph' | 'question' | 'fillInTheBlank' | 'bulletedList' | 'footerLine';
    content: any;
}

interface QuestionContent {
    number: string;
    text: string;
    context: string;
}

interface FillInTheBlankContent {
    number: string;
    startText: string;
    endText: string;
    context: string;
}

export function parseQuestionnaireMarkdown(markdown: string): ContentBlock[] {
    const blocks: ContentBlock[] = [];
    if (!markdown) return blocks;

    const lines = markdown.split('\n');
    let i = 0;

    while (i < lines.length) {
        const line = lines[i]?.trim() || '';

        if (line === '---' || line === '') {
            i++;
            continue;
        }

        if (line.startsWith('### ')) {
            const type = blocks.length === 0 ? 'mainTitle' : 'sectionHeader';
            blocks.push({ type, content: line.substring(4) });
            i++;
            continue;
        }

        const questionMatch = line.match(/^(\d+)\.\s+(.*)/);
        if (questionMatch) {
            const number = questionMatch[1];
            let text = questionMatch[2] || '';
            let context = '';

            const blankPattern = '_____';
            const blankIndex = text.indexOf(blankPattern);

            if (blankIndex !== -1) {
                const startText = text.substring(0, blankIndex).trim();
                const endText = text.substring(blankIndex + blankPattern.length).trim();

                i++;
                while (i < lines.length) {
                    const row = lines[i];
                    if (!row || row.match(/^\d+\.\s/) || row.startsWith('###')) break;
                    const nextLine = row.trim();
                    if (nextLine.startsWith('**Context:**')) {
                        context = nextLine.replace(/\*\*Context:\*\*/, '').trim();
                    }
                    i++;
                }
                blocks.push({ type: 'fillInTheBlank', content: { number, startText, endText, context } as FillInTheBlankContent });

            } else {
                i++;
                while (i < lines.length) {
                    const row = lines[i];
                    if (!row || row.match(/^\d+\.\s/) || row.startsWith('###')) break;
                    const nextLine = row.trim();
                    if (nextLine.startsWith('**Context:**')) {
                        context = nextLine.replace(/\*\*Context:\*\*/, '').trim();
                    } else if (nextLine) {
                        text += ` ${nextLine}`;
                    }
                    i++;
                }
                blocks.push({ type: 'question', content: { number, text, context } as QuestionContent });
            }
            continue;
        }

        if (line.startsWith('- ')) {
            const items = [];
            while (i < lines.length) {
                const row = lines[i];
                if (!row || !row.trim().startsWith('- ')) break;
                items.push(row.trim().substring(2));
                i++;
            }
            blocks.push({ type: 'bulletedList', content: items });
            continue;
        }

        const footerMatch = line.match(/^\*\*(.*?):\*\*\s*(.*)/);
        if (footerMatch) {
            blocks.push({ type: 'footerLine', content: { label: footerMatch[1], value: footerMatch[2] } });
            i++;
            continue;
        }

        blocks.push({ type: 'paragraph', content: line });
        i++;
    }

    return blocks;
}