ALTER TABLE "aiag_schema"."saved_sessions" RENAME COLUMN "type" TO "session_type";--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" RENAME COLUMN "model" TO "model_id";--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" RENAME COLUMN "audiences" TO "audience_ids";--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" RENAME COLUMN "subjects" TO "subject_id";--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" RENAME COLUMN "content_types" TO "content_type_ids";--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" RENAME COLUMN "ctas" TO "cta_ids";--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" RENAME COLUMN "social_platform" TO "social_platform_id";--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" RENAME COLUMN "reference_material" TO "reference_pdf_info";--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" RENAME COLUMN "image_url" TO "image_urls";--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" ALTER COLUMN "tone" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" ALTER COLUMN "temperature" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" ALTER COLUMN "generated_content" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" ALTER COLUMN "image_prompt" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" ADD COLUMN "image_reference_file_info" jsonb;--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" ADD COLUMN "chat_history" jsonb;--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" ADD COLUMN "chat_pdf_info" jsonb;