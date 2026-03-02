"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createSupportTicket } from "@/server/actions/supportActions";
import { uploadImageToSupabase } from "@/lib/supabase/uploadImageToSupabase";
import { Loader2 } from "lucide-react";
import { MultiImageDropzone } from "@/components/shared/reusable/uploads/MultiImageDropzone";

const formSchema = z.object({
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  type: z.enum(["bug_report", "feature_request"]),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

export function SupportRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      type: "bug_report",
      description: "",
    },
  });



  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const attachmentUrls: string[] = [];

      if (attachments.length > 0) {
        toast.info("Uploading attachments...");
        for (const file of attachments) {
          const url = await uploadImageToSupabase(file);
          attachmentUrls.push(url);
        }
      }

      await createSupportTicket({
        ...values,
        attachments: attachmentUrls,
      });

      toast.success("Support ticket created successfully!");
      form.reset();
      setAttachments([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create support ticket.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Create a Support Ticket</h3>
        <p className="text-sm text-muted-foreground">
          Report a bug or request a new feature.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Enter ticket subject" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bug_report">Bug Report</SelectItem>
                    <SelectItem value="feature_request">Feature Request</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your issue or request..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Attachments</FormLabel>
            <FormControl>
               <MultiImageDropzone onFilesChange={setAttachments} />
            </FormControl>
             <FormMessage />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin" />}
            Submit Ticket
          </Button>
        </form>
      </Form>
    </div>
  );
}
