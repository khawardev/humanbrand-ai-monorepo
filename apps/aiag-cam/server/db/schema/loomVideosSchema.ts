import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { aiag_schema } from "./aiagSchema";

export const loomVideo = aiag_schema.table("loom_video", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  html: text("html"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
