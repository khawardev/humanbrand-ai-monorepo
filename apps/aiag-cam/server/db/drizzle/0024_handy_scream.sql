CREATE TYPE "aiag_schema"."support_status" AS ENUM('pending', 'in_progress', 'completed', 'rejected');--> statement-breakpoint
CREATE TYPE "aiag_schema"."support_type" AS ENUM('bug_report', 'feature_request');--> statement-breakpoint
CREATE TABLE "aiag_schema"."support_ticket" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"subject" text NOT NULL,
	"description" text NOT NULL,
	"type" "aiag_schema"."support_type" DEFAULT 'bug_report' NOT NULL,
	"status" "aiag_schema"."support_status" DEFAULT 'pending' NOT NULL,
	"admin_remarks" text,
	"attachments" text[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" RENAME COLUMN "campaign_id" TO "campaign_type_id";--> statement-breakpoint
ALTER TABLE "aiag_schema"."support_ticket" ADD CONSTRAINT "support_ticket_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "aiag_schema"."user"("id") ON DELETE cascade ON UPDATE no action;