// import {
//     text,
//     timestamp,
//     pgSchema,
//     integer,
//     jsonb,
//     numeric,
// } from "drizzle-orm/pg-core"
// import { user } from "./users-schema"
// import crypto from "crypto";

// export const aiag_schema = pgSchema("aiag_schema")


// export const savedSession = aiag_schema.table("saved_sessions", {
//     id: text("id")
//         .primaryKey()
//         .$defaultFn(() => crypto.randomUUID()),
//     sessionType: text("type").notNull(),
//     userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
//     sessionTitle: text("title"),

    
//     selectedModel: integer("model"),
//     selectedAudiences: jsonb("audiences"),
//     selectedSubjects: integer("subjects"),
//     selectedContentTypes: jsonb("content_types"),
//     selectedCtas: jsonb("ctas"),
//     selectedSocialPlatform: integer("social_platform"),


//     referenceMaterial: text("reference_material"),
//     additionalInstructions: text("additional_instructions"),
//     contextualAwareness: text("contextual_awareness"),
//     selectedtone: integer("tone").notNull(),
//     temperature: numeric("temperature").notNull(),

//     generatedContent: text("generated_content").notNull(),
//     imagePrompt: text("image_prompt").notNull(),
//     imageurl: text("image_url"),
//     personaContent: text("persona_content"),


//     createdAt: timestamp('createdAt').notNull().defaultNow(),
//     updatedAt: timestamp('updatedAt').notNull().defaultNow(),
// })



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
    additionalInstructions: text("additional_instructions"),
    contextualAwareness: text("contextual_awareness"),
    tone: integer("tone"),
    temperature: numeric("temperature"),

    generatedContent: text("generated_content"),
    imagePrompt: text("image_prompt"),

    personaContent: text("persona_content"),

    imageUrls: jsonb("image_urls"),
    imageReferenceFileInfo: jsonb("image_reference_file_info"),

    chatHistory: jsonb("chat_history"),
    chatPdfInfo: jsonb("chat_pdf_info"),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
})