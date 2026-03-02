ALTER TABLE "aiag_schema"."saved_sessions" RENAME COLUMN "reference_pdf_info" TO "reference_file_infos";--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" RENAME COLUMN "reference_pdf_data" TO "reference_files_data";--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" RENAME COLUMN "chat_pdf_info" TO "chat_file_infos";--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" RENAME COLUMN "chat_pdf_data" TO "chat_files_data";--> statement-breakpoint
ALTER TABLE "aiag_schema"."saved_sessions" DROP COLUMN "chat_history";