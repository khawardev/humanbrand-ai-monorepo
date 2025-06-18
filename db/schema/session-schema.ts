import {
    text,
    timestamp,
    pgSchema,
    integer,
    jsonb,
    numeric,
    pgEnum,
} from "drizzle-orm/pg-core"
import { user } from "./users-schema"
import crypto from "crypto";

export const aiag_schema = pgSchema("aiag_schema")


export const savedSession = aiag_schema.table("saved_sessions", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    sessionType: text("type").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    sessionTitle: text("title"),

    selectedModel: text("model").notNull(),
    selectedAudiences: jsonb("audiences"),
    selectedSubjects: text("subjects"),
    selectedContentTypes: jsonb("content_types"),
    selectedCtas: jsonb("ctas"),
    selectedSocialPlatform: text("social_platform"),
    referenceMaterial: text("reference_material"),
    additionalInstructions: text("additional_instructions"),
    contextualAwareness: text("contextual_awareness"),
    selectedtone: integer("tone").notNull(),
    temperature: numeric("temperature").notNull(),


    generatedContent: text("generated_content").notNull(),
    imagePrompt: text("image_prompt").notNull(),
    imageurl: text("image_url"),
    personaContent: text("persona_content"),


    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})