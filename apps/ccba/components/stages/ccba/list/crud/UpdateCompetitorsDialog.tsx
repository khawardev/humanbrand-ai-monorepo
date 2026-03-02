"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { brandSchema } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateCompetitorAction } from "@/server/actions/brandActions";
import { Spinner } from "@/components/shared/SpinnerLoader";
import { Card, CardContent } from "@/components/ui/card";

const competitorSchema = brandSchema.shape.competitors.unwrap().element;
type CompetitorFormValues = z.infer<typeof competitorSchema>;

function EditCompetitorForm({
  brandId,
  competitor,
  onSave,
  onCancel,
}: {
  brandId: string;
  competitor: any;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<CompetitorFormValues>({
    resolver: zodResolver(competitorSchema),
    defaultValues: competitor,
  });

  async function onSubmit(data: CompetitorFormValues) {
    setIsLoading(true);
    const { success, message } = await updateCompetitorAction(brandId, {
      competitor_id: competitor.competitor_id,
      ...data,
    });
    setIsLoading(false);
    if (!success)
      return toast.error(message || "Failed to update competitor.");

    toast.success(message);
    onSave();
    router.refresh();
  }

  return (
    <div >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Competitor Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Vercel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://vercel.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="facebook_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://facebook.com/vercel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="instagram_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://instagram.com/vercel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedin_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/company/vercel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="x_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>X (Twitter) URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://x.com/vercel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="youtube_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://youtube.com/c/vercel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Spinner />}
              Confirm
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export function UpdateCompetitorsDialog({
  brand,
  children,
}: {
  brand: any;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [editingCompetitorId, setEditingCompetitorId] = useState<string | null>(
    null
  );

  const handleSave = () => {
    setEditingCompetitorId(null);
  };

  const handleCancel = () => {
    setEditingCompetitorId(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Update Competitors</DialogTitle>
          <DialogDescription>
            Update competitors for {brand.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {brand.competitors.map((c: any) => (
            <div key={c.competitor_id}>
              {editingCompetitorId === c.competitor_id ? (
                <EditCompetitorForm
                  brandId={brand.brand_id}
                  competitor={c}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              ) : (
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <span className="font-medium">{c.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingCompetitorId(c.competitor_id)}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
