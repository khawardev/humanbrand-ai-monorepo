DROP TABLE "aiag_schema"."verification" CASCADE;--> statement-breakpoint
ALTER TABLE "aiag_schema"."user" ADD COLUMN "adminVerified" boolean DEFAULT false NOT NULL;