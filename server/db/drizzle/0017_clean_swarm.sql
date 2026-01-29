CREATE TABLE "aiag_schema"."knowledge_base_chat" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"chat_history" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "knowledge_base_chat_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "aiag_schema"."knowledge_base_chat" ADD CONSTRAINT "knowledge_base_chat_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "aiag_schema"."user"("id") ON DELETE cascade ON UPDATE no action;