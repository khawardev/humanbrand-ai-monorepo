export function analyzeToken(content: string): number {
    if (!content) return 0;
    return Math.ceil(content.length / 2);
}

export function splitContentByTokens(content: string, maxTokens: number): string[] {
    const maxChars = maxTokens * 2;
    const chunks: string[] = [];
    let start = 0;

    while (start < content.length) {
        let end = start + maxChars;
        
        if (end < content.length) {
            const lastNewline = content.lastIndexOf('\n', end);
            if (lastNewline > start + (maxChars * 0.7)) {
                end = lastNewline;
            } else {
                const lastPeriod = content.lastIndexOf('. ', end);
                if (lastPeriod > start + (maxChars * 0.7)) {
                    end = lastPeriod + 1;
                }
            }
        }

        chunks.push(content.slice(start, end).trim());
        start = end;
    }
    
    return chunks;
}