// utils/cleanMarkdown.ts
export function cleanMarkdown(md: string): string {
    return md
        .trim()
        .replace(/^---\s*/g, '')  // Remove starting ---
        .replace(/\s*---$/g, ''); // Remove ending ---
}



export function cleanAndFixMarkdown(md: string): string {
    return md
        .trim()
        // Remove starting horizontal rule
        .replace(/^---\s*/g, '')
        // Remove ending horizontal rule
        .replace(/\s*---$/g, '')
        // Fix bullet points with newline after bold colon
        .replace(
            /^(\s*[-*]\s+\*\*[^:\n]+:\*\*)(\s*\n\s*)/gm,
            (_, title) => `${title} `
        );
}


export function cleanAndFlattenBullets(md: string): string {
    return md
        .trim()
        // Remove starting ---
        .replace(/^---\s*/g, '')
        // Remove ending ---
        .replace(/\s*---$/g, '')
        // Flatten bullets: join **Title:** with next paragraph
        .replace(
            /^(\s*[-*]\s+\*\*[^:\n]+:\*\*)\s*\n\s*/gm,
            (_, title) => `${title} `
        )
        // Optionally remove excess blank lines between bullets
        .replace(/\n{2,}/g, '\n\n');
}


export function cleanAndFlattenBulletsGoogle(md: string): string {
    // The regular expression to find a bullet point line ending in `:**`
    // followed by a newline and then the description.
    //
    // Breakdown of the RegEx:
    // ^                   - Start of a line (due to 'm' flag)
    // (                   - Start of capturing group 1 (this will be the entire title line)
    //   \s*[-*]\s+       - The bullet itself (e.g., "  - ") with optional indentation
    //   \*\*              - The opening bold characters
    //   .+?               - The title text. Non-greedy, matches any character until the next part of the pattern is found.
    //   :\*\*              - The literal colon and closing bold characters
    // )                   - End of capturing group
    // \s*\n\s*            - The newline between the title and description, with any surrounding whitespace/indentation

    const flattenRegex = /^(\s*[-*]\s+\*\*.+?:\*\*)\s*\n\s*/gm;

    return md
        .trim()
        // Remove starting --- (for frontmatter)
        .replace(/^---\s*/g, '')
        // Remove ending --- (for frontmatter)
        .replace(/\s*---$/g, '')
        // Flatten bullets: replace the newline after the title with a space
        .replace(flattenRegex, '$1 ')
        // Remove excess blank lines that might result between list items
        .replace(/\n\s*\n/g, '\n\n');
}