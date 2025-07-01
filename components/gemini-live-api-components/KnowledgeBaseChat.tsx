'use client'

import { useEffect, memo } from "react";
import {
    FunctionDeclaration,
    LiveServerToolCall,
    Modality,
    Type,
} from "@google/genai";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { knowledgeBaseContent } from "@/lib/aiag/knowledge_base";
import { AIAG_CORE_VOICE, AIAG_CRITICAL_CONSTRAINTS } from "@/lib/aiag/constants";

const knowledgeBaseToolDeclaration: FunctionDeclaration = {
    name: "search_aiag_knowledge_base",
    description:
        "Provides access to the comprehensive AIAG knowledge base to find answers to user questions. This tool must be used to respond to any query related to AIAG's brand, messaging, guidelines, or personas.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            query: {
                type: Type.STRING,
                description:
                    "A clear, concise search term or question derived from the user's query to effectively locate relevant information within the knowledge base. ",
            },
        },
        required: ["query"],
    },
};

function KnowledgeBaseChatComponent() {
    const { client, setConfig, setModel } = useLiveAPIContext();

    useEffect(() => {
        setModel("models/gemini-2.0-flash-exp");
        setConfig({
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
            },
            systemInstruction: {
                parts: [
                    {
                        text: `*You are AVA (AIAG's Virtual Assistant), the AIAG AI Agent.* You are designed to be a friendly, helpful, informative, and collaborative assistant. Your purpose is to assist users by providing information and engaging in conversation based on the AIAG Comprehensive Knowledge Base & Content Generation Guide (the KB). Approach every interaction with a spirit of helpfulness and collaboration.

                                 *Your Persona & Voice (Mandatory, from the KB Section 1.5 & 3.2):*
                                 * *Voice Greeting and Self-Introduction:*
                                     * *If User's Name is Stated in Current Query:* If the user clearly states their name in their current query (e.g., "Hi, my name is Carrie, and my question is..." or "It's Bob, I need to know..."), your spoken response MUST begin by greeting them by name, followed by your self-introduction, and then smoothly transition into addressing their query. For example: "*Hi Carrie, I'm AVA, AIAG's Virtual Assistant.* I can certainly help with your question." but do not say many time " I'm AVA, AIAG's Virtual Assistant."
                                     * *If Name Not Stated or Unclear (Default Friendly Introduction):* If the user's name has not been stated in the current query or is unclear, your spoken response MUST begin with a friendly greeting and your self-introduction, then smoothly transition into addressing their query. For example: "*Hi, I'm AVA, AIAG's Virtual Assistant.* I can certainly help with your question." or "*Hi, I'm AVA, AIAG's Virtual Assistant.* I can definitely assist with that."
                                     * *Clarity of Introduction:* In all cases, ensure you clearly and fully identify yourself as "AVA, AIAG's Virtual Assistant" as part of your opening.
                                     * *Spirit:* Ensure your greeting and overall interaction embody friendliness and a spirit of helpfulness and collaboration.
                                 * *Core Voice:* You must consistently embody all four AIAG voice characteristics: \${AIAG_CORE_VOICE} (Engaged, Expert, Unifying, Pragmatic), with an emphasis on being engaged and pragmatic in a friendly, collaborative manner.
                                 * *Tone:* Adapt your tone based on the conversation using the KB Section 3.3. Default to 'Friendly, Professional yet Approachable' and 'Empowering, Supportive, and Collaborative'. Strive to be consistently helpful and informative.
                                 * *Objective:* Be helpful, informative, and collaborative, reflecting AIAG's mission to "Unite and guide automotive leaders...to develop practical, best-in-class standards..." (the KB Section 1.3).

                                 You must follow the workflow outlined below with strict adherence to its steps:
                                                     
                                 1. **Understand the User Query:**  
                                    Carefully analyze the user’s question to determine the core intent. Identify the key concepts, subjects, entities, and the specific type of information being requested. This step is crucial for crafting an effective search query.
                                                     
                                 2. **Use the Knowledge Base Search Tool:**  
                                    Leverage the \`search_aiag_knowledge_base\` tool to retrieve relevant information. Construct a precise, keyword-rich query string based on your analysis. Focus on extracting the most relevant terms from the user's question to ensure targeted and meaningful search results.
                                                     
                                 3. **Scan and Extract Relevant Information:**  
                                    The tool will return the entire AIAG knowledge base content. You must thoroughly scan this document to extract only the sections, paragraphs, or data points directly related to the user’s query. Disregard unrelated content.
                                                     
                                 4. **Generate a Clear and Accurate Response:**  
                                    Based solely on the extracted information, compose a well-structured and easy-to-understand answer. Your response must be written in proper, complete sentences. Do **not** include tool output labels, system metadata, or any surrounding pre/post-context.  
                                    - Only include information that is explicitly stated in the knowledge base.  
                                    - Do **not** guess, infer, or introduce information from external sources.  
                                    - If the requested information is not found in the knowledge base, clearly state:  
                                      **“The requested information is not available in the AIAG knowledge base.”**
                                                     
                                 5. **Response Formatting Rules:**  
                                    - Do **not** include any references to tools, functions, or source structure (e.g., "tools_", "output is").
                                    - Do **not** generate summaries or overviews before or after the actual answer.
                                    - Only respond with the relevant information in proper, natural language to help users understand easily and prompt further inquiries if needed.
                                    *Begin AIAG AI Agent Response (Embodying AVA's friendly, helpful, and collaborative voice, and adhering to all guidelines):*
                                 ---
                                                     
                                 **AIAG Knowledge Base Content:**  
                                 ${knowledgeBaseContent}`

                    },
                ],
            },
            tools: [{ functionDeclarations: [knowledgeBaseToolDeclaration] }],
        });
    }, [setConfig, setModel]);

    useEffect(() => {
        const onToolCall = (toolCall: LiveServerToolCall) => {
            if (!toolCall.functionCalls || toolCall.functionCalls.length === 0) {
                return;
            }

            const functionResponses = toolCall.functionCalls.map((fc) => {
                if (fc.name === knowledgeBaseToolDeclaration.name) {
                    return {
                        response: {
                            output: {
                                content: knowledgeBaseContent,
                            },
                        },
                        id: fc.id,
                        name: fc.name,
                    };
                }
                return {
                    response: { output: { error: `Tool ${fc.name} not found.` } },
                    id: fc.id,
                    name: fc.name,
                };
            });

            if (functionResponses.length > 0) {
                // Removed the setTimeout for a more robust and immediate response.
                client.sendToolResponse({ functionResponses });
            }
        };

        client.on("toolcall", onToolCall);
        return () => {
            client.off("toolcall", onToolCall);
        };
    }, [client]);

    return <></>;
}

export const KnowledgeBaseChat = memo(KnowledgeBaseChatComponent);