
export function sanitizePrompt(prompt: string): string {
    return prompt
        .replace(/\b(nude|naked|nsfw|explicit|sexual|porn|adult)\b/gi, '')
        .replace(/\b(violence|weapon|gun|knife|blood|death)\b/gi, '')
        .replace(/\b(hate|racist|offensive|inappropriate)\b/gi, '')
        .trim();
}
