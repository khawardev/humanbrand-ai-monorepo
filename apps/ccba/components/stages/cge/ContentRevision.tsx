"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Markdown from 'react-markdown';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ButtonSpinner } from "@/components/shared/SpinnerLoader";
import { reviseContent } from "@/server/actions/cge/contentActions";

const formSchema = z.object({
  user_feedback: z.string().min(10, "Please provide specific feedback."),
});

export default function ContentRevision({ camSessionId, brandId, originalContent, revisedContent, setRevisedContent }: { camSessionId: string, brandId: string, originalContent: string, revisedContent: string, setRevisedContent: (content: string) => void }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_feedback: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setRevisedContent("");
    startTransition(() => {
      (async () => {
      const { success, message, data } = await reviseContent({
        cam_session_id: camSessionId,
        brand_id: brandId,
        original_content: originalContent,
        ...values,
      });

      if (!success) return toast.error(message);

      setRevisedContent(data.revised_content);
      toast.success(message);
    })();
  });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Original Content</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="prose dark:prose-invert max-w-none p-4 border rounded-md bg-muted/20 h-96 overflow-y-auto">
                    <Markdown>{originalContent}</Markdown>
                </div>
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revision Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="user_feedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feedback</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Make it more engaging and add benefits about sustainability"
                          rows={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending || !originalContent}>
                  {isPending ? <ButtonSpinner>Revising...</ButtonSpinner> : "Revise Content"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Revised Content</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="flex items-center justify-center h-full">
              <ButtonSpinner>Revising...</ButtonSpinner>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <Markdown>{revisedContent}</Markdown>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
