ALTER TABLE "audit_schema"."verification" ALTER COLUMN "value" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "audit_schema"."audit" ADD COLUMN "competitorUrls" jsonb;--> statement-breakpoint
ALTER TABLE "audit_schema"."audit" ADD COLUMN "competitorsCrawledContent" jsonb;--> statement-breakpoint
ALTER TABLE "audit_schema"."audit" ADD COLUMN "comparisonReport" text;