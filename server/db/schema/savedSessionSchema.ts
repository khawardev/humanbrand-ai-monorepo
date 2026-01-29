import {
    text,
    timestamp,
    integer,
    jsonb,
    numeric,
} from "drizzle-orm/pg-core"
import { user } from "./usersSchema"
import { relations } from "drizzle-orm";
import { aiag_schema } from "./aiagSchema";


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

    referenceFileInfos: jsonb("reference_file_infos"),
    referenceFilesData: text("reference_files_data"),

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
    chatFileInfos: jsonb("chat_file_infos"),
    chatFilesData: text("chat_files_data"),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
})



export const savedSessionRelations = relations(savedSession, ({ one }) => ({
    user: one(user, {
        fields: [savedSession.userId],
        references: [user.id],
    }),
}));