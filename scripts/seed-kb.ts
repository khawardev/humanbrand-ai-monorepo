import { createClient } from "@supabase/supabase-js";
import { embed } from "ai";
import { openai } from "@ai-sdk/openai";
import { config } from "dotenv";
import { knowledgeBaseContent } from "../lib/aiag/KnowledgeBase/Knowledge_Base";
import { AIAG_Website } from "../lib/aiag/KnowledgeBase/AIAG_Website";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
// Load environment variables
config({ path: ".env.local" });

// Types
interface Source {
  name: string;
  content: string;
}

// Configuration
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;
const BATCH_SIZE = 10;
const EMBEDDING_MODEL = "text-embedding-3-small";

// Environment validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey || !openaiApiKey) {
  console.error("Missing environment variables. Please check .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sources definition
const sources: Source[] = [
  { name: "internal-kb", content: knowledgeBaseContent },
  { name: "aiag-website", content: AIAG_Website },
];

/**
 * Checks if a source already exists in the database.
 */
async function checkSourceExists(sourceName: string): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from("chunks")
      .select("*", { count: "exact", head: true })
      .eq("url", sourceName);

    if (error) {
      throw error;
    }

    return count !== null && count > 0;
  } catch (error) {
    console.error(`Error checking existence for ${sourceName}:`, error);
    throw error;
  }
}

/**
 * Splits content into chunks and generates embeddings.
 */
async function processAndEmbedSource(source: Source) {
  console.log(`Processing source: ${source.name}...`);

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
  });

  const chunks = await splitter.createDocuments([source.content]);
  console.log(`Created ${chunks.length} chunks for ${source.name}.`);

  for (const [i, chunk] of chunks.entries()) {
    const content = chunk.pageContent;

    try {
      // Generate embedding
      const { embedding } = await embed({
        model: openai.embedding(EMBEDDING_MODEL),
        value: content,
      });

      // Insert into Supabase
      const { error } = await supabase.from("chunks").insert({
        content,
        vector: embedding as any, // Cast to any if type mismatch occurs with Supabase types
        url: source.name,
        date_updated: new Date().toISOString(),
      });

      if (error) {
        console.error(
          `Error inserting chunk ${i + 1}/${chunks.length} for ${source.name}:`,
          error.message
        );
      } else {
        // Log progress periodically
        if ((i + 1) % BATCH_SIZE === 0 || i + 1 === chunks.length) {
          console.log(
            `Inserted chunk ${i + 1}/${chunks.length} for ${source.name}`
          );
        }
      }
    } catch (e) {
      console.error(
        `Error processing chunk ${i + 1}/${chunks.length} for ${source.name}:`,
        e
      );
    }
  }
}

/**
 * Main seed function.
 */
async function seed() {
  console.log("Starting knowledge base seeding...");
  let totalProcessed = 0;
  let skipped = 0;

  for (const source of sources) {
    try {
      const exists = await checkSourceExists(source.name);

      if (exists) {
        console.log(`Source "${source.name}" already exists. Skipping.`);
        skipped++;
        continue;
      }

      await processAndEmbedSource(source);
      totalProcessed++;
    } catch (error) {
      console.error(`Failed to seed source ${source.name}:`, error);
    }
  }

  console.log("\nSeeding complete.");
  console.log(`Processed: ${totalProcessed}`);
  console.log(`Skipped: ${skipped}`);
}

seed().catch((error) => {
  console.error("Fatal error during seeding:", error);
  process.exit(1);
});
