import {
    text,
    timestamp,
    jsonb,
} from "drizzle-orm/pg-core"
import { user } from "./users-schema"
import { relations } from "drizzle-orm";
import { aiag_schema } from "./aiag-schema";

export const knowledgeBaseChat = aiag_schema.table("knowledge_base_chat", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull().unique().references(() => user.id, { onDelete: "cascade" }),
    chatHistory: jsonb("chat_history"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const knowledgeBaseChatRelations = relations(knowledgeBaseChat, ({ one }) => ({
    user: one(user, {
        fields: [knowledgeBaseChat.userId],
        references: [user.id],
    }),
}));