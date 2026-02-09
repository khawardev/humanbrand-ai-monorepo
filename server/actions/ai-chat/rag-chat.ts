'use server';

import { createClient } from "@supabase/supabase-js";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import { getCommonInstructions } from "@/lib/aiag/prompts/shared";
import { AIAG_CORE_VOICE, AIAG_CRITICAL_CONSTRAINTS } from "@/lib/aiag/constants";

// Setup Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Or service role key if needed for RLS bypass
const supabase = createClient(supabaseUrl, supabaseKey);


export async function getRelevantContext(query: string) {
    try {
        // Generate embedding for the query
        const { embedding } = await embed({
            model: openai.embedding("text-embedding-3-small"),
            value: query,
        });

        // Fetch relevant chunks
        // RPC call matches the SQL function signature: query_vector, match_threshold, match_count
        const { data, error } = await supabase.rpc("get_relevant_chunks", {
            query_vector: embedding,
            match_threshold: 0.25, // Lowered to capture broader context match
            match_count: 10,
        });

        if (error) {
            console.error("Supabase RPC Error in getRelevantContext:", error);
            return "";
        }

        if (!data || data.length === 0) {
            return "";
        }

        // Format the context clearly for the LLM
        const context = data.map((item: any) => `
### Source: ${item.url || 'Unknown'} (Similarity: ${(item.similarity * 100).toFixed(1)}%)
**Content:**
${item.content}
`).join("\n\n---\n\n");

        return context;
    } catch (error) {
        console.error("Unexpected error in getRelevantContext:", error);
        return "";
    }
}


export async function getRAGSystemPrompt(conversationHistory: string, context: string): Promise<string> {
    const ragSystemPrompt = `
**Act as a helpful AIAG Assistant.**
Your goal is to answer the user's question using the provided context from the AIAG Knowledge Base.

Context for this Chat Turn:
* Relevant Knowledge Base Chunks:
${context || "No relevant context found in the knowledge base."}

* Previous Conversations: ${conversationHistory || "None Provided"}

AIAG Communication Standards (Mandatory):
1.  **Answer based on Context:** enhanced by the retrieved chunks. If the answer is not in the context, relying on your general knowledge but mention that it might not be specific to the internal documents.
2.  **Maintain AIAG Voice:** ${AIAG_CORE_VOICE}.
3.  **Apply Tone:** 'Professional yet Approachable' and 'Empowering and Supportive'.
4.  **Uphold Constraints:** ${AIAG_CRITICAL_CONSTRAINTS}.
5.  **Clarity on Sources:** You can reference the source URLs provided in the context if relevant.

---

${getCommonInstructions()}

Respond directly to the last user message in the history, considering the retrieved context.`;

    return ragSystemPrompt;
}
