import { createClient } from "@supabase/supabase-js";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { config } from "dotenv";
import { knowledgeBaseContent } from "../lib/aiag/KnowledgeBase/Knowledge_Base";
import { AIAG_Website } from "../lib/aiag/KnowledgeBase/AIAG_Website";

// Load environment variables from .env.local
config({ path: ".env.local" }); 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !openaiApiKey) {
    console.error("Missing environment variables. Please check .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log("Seeding knowledge base...");

    // Split text
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    // Define sources to process
    // To add more data, simply add a new object to this array.
    // The script is idempotent: it will refresh existing sources and add new ones
    // without affecting data from sources not in this list.
    const sources = [
        { name: "internal-kb", content: knowledgeBaseContent },
        { name: "aiag-website", content: AIAG_Website }
    ];

    let totalChunks = 0;

    for (const source of sources) {
        // Check if this source already exists in the DB
        const { count, error: countError } = await supabase
            .from("chunks")
            .select("*", { count: 'exact', head: true })
            .eq("url", source.name);

        if (countError) {
            console.error(`Error checking source ${source.name}:`, countError.message);
            continue;
        }

        if (count !== null && count > 0) {
            console.log(`[SKIP] Source "${source.name}" already exists (${count} chunks).`);
            continue;
        }

        console.log(`[NEW] Processing source: ${source.name}...`);
        
        // No delete needed because we only proceed if it doesn't exist
        const chunks = await splitter.createDocuments([source.content]);
        console.log(`Created ${chunks.length} chunks for ${source.name}.`);
        totalChunks += chunks.length;

        for (const [i, chunk] of chunks.entries()) {
            const content = chunk.pageContent;
            
            try {
                // Embed
                const { embedding } = await embed({
                    model: openai.embedding("text-embedding-3-small"),
                    value: content,
                });

                // Insert
                const { error } = await supabase.from("chunks").insert({
                    content,
                    vector: embedding,
                    url: source.name, // Marker to identify this source
                    date_updated: new Date().toISOString(),
                });

                if (error) {
                    console.error(`Error inserting chunk ${i} for ${source.name}:`, error.message);
                } else {
                    if ((i + 1) % 10 === 0) { // Log every 10th chunk to reduce noise
                         console.log(`Inserted chunk ${i + 1}/${chunks.length} for ${source.name}`);
                    }
                }
            } catch (e) {
                console.error(`Error processing chunk ${i} for ${source.name}:`, e);
            }
        }
    }
    
    console.log(`Seeding complete. Total chunks processed: ${totalChunks}`);
}

seed().catch(console.error);
