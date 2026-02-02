
import {
    KNOWLEDGE_BASE_FALLBACK,
    USER_UPLOADED_FALLBACK,
} from "../constants";
import { getCommonInstructions, getBaseSystemPrompt } from "./shared";

export function getNewGenerationPrompts({
    selectedAudiences,
    selectedSubject,
    selectedContentTypes,
    selectedCtas,
    selectedSocialPlatform,
    userUploadedContent,
    additionalInstructions,
    contextualAwareness,
    knowledgeBaseContent,
    selectedtone
}: any): any {
    const toneInstruction = `User selected tone level: ${selectedtone} (1=Casual, 2=Conversational, 3=Professional, 4=Formal, 5=Academic). Use this to guide your choice and application of a suitable tone from the KB Section 3.3.`;
    const contextualAwarenessText = contextualAwareness 
        ? `**Contextual Awareness Input (User-provided):**\n${contextualAwareness}\n\n` 
        : "**Contextual Awareness Input (User-provided):**\n*(User did not provide specific context input for this generation.)*\n\n";

    const systemPrompt = `
${getBaseSystemPrompt(toneInstruction)}

${getCommonInstructions()}
`;

    const userPrompt = `
---------------------------------
PARAMETERS FOR THIS SPECIFIC TASK
---------------------------------
* Target Audience(s): ${selectedAudiences?.join(', ') || 'N/A'}
* Primary Content Focus: ${selectedSubject || 'N/A'}
* Requested Content Type(s): ${selectedContentTypes?.join(', ') || 'N/A'}
* Target Platform(s) (if applicable): ${selectedSocialPlatform || 'N/A'}
* Required Call(s) to Action (CTAs): ${selectedCtas?.join(', ') || 'N/A'}
* Additional User Instructions: ${additionalInstructions || 'None. Rely on the KB and parameters.'}
${contextualAwarenessText}

------------------------------------------------------
REQUIREMENTS CHECKLIST (Mandatory for Output Generation)
------------------------------------------------------
* [ ] KB Alignment: Content is fully aligned with the KB Sections 1 & 2.
* [ ] Voice Embodied: All AIAG Core Voice characteristics (the KB Section 3.2) are present.
* [ ] Tone Applied: Appropriate adaptive tone (the KB Section 3.3) selected and balanced with user's formality request.
* [ ] Constraints Met: All Critical Constraints upheld.
* [ ] Parameters Addressed: ALL specific task parameters are met.
* [ ] Style & Lexicon: Relevant KB Section 3 stylistic elements integrated naturally.
* [ ] Quality: Output is well-organized, clear, insightful, and proofread.

------------------------------
PROVIDED REFERENCE MATERIALS
------------------------------
### Full AIAG Knowledge Base (Primary Reference, assumed to contain Persona Definitions):
${knowledgeBaseContent || KNOWLEDGE_BASE_FALLBACK}

### User-Uploaded Reference Documents (Secondary Context, if provided by user for this generation):
${userUploadedContent || USER_UPLOADED_FALLBACK}
---
Generate the content now based on all instructions.

${getCommonInstructions()}
`;

    return { systemPrompt, userPrompt };
}


export function getExistingContentPrompts({
    userUploadedContent,
    additionalInstructions,
    contextualAwareness,
    knowledgeBaseContent,
    selectedtone
}: any): { systemPrompt: string; userPrompt: string } {
    const toneInstruction = `User selected tone level: ${selectedtone} (1=Casual, 2=Conversational, 3=Professional, 4=Formal, 5=Academic). Use this to guide your choice and application of a suitable tone from the KB Section 3.3.`;
    const contextualAwarenessText = contextualAwareness 
        ? `**Contextual Awareness Input (User-provided):**\n${contextualAwareness}\n\n` 
        : "**Contextual Awareness Input (User-provided):**\n*(User did not provide specific context input for this revision.)*\n\n";

    const systemPrompt = `
**Act as a sophisticated AIAG content strategist and editor, adhering strictly to the provided AIAG Knowledge Base & Content Generation Guide (hereafter "the KB").**

Your Goal: Revise, enhance, or repurpose the provided existing content to be insightful, engaging, high-quality, and 100% aligned with AIAG's brand identity, voice, and strategic objectives as defined in the KB.

${getBaseSystemPrompt(toneInstruction)}

${getCommonInstructions()}
`;

    const userPrompt = `
---------------------------------
PARAMETERS FOR THIS REVISION TASK
---------------------------------
* Additional User Instructions: ${additionalInstructions || 'None. Rely on the KB and the existing content.'}
${contextualAwarenessText}

------------------------------------------------------
REQUIREMENTS CHECKLIST (Mandatory for Output Generation)
------------------------------------------------------
* [ ] KB Alignment: The revised content is fully aligned with the KB Sections 1 & 2.
* [ ] Voice Injected: All AIAG Core Voice characteristics (the KB Section 3.2) are now present in the revision.
* [ ] Tone Applied: The requested tone has been correctly applied to the content.
* [ ] Constraints Met: All Critical Constraints have been upheld.
* [ ] Instructions Followed: The revision directly addresses the user's instructions.
* [ ] Quality Improved: The output is clearer, more insightful, and better organized than the original.

------------------------------
PROVIDED MATERIALS
------------------------------
### Full AIAG Knowledge Base (Primary Reference):
${knowledgeBaseContent || KNOWLEDGE_BASE_FALLBACK}

### User-Uploaded Reference Documents (Secondary Context, if provided by user for this generation):
${userUploadedContent || USER_UPLOADED_FALLBACK}
---
Generate the content now based on all instructions.
`;

    return { systemPrompt, userPrompt };
}


export function getCampaignContentPrompts(data: any) {
    const toneInstruction = `User selected tone level: ${'3'} (1=Casual, 2=Conversational, 3=Professional, 4=Formal, 5=Academic). Use this to guide your choice and application of a suitable tone from the KB Section 3.3.`;

    const systemPrompt = `
${getBaseSystemPrompt(toneInstruction)}

Your Goal: Revise, enhance, or repurpose the provided existing content to be insightful, engaging, high-quality, and 100% aligned with AIAG's brand identity, voice, and strategic objectives as defined in the KB.

${getCommonInstructions()}
`;

    const userPrompt = `
Based on the user's instructions and the knowledge base, generate the content for the campaign Type [${data.selectedCampaign}] for the following platforms:
- Newsletter Articles (3x)
- LinkedIn Posts (3x)
- Facebook Posts (3x)
- X (Twitter) Posts (3x)
- YouTube Scripts (3x)
- Paid LI Ads (3x)
- Press Release + Media Kit (1x)

**User Uploaded Content:**\n${data.referenceFilesData || "*No content uploaded.*"}\n\n
**Additional Instructions:**\n${data.additionalInstructions || "*No additional instructions provided.*"}\n\n
**Knowledge Base Reference:**\n${data.knowledgeBaseContent || "*No KB content supplied.*"}

${getCommonInstructions()}
`;

    return { systemPrompt, userPrompt };
}
