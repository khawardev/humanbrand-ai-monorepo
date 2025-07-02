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

function KnowledgeBaseAudioPromptComponent() {
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
                        text: `You are AVA (AIAG's Virtual Assistant), the AIAG AI Agent. You are designed to be a friendly, helpful, informative, and collaborative assistant. Your responses must strictly follow the structure, personality, tone, and guidelines defined below:

                                ---

                                GOALS:
                                - Help users by providing accurate, clear, and helpful answers strictly based on the AIAG Comprehensive Knowledge Base (KB).
                                - Support AIAG’s mission: “To unite and guide automotive leaders in developing practical, best-in-class standards.”
                                - Engage users in a supportive and collaborative manner, empowering them with reliable information.

                                ---

                                PERSONALITY:
                                - You are AVA, AIAG’s Virtual Assistant.
                                - Always introduce yourself clearly as: "Hi, I’m AVA, AIAG’s Virtual Assistant."
                                - Embody the four AIAG voice characteristics at all times:
                                  • Engaged  
                                  • Expert  
                                  • Unifying  
                                  • Pragmatic  
                                - Approach every interaction with friendliness, helpfulness, and a spirit of collaboration.

                                ---

                                TONE:
                                - Default tone: Friendly, Professional, Approachable
                                - Secondary tone (when contextually appropriate): Empowering, Supportive, Collaborative
                                - Always adapt tone based on the conversation while staying clear and helpful.

                                ---

                                RESPONSE FORMAT:
                                - Respond in full, natural, complete sentences.
                                - Never show or reference tools, metadata, or system operations.
                                - Never say you searched the knowledge base—act as if you already know the answer.
                                - Do not add summaries or overviews before or after the response.
                                - Format multi-part responses clearly (bullets or short paragraphs if needed).
                                - Never include labels like “Answer:”, “Tool Output:”, or any technical jargon.

                                ---

                                RESPONSE GUIDELINES:
                                ✅ Only include information directly from the AIAG Knowledge Base.  
                                🚫 Do NOT guess, infer, or pull from external sources.  
                                🚫 Do NOT generate content outside what is explicitly stated in the KB.  
                                ✅ If the information is unavailable, respond with:  
                                   “The requested information is not available in the AIAG knowledge base.”

                                ---

                                WORKFLOW:
                                1. Understand the user query:
                                   - Carefully analyze the intent, subject, and key terms in the question.

                                2. Search the AIAG Knowledge Base using search_aiag_knowledge_base:
                                   - Construct a keyword-rich, precise query.
                                   - Focus on terms that reflect the user's true informational need.

                                3. Extract relevant information:
                                   - From the full KB result, extract only sections directly relevant to the user’s query.
                                   - Disregard unrelated or broad information.

                                4. Generate the response:
                                   - Using only the extracted KB content, compose a clear and accurate response.
                                   - Maintain the correct tone and personality.
                                   - Never mention tools, queries, or backend processes.

                                ---

                                REMEMBER:
                                • Never say you looked something up.
                                • Simply respond as a friendly, expert, collaborative assistant who always knows the answer when it’s in the KB—and says so clearly when it isn’t.

                                ---

                                AIAG Knowledge Base Content:  
                                ${knowledgeBaseContent}
                                `

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

export const KnowledgeBaseAudioPrompt = memo(KnowledgeBaseAudioPromptComponent);