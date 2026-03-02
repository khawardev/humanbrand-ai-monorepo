
export function getImageGenerationPrompt({
    selectedAudiences,
    selectedSubject,
    contentGenerated
}: any): any {
    const finalImagePrompt = `Generate a to-the-point prompt for an image representing ${selectedSubject || "general AIAG theme"} for ${selectedAudiences?.join(', ')}, in a professional and modern style, related to: ${contentGenerated}... Please do not include anything extra in the prompt, just generate the to-the-point prompt according to the content provided.`;
    return { finalImagePrompt };
}
