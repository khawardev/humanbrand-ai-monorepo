import {
    text,
    timestamp,
    pgSchema,
    integer,
    jsonb,
    numeric,
} from "drizzle-orm/pg-core"
import { user } from "./users-schema"
import crypto from "crypto";

export const aiag_schema = pgSchema("aiag_schema")

export const savedSession = aiag_schema.table("saved_sessions", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    sessionType: text("session_type").notNull(),
    title: text("title"),

    modelId: integer("model_id"),
    audienceIds: jsonb("audience_ids"),
    subjectId: integer("subject_id"),
    contentTypeIds: jsonb("content_type_ids"),
    ctaIds: jsonb("cta_ids"),
    socialPlatformId: integer("social_platform_id"),

    referencePdfInfo: jsonb("reference_pdf_info"),
    referencePdfData: text("reference_pdf_data"),

    additionalInstructions: text("additional_instructions"),
    contextualAwareness: text("contextual_awareness"),
    tone: integer("tone"),
    temperature: numeric("temperature"),

    generatedContent: text("generated_content"),
    imagePrompt: text("image_prompt"),

    personaContent: text("persona_content"),

    imageUrls: jsonb("image_urls"),
    imageReferenceFileInfo: jsonb("image_reference_file_info"),
    reference_image: text("reference_image"),
        
    chatHistory: jsonb("chat_history"),
    chatPdfInfo: jsonb("chat_pdf_info"),
    chatPdfData: text("chat_pdf_data"),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
})