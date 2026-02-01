'use client'

import { useEffect, memo } from "react";
import {
    FunctionDeclaration,
    LiveServerToolCall,
    Modality,
    Type,
} from "@google/genai";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { knowledgeBaseContent } from "@/lib/aiag/knowledgeBase";

const knowledgeBaseToolDeclaration: FunctionDeclaration = {
    name: "search_aiag_knowledge_base",
    description:
        "Provides access to the comprehensive AIAG knowledge base to find answers to user questions. This tool must be used to respond to any query related to AIAG's Knowledge Base Content.",
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
                        text: `You are ”Ava” (AIAG's Virtual Assistant), the AIAG AI Agent. You are designed to be a friendly, helpful, informative, and collaborative assistant. Your responses must strictly follow the structure, personality, tone, and guidelines defined below:

                                ---

                                GOALS:
                                - Help users by providing accurate, clear, and helpful answers strictly based on the AIAG Comprehensive Knowledge Base (KB).
                                - Support AIAG’s mission: “To unite and guide automotive leaders in developing practical, best-in-class standards.”
                                - Engage users in a supportive and collaborative manner, empowering them with reliable information.

                                ---

                                PERSONALITY:
                                - You are Ava, AIAG’s Virtual Assistant.
                                - Always introduce yourself clearly as: "Hi, I’m Ava, AIAG’s Virtual Assistant."
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
                                🚫 STRICTLY PROHIBTED : DO NOT Repeate the introduction again and again in the session or the conversation.
                                🚫 Do NOT guess, infer, or pull from external sources.  
                                🚫 Do NOT generate content outside what is explicitly stated in the KB.  
                                ✅ If the information is unavailable, respond with: “The requested information is not available in the AIAG knowledge base.”

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
                                🚫 STRICTLY PROHIBTED : DO NOT Repeate the introduction again and again, or welcome in the session or the conversation.
                                • Simply respond as a friendly, expert, collaborative assistant who always knows the answer when it’s in the KB—and says so clearly when it isn’t.
                                • If USER asks for the information about any persona or person which is present in the KB then do give him the requested information but keep in mind that while give him information in natural paragrpah sentences , do not use too much name of persona in the sentence.
                                • Make Natural sentences while responding.

                                IMPORTANT: The detailed AIAG Knowledge Base Content is available to you via the "search_aiag_knowledge_base" tool.
                                You MUST use this tool to access the knowledge base for any user query.
                                Do NOT rely on internal knowledge for AIAG specific topics; always query the tool.
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
                    const args = fc.args as any;
                    const query = args?.query;

                    const searchKB = (searchQuery: string, content: string) => {
                        if (!searchQuery) return content.slice(0, 5000); // Return first chunk if no query
                        
                        const terms = searchQuery.toLowerCase().split(/\s+/).filter(t => t.length > 3);
                        if (terms.length === 0) return content.slice(0, 5000);

                        // Split by logical sections or paragraphs
                        const chunks = content.split(/\n\n+/);
                        
                        const scoredChunks = chunks.map(chunk => {
                            const lowerChunk = chunk.toLowerCase();
                            let score = 0;
                            terms.forEach(term => {
                                if (lowerChunk.includes(term)) score += 1;
                            });
                            return { chunk, score };
                        });

                        // Filter and sort
                        const relevantChunks = scoredChunks
                            .filter(ch => ch.score > 0)
                            .sort((a, b) => b.score - a.score)
                            .slice(0, 5) // Return top 5 relevant chunks
                            .map(ch => ch.chunk);

                        if (relevantChunks.length === 0) {
                            return "No specific information found in the knowledge base for this query. The query was: " + searchQuery;
                        }

                        return relevantChunks.join("\n\n---\n\n");
                    };

                    const result = searchKB(query, knowledgeBaseContent);

                    return {
                        response: {
                            output: {
                                content: result,
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