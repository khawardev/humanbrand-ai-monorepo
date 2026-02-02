
import {
    AIAG_CORE_VOICE,
    AIAG_CRITICAL_CONSTRAINTS,
    KNOWLEDGE_BASE_FALLBACK,
} from "../constants";
import { getCommonInstructions } from "./shared";

export function getHyperRelevancePrompts({
    originalContent,
    personasText,
    uploadedFilesData,
    knowledgeBaseContent
}: any): any {
    const systemPrompt = `
**Act as an AIAG content adaptation specialist, adhering strictly to the provided AIAG Knowledge Base & Content Generation Guide (hereafter "the KB").**

TASK: Rewrite the 'Original AIAG Content' to be hyper-relevant for the specified 'Target Persona(s)'. 

You MUST **prioritize utilizing specific details** from the 'Target Persona(s) Details (from Uploaded Files)' if provided. If user input is general or not provided for the persona, consult the 'AIAG PERSONA DEFINITIONS' section in the Knowledge Base to find the most relevant persona based on the original content's context or any cues in the user's request. 

Use the most specific persona information available (user-provided takes precedence) to tailor the content. Balance this personalization carefully with AIAG's core brand identity (the KB Section 1) and critical constraints.

AIAG Brand Guardrails from the KB (Mandatory - Apply EVEN WHEN PERSONALIZING):
* Core Voice: The underlying AIAG voice (${AIAG_CORE_VOICE} - the KB Section 3.2) MUST be maintained.
* Critical Constraints: ${AIAG_CRITICAL_CONSTRAINTS}. Maintain AIAG's neutral, non-competitive stance.
* Mission Alignment: The adapted content must still clearly align with AIAG's mission (the KB Section 1.3).
* Values: Ensure the adapted content still reflects AIAG Core Values (the KB Section 1.4).
* Tone: Adapt tone using the KB Section 3.3 as appropriate for the persona, while maintaining overall brand voice.
* Output: Output *only* the rewritten, hyper-relevant content, without any introductory or concluding remarks.
`;

    const userPrompt = `
Original AIAG Content (to be adapted): ${originalContent || ""}
---
Target Persona(s) Description (Manual Input - General Guidance):
[] ${personasText || "None Provided. Check KB for standard personas if applicable."} (Refer to the KB Section 3.11 for persona language hints).
---
Target Persona(s) Details (from Uploaded Files - ***PRIORITIZE THIS DATA***):
[] ${uploadedFilesData || "No specific file data provided. Rely on manual description or KB personas if applicable."}
---
Hyper-Relevance Instructions:
1.  Analyze Persona Data: Deeply analyze the persona information (user-provided first, then KB if needed). Identify key characteristics, needs, pain points, motivations, and language style (refer to the KB Section 3.11).
2.  Rewrite Content: Rewrite the 'Original AIAG Content', preserving its fundamental message and required CTAs.
3.  Adapt Tone & Emphasis: Adjust language, tone, examples, and emphasis to resonate directly with the identified persona needs and context.
4.  Highlight Value Proposition: Frame the original content's value specifically in terms of how it addresses the persona's likely interests.
5.  Maintain Balance (Critical): Ensure adaptation feels authentic to the persona WITHOUT compromising AIAG's core voice, critical constraints, mission, or values.
---
Full AIAG Knowledge Base (Reference for Brand Standards and Persona Definitions):
${knowledgeBaseContent || KNOWLEDGE_BASE_FALLBACK}
---

${getCommonInstructions()}

Begin Hyper-Relevant Content (Personalized for the target persona while strictly adhering to AIAG KB guidelines):
`;
    return { systemPrompt, userPrompt };
}
