import jsPDF from 'jspdf';
import { InterRegular } from './inter-fonts';
import { parseQuestionnaireMarkdown, ContentBlock } from './parse-questionaire-markdown';

const PRIMARY_COLOR = '#111827';
const SECONDARY_COLOR = '#4B5563';
const LINE_COLOR = '#E5E7EB';
const PAGE_MARGIN = 20;
const LINE_HEIGHT = 6;
const SECTION_SPACING = 12;
const PARAGRAPH_SPACING = 5;

interface PdfData {
    markdownContent: string;
}

const toBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

export async function generateQuestionnairePdf(data: PdfData, fileName: string) {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    doc.addFileToVFS('Inter-Regular.ttf', InterRegular);
    doc.addFont('Inter-Regular.ttf', 'Inter', 'normal');
    doc.setFont('Inter', 'normal');

    const blocks = parseQuestionnaireMarkdown(data.markdownContent);

    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - PAGE_MARGIN * 2;
    let y = PAGE_MARGIN;

    const addPageIfNeeded = (spaceNeeded: number) => {
        if (y + spaceNeeded > pageHeight - PAGE_MARGIN) {
            doc.addPage();
            y = PAGE_MARGIN;
        }
    };

    const addHeader = async () => {
        const logoUrl = 'https://i.postimg.cc/yY06gqFK/HB-logo-name-mark-side-black-1.png';
        try {
            const response = await fetch(logoUrl);
            const blob = await response.blob();
            const base64Image = await toBase64(blob);
            const imgProps = doc.getImageProperties(base64Image);
            const imgWidth = 65;
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
            doc.addImage(base64Image, 'PNG', PAGE_MARGIN, y, imgWidth, imgHeight);
            y += imgHeight + 15;
        } catch (error) {
            console.error("Failed to load logo image:", error);
            doc.setFontSize(20);
            doc.setTextColor(PRIMARY_COLOR);
            doc.text('Humanbrand AI', PAGE_MARGIN, y);
            y += 20;
        }
    };

    const addMainTitle = (title: string) => {
        addPageIfNeeded(20);
        doc.setFont('Inter', 'normal');
        doc.setFontSize(20);
        doc.setTextColor(PRIMARY_COLOR);
        doc.text(title, PAGE_MARGIN, y);
        y += SECTION_SPACING;
    };

    const addParagraph = (text: string) => {
        addPageIfNeeded(30);
        doc.setFont('Inter', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(SECONDARY_COLOR);
        const split = doc.splitTextToSize(text, contentWidth);
        doc.text(split, PAGE_MARGIN, y);
        y += split.length * LINE_HEIGHT + PARAGRAPH_SPACING;
    };

    const addSectionHeader = (title: string) => {
        addPageIfNeeded(25);
        doc.setFont('Inter', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(PRIMARY_COLOR);
        doc.text(title, PAGE_MARGIN, y);
        y += 6;
        doc.setDrawColor(LINE_COLOR);
        doc.setLineWidth(0.3);
        doc.line(PAGE_MARGIN, y, pageWidth - PAGE_MARGIN, y);
        y += SECTION_SPACING;
    };

    const addQuestion = (content: { number: string; text: string; context: string }) => {
        addPageIfNeeded(40);
        doc.setFont('Inter', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(PRIMARY_COLOR);
        const question = `${content.number}. ${content.text}`;
        const splitQ = doc.splitTextToSize(question, contentWidth);
        doc.text(splitQ, PAGE_MARGIN, y);
        y += splitQ.length * LINE_HEIGHT + 3;

        if (content.context) {
            doc.setFont('Inter', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(SECONDARY_COLOR);
            const splitC = doc.splitTextToSize(`Context: ${content.context}`, contentWidth);
            doc.text(splitC, PAGE_MARGIN, y);
            y += splitC.length * (LINE_HEIGHT - 1) + 10;
        } else {
            y += 10;
        }
    };

    const addFillInTheBlank = (content: { number: string; startText: string; endText: string; context: string }) => {
        addPageIfNeeded(35);
        doc.setFont('Inter', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(PRIMARY_COLOR);

        const prefix = `${content.number}. ${content.startText}`;
        const prefixWidth = doc.getTextWidth(prefix);
        const lineLength = 70;
        const space = 2;

        doc.text(prefix, PAGE_MARGIN, y);

        const lineY = y - 1.5;
        doc.setDrawColor(SECONDARY_COLOR);
        doc.setLineWidth(0.2);
        doc.line(PAGE_MARGIN + prefixWidth + space, lineY, PAGE_MARGIN + prefixWidth + space + lineLength, lineY);

        doc.text(content.endText, PAGE_MARGIN + prefixWidth + space + lineLength + space, y);
        y += LINE_HEIGHT + 3;

        if (content.context) {
            doc.setFont('Inter', 'normal');
            doc.setFontSize(10);
            doc.setTextColor(SECONDARY_COLOR);
            const splitC = doc.splitTextToSize(`Context: ${content.context}`, contentWidth);
            doc.text(splitC, PAGE_MARGIN, y);
            y += splitC.length * (LINE_HEIGHT - 1) + 10;
        } else {
            y += 10;
        }
    };

    const addBulletedList = (items: string[]) => {
        addPageIfNeeded(items.length * 7);
        doc.setFont('Inter', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(PRIMARY_COLOR);
        items.forEach(item => {
            const split = doc.splitTextToSize(item, contentWidth - 10);
            doc.text('•', PAGE_MARGIN, y);
            doc.text(split, PAGE_MARGIN + 5, y);
            y += split.length * LINE_HEIGHT;
        });
        y += 5;
    };

    const addFooter = (footerLines: ContentBlock[]) => {
        doc.setFont('Inter', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(SECONDARY_COLOR);
        const footerY = pageHeight - 20;
        footerLines.forEach((block, i) => {
            const line = `${block.content.label}: ${block.content.value}`;
            doc.text(line, pageWidth / 2, footerY + i * 5, { align: 'center' });
        });
    };

    await addHeader();

    const contentBlocks = blocks.filter(b => b.type !== 'footerLine');
    const footerBlocks = blocks.filter(b => b.type === 'footerLine');

    contentBlocks.forEach(block => {
        switch (block.type) {
            case 'mainTitle':
                addMainTitle(block.content);
                break;
            case 'sectionHeader':
                addSectionHeader(block.content);
                break;
            case 'paragraph':
                addParagraph(block.content);
                break;
            case 'question':
                addQuestion(block.content);
                break;
            case 'bulletedList':
                addBulletedList(block.content);
                break;
        }
    });

    addFooter(footerBlocks);
    doc.save(fileName);
}