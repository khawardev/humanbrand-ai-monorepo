ALTER TABLE "aiag_schema"."saved_sessions" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" ALTER COLUMN "model" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."model_type";--> statement-breakpoint
DROP TYPE "public"."session_type";