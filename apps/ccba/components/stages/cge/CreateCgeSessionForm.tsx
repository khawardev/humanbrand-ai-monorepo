"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ButtonSpinner } from "@/components/shared/SpinnerLoader";
import { createCamKnowledgeBase } from "@/server/actions/cge/sessionActions";
import { getBvoHistory } from "@/server/actions/bvo/agenticActions";

const formSchema = z.object({
  brand_id: z.string().min(1, "Please select a brand."),
  bam_session_id: z.string().min(1, "Please select a BVO session."),
});

export default function CreateCgeSessionForm({ brands }: { brands: any[] }) {
  const [bvoSessions, setBvoSessions] = useState<any[]>([]);
  const [isFetchingSessions, setIsFetchingSessions] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand_id: "",
      bam_session_id: "",
    },
  });

  const handleBrandChange = async (brandId: string) => {
    if (!brandId) {
      setBvoSessions([]);
      form.setValue("bam_session_id", "");
      return;
    }
    form.setValue("brand_id", brandId);
    form.setValue("bam_session_id", "");
    setIsFetchingSessions(true);
    const response = await getBvoHistory(brandId);
    if (response) {
      setBvoSessions(response.history);
    } else {
      toast.error("Failed to fetch BVO sessions for this brand.");
      setBvoSessions([]);
    }
    setIsFetchingSessions(false);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(() => {
      (async () => {
        const { success, message, data } = await createCamKnowledgeBase(values.brand_id, values.bam_session_id);
        if (!success) return toast.error(message);
        
        toast.success(message);
        router.push(`/dashboard/cge/${data.cam_session_id}?brand_id=${values.brand_id}`);
      })();
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New CGE Session</CardTitle>
        <CardDescription>
          Select a brand and a completed BVO session to create a knowledge base for content generation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="brand_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select onValueChange={handleBrandChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.brand_id} value={brand.brand_id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bam_session_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BVO Session</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isFetchingSessions || bvoSessions.length === 0}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isFetchingSessions ? "Loading sessions..." : "Select a BVO session"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {bvoSessions.map((session) => (
                        <SelectItem key={session.session_id} value={session.session_id}>
                          {session.session_id} ({new Date(session.date).toLocaleString()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? <ButtonSpinner>Creating...</ButtonSpinner> : "Create Session"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
