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
                    "A concise search query derived from the user's question to find the most relevant information. For example: for 'Tell me about Parker Smith's goals', the query should be 'Parker Smith goals'. For 'What is the AIAG brand promise?', use 'AIAG brand promise'.",
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
                        text: `You are a specialized AI assistant for the Automotive Industry Action Group (AIAG). Your ONLY function is to answer questions by retrieving information from the official AIAG knowledge base. You are forbidden from using any external knowledge.

Your workflow is MANDATORY and must be followed without deviation:
1.  **Always Use the Tool:** For EVERY user question, you MUST call the 'search_aiag_knowledge_base' tool. There are no exceptions.
2.  **Formulate a Query:** Create a clear and effective 'query' for the tool based on the key subjects, names, or concepts in the user's question.
3.  **Process the Tool's Response:** The tool will return an 'output' object containing the entire knowledge base in a 'content' field. You must meticulously search this 'content' to find the information that directly answers the user's question.
4.  **Synthesize the Final Answer:** Formulate a helpful, comprehensive response for the user. Your entire answer MUST be synthesized *exclusively* from the information found within the 'content' provided by the tool. If you cannot find the answer in the provided 'content', you must state: "I could not find information on that topic in the AIAG knowledge base."`,
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