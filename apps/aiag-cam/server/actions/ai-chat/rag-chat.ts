'use server';

import { createClient } from "@supabase/supabase-js";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getRelevantContext(query: string) {
    try {
        const { embedding } = await embed({
            model: openai.embedding("text-embedding-3-small"),
            value: query,
        });

        const { data, error } = await supabase.rpc("get_relevant_chunks", {
            query_vector: embedding,
            match_threshold: 0.3,
            match_count: 5,
        });

        if (error) {
            console.error("Supabase RPC Error in getRelevantContext:", error);
            return "";
        }

        if (!data || data.length === 0) {
             console.warn("No vector results found for query:", query);
             return "";
        }

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

