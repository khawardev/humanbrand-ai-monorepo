
import { cleanAndFlattenBulletsGoogle } from "@/lib/cleanMarkdown";
import { generateNewContent, generateSessionTitle } from "@/server/actions/generateNewContentActions";
import { getImageGenerationPrompt } from "@/lib/aiag/prompts";

export async function generateContentWithTitleService(
    modelLabel: string | undefined,
    temperature: number,
    systemPrompt: string,
    userPrompt: string
) {
    const generateData = { modelAlias: modelLabel as any, temperature, systemPrompt, userPrompt };
    const generatedResult = await generateNewContent(generateData);
    const cleanedMarkdown = cleanAndFlattenBulletsGoogle(generatedResult.generatedText || "");
    
    // Generate title based on cleaned content
    const titleResult = await generateSessionTitle({ 
        modelAlias: modelLabel as any, 
        userPrompt: cleanedMarkdown,
        temperature
    });
    
    return { cleanedMarkdown, title: titleResult.generatedText };
}

export async function generateImagePromptService(
    modelLabel: string | undefined,
    temperature: number,
    contentGenerated: string,
    selectedAudiences?: string[],
    selectedSubject?: string
) {
    const imagePromptData = getImageGenerationPrompt({
        selectedAudiences,
        selectedSubject,
        contentGenerated,
    });
    
    const imagePromptResult = await generateNewContent({
        modelAlias: modelLabel as any,
        temperature,
        userPrompt: imagePromptData.finalImagePrompt,
    });
    
    return imagePromptResult.generatedText;
}
