"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Markdown from 'react-markdown';
import { CornerDownLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ButtonSpinner } from "@/components/shared/SpinnerLoader";
import { chat } from "@/server/actions/cge/chatActions";

const formSchema = z.object({
  question: z.string().min(1, "Please enter a question."),
});

interface Message {
  type: 'user' | 'bot';
  text: string;
}

export default function Chat({ camSessionId, brandId }: { camSessionId: string, brandId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, startTransition] = useTransition();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const userMessage: Message = { type: 'user', text: values.question };
    setMessages(prev => [...prev, userMessage]);
    form.reset();

    startTransition(() => {
      (async () => {
        const { success, message, data } = await chat({
          cam_session_id: camSessionId,
          brand_id: brandId,
          question: values.question,
        });
        if (!success) {
          toast.error(message);
          setMessages(prev => prev.slice(0, -1));
          return;
        }
        const botMessage: Message = { type: 'bot', text: data.answer };
        setMessages(prev => [...prev, botMessage]);
      })();
    });
  };

  return (
    <Card className="h-[70vh] flex flex-col">
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent ref={chatContainerRef} className="flex-grow overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-lg ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <Markdown>{message.text}</Markdown>
              </div>
            </div>
          ))}
          {isPending && (
            <div className="flex justify-start">
              <div className="p-3 rounded-lg bg-muted">
                <ButtonSpinner>Thinking...</ButtonSpinner>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <div className="p-4 border-t">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <FormControl>
              <Textarea
                placeholder="Ask a question about the brand..."
                {...form.register("question")}
                rows={2}
                className="pr-16"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)();
                  }
                }}
              />
            </FormControl>
            <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2" disabled={isPending}>
              <CornerDownLeft className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
}
