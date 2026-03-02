import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { marked } from 'marked';

const HEADING_COLOR = '#111827';
const TEXT_COLOR = '#111827';
const BORDER_COLOR = '#9CA3AF';

export function generateReportPdfFromMarkdown(markdownContent: string, fileName: string) {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    const margin = 15;
    const pageHeight = doc.internal.pageSize.getHeight();
    const contentWidth = doc.internal.pageSize.getWidth() - margin * 2;
    let yPosition = margin;

    const addPageIfNeeded = (spaceNeeded: number) => {
        if (yPosition + spaceNeeded > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
        }
    };

    const cleanText = (text: any): string => {
        if (typeof text !== 'string') return '';
        return text.replace(/\*\*|\*/g, '').trim();
    };

    const preProcessedContent = markdownContent.replace(/(\n---\n|\n\*\*\*\n)/g, '\n');
    const tokens = marked.lexer(preProcessedContent);

    tokens.forEach((token: any) => {
        addPageIfNeeded(20);

        switch (token.type) {
            case 'heading':
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(20 - token.depth * 2);
                doc.setTextColor(HEADING_COLOR);
                doc.text(cleanText(token.text), margin, yPosition, { maxWidth: contentWidth });
                yPosition += 10;
                break;

            case 'paragraph':
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.setTextColor(TEXT_COLOR);
                const pText = doc.splitTextToSize(cleanText(token.text), contentWidth);
                doc.text(pText, margin, yPosition);
                yPosition += (pText.length * 4.5) + 3;
                break;

            case 'list':
                token.items.forEach((item: any) => {
                    addPageIfNeeded(8);
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(10);
                    doc.setTextColor(TEXT_COLOR);
                    const itemText = doc.splitTextToSize(cleanText(item.text), contentWidth - 5);
                    doc.text(`•`, margin, yPosition);
                    doc.text(itemText, margin + 5, yPosition);
                    yPosition += (itemText.length * 4.5) + 2;
                });
                yPosition += 5;
                break;

            case 'table':
                const head = [token.header.map((h: any) => cleanText(h.text))];
                const body = token.rows.map((row: any[]) => row.map((cell: any) => cleanText(cell.text)));

                const columnStylesConfig: any = {};
                const sourceColumnWidth = 55;

                token.header.forEach((headerCell: any, index: any) => {
                    const headerText = cleanText(headerCell.text).toLowerCase();
                    if (headerText.includes('source')) {
                        columnStylesConfig[index] = { cellWidth: sourceColumnWidth };
                    } else {
                        columnStylesConfig[index] = { cellWidth: 'auto' };
                    }
                });

                autoTable(doc, {
                    head: head,
                    body: body,
                    startY: yPosition,
                    theme: 'grid',
                    tableWidth: contentWidth,
                    columnStyles: columnStylesConfig,
                    styles: {
                        fontSize: 8,
                        textColor: TEXT_COLOR,
                        cellPadding: 2,
                        lineWidth: 0.1,
                        lineColor: BORDER_COLOR,
                        overflow: 'linebreak',
                    },
                    headStyles: {
                        fillColor: '#F3F4F6',
                        textColor: TEXT_COLOR,
                        fontStyle: 'bold',
                    },
                    margin: { left: margin },
                });
                yPosition = (doc as any).lastAutoTable.finalY + 10;
                break;

            case 'hr':
            case 'space':
                break;

            default:
                if ('text' in token && token.text) {
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(10);
                    doc.setTextColor(TEXT_COLOR);
                    const defaultText = doc.splitTextToSize(cleanText(token.text), contentWidth);
                    doc.text(defaultText, margin, yPosition);
                    yPosition += (defaultText.length * 4.5) + 3;
                }
                break;
        }
    });

    doc.save(fileName);
}