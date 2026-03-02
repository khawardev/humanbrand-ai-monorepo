import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    ImageRun,
} from 'docx';
import { saveAs } from 'file-saver';
import { marked } from 'marked';

const fetchImageAsBuffer = async (url: string): Promise<ArrayBuffer | null> => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch image');
        return await response.arrayBuffer();
    } catch (error) {
        console.error('Failed to fetch image:', error);
        return null;
    }
};

const createHeader = async () => {
    const logoUrl = 'https://i.postimg.cc/yY06gqFK/HB-logo-name-mark-side-black-1.png';
    const logoBuffer = await fetchImageAsBuffer(logoUrl);
    if (!logoBuffer) return new Paragraph("Humanbrand AI");

    return new Paragraph({
        children: [
            new ImageRun({
                data: logoBuffer,
                type: 'jpg',
                transformation: {
                    width: 184,
                    height: 48,
                },
            }),
        ],
        spacing: { after: 850 }, // 15mm spacing after the logo
    });
};

const parseInlineFormatting = (text: string): TextRun[] => {
    const runs: TextRun[] = [];
    const regex = /(\*\*)(.*?)\1|(\*)(.*?)\3|(`)(.*?)\6|([^*`]+)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match[2]) {
            runs.push(new TextRun({ text: match[2], bold: true }));
        } else if (match[4]) {
            runs.push(new TextRun({ text: match[4], italics: true }));
        } else if (match[6]) {
            runs.push(
                new TextRun({
                    text: match[6],
                    font: { name: 'Courier New' },
                    shading: { fill: 'F1F1F1', type: 'clear', color: 'auto' },
                })
            );
        } else if (match[7]) {
            runs.push(new TextRun(match[7]));
        }
    }
    return runs.length > 0 ? runs : [new TextRun(text)];
};

export const generateQuestionnaireDocx = async (markdownContent: string, fileName: string) => {
    const tokens = marked.lexer(markdownContent);
    const docChildren: (Paragraph | Table)[] = [];

    // 1. Await the header creation and add it to the document first
    const headerElement = await createHeader();
    docChildren.push(headerElement);

    // 2. Process the rest of the Markdown tokens as before
    tokens.forEach((token) => {
        switch (token.type) {
            case 'heading':
                docChildren.push(
                    new Paragraph({
                        children: parseInlineFormatting(token.text),
                        heading: `Heading${token.depth}` as any,
                        spacing: { after: 240, before: 120 },
                    })
                );
                break;

            case 'paragraph':
                docChildren.push(
                    new Paragraph({
                        children: parseInlineFormatting(token.text),
                        spacing: { after: 160 },
                    })
                );
                break;

            case 'list':
                token.items.forEach((item: any) => {
                    docChildren.push(
                        new Paragraph({
                            children: parseInlineFormatting(item.text),
                            bullet: { level: 0 },
                            spacing: { after: 80 },
                        })
                    );
                });
                break;

            case 'table':
                const headerRow = new TableRow({
                    children: token.header.map(
                        (h: any) =>
                            new TableCell({
                                children: [
                                    new Paragraph({
                                        children: [new TextRun({ text: h.text, bold: true })],
                                    }),
                                ],
                                shading: { fill: 'F3F4F6' },
                            })
                    ),
                    tableHeader: true,
                });

                const bodyRows = token.rows.map(
                    (row: any[]) =>
                        new TableRow({
                            children: row.map(
                                (cell: any) =>
                                    new TableCell({
                                        children: [new Paragraph({ children: parseInlineFormatting(cell.text) })],
                                    })
                            ),
                        })
                );

                const table = new Table({
                    rows: [headerRow, ...bodyRows],
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
                        bottom: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
                        left: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
                        right: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
                        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
                        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" },
                    }
                });
                docChildren.push(table);
                break;

            case 'space':
                docChildren.push(new Paragraph(""));
                break;

            case 'hr':
                docChildren.push(new Paragraph({ border: { bottom: { color: "auto", space: 1, style: "single", size: 6 } } }));
                break;

            default:
                if ('text' in token && token.text) {
                    docChildren.push(
                        new Paragraph({
                            children: parseInlineFormatting(token.text),
                            spacing: { after: 160 },
                        })
                    );
                }
                break;
        }
    });

    const doc = new Document({
        sections: [{
            children: docChildren,
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName);
};