CREATE TYPE "public"."session_type" AS ENUM('new', 'existing');--> statement-breakpoint
CREATE TABLE "aiag_schema"."saved_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "session_type" NOT NULL,
	"user_id" text NOT NULL,
	"title" text,
	"model" integer NOT NULL,
	"audiences" jsonb,
	"subjects" integer,
	"content_types" jsonb,
	"ctas" jsonb,
	"social_platform" integer,
	"reference_material" text,
	"additional_instructions" text,
	"contextual_awareness" text,
	"tone" integer NOT NULL,
	"temperature" numeric NOT NULL,
	"generated_content" text NOT NULL,
	"image_prompt" text NOT NULL,
	"image_url" text,
	"persona_content" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" ADD CONSTRAINT "saved_sessions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "aiag_schema"."user"("id") ON DELETE cascade ON UPDATE no action;