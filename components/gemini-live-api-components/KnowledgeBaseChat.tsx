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

const knowledgeBaseToolDeclaration: FunctionDeclaration = {
    name: "search_aiag_knowledge_base",
    description:
        "A MANDATORY tool that must be called for every user query. It accesses the entire AIAG knowledge base to find the definitive answer.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            query: {
                type: Type.STRING,
                description:
                    "A concise search query derived from the user's question to find the most relevant information. ",
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
                        text: `You are an expert AI assistant whose primary function is to serve as an interface to the Automotive Industry Action Group (AIAG) knowledge base. Your goal is to provide precise and helpful answers drawn exclusively from this internal document.

Your operational workflow is as follows:
1.  **Analyze the Query:** When a user asks a question, first perform a deep analysis to understand its core intent. Identify all key subjects, names, concepts, and the specific details being requested.

2.  **Utilize the Search Tool:** You must use the 'search_aiag_knowledge_base' tool to answer the query. Based on your analysis, construct a concise and effective 'query' string for the tool. This query should contain the most relevant keywords from the user's request to guide the search.

3.  **Process the Provided Data:** The tool will return the entire content of the AIAG knowledge base. You must then meticulously scan this document to locate all sections, paragraphs, and data points that are directly relevant to the user's question.

4.  **Synthesize the Final Response:** After gathering all relevant information from the document, formulate a comprehensive and clear response. It is critical that your answer is based strictly and exclusively on the information retrieved from the knowledge base. Do not infer, invent, or use any external information. If the requested information cannot be found within the provided document, you must clearly state that the information is not available in the knowledge base.`,
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