"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Markdown from 'react-markdown';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ButtonSpinner } from "@/components/shared/SpinnerLoader";
import { generateContent } from "@/server/actions/cge/contentActions";

const formSchema = z.object({
  additional_instructions: z.string().min(10, "Please provide more detailed instructions."),
  model_id: z.string().optional(),
});

export default function ContentGeneration({ camSessionId, brandId, generatedContent, setGeneratedContent }: { camSessionId: string, brandId: string, generatedContent: string, setGeneratedContent: (content: string) => void }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      additional_instructions: "",
      model_id: "claude-3-5-sonnet",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setGeneratedContent("");
    startTransition(() => {
      (async () => {
      const { success, message, data } = await generateContent({
        cam_session_id: camSessionId,
        brand_id: brandId,
        ...values,
      });

      if (!success) return toast.error(message);
  
      setGeneratedContent(data.generated_content);
      toast.success(message);
    })();
  });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="additional_instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Write a compelling product description for our new eco-friendly water bottle..."
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="claude-3-haiku">claude-3-haiku</SelectItem>
                        <SelectItem value="claude-3-5-sonnet">claude-3-5-sonnet</SelectItem>
                        <SelectItem value="claude-3-7-sonnet">claude-3-7-sonnet</SelectItem>
                        <SelectItem value="claude-4-sonnet">claude-4-sonnet</SelectItem>
                        <SelectItem value="claude-4-opus">claude-4-opus</SelectItem>
                        <SelectItem value="deepseek-r1">deepseek-r1</SelectItem>
                        <SelectItem value="meta-llama4-scout">meta-llama4-scout</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? <ButtonSpinner>Generating...</ButtonSpinner> : "Generate Content"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Generated Content</CardTitle>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="flex items-center justify-center h-full">
              <ButtonSpinner>Generating...</ButtonSpinner>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none">
              <Markdown>{generatedContent}</Markdown>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
