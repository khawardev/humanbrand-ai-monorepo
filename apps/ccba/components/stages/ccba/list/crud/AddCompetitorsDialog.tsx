"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { addCompetitors } from "@/server/actions/brandActions";
import { Spinner } from "@/components/shared/SpinnerLoader";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const addCompetitorsSchema = z.object({
  competitors: brandSchema.shape.competitors,
});
type CompetitorsFormValues = z.infer<typeof addCompetitorsSchema>;

export function AddCompetitorsDialog({
  brand,
  children,
}: {
  brand: any;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<CompetitorsFormValues>({
    resolver: zodResolver(addCompetitorsSchema),
    defaultValues: {
      competitors: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "competitors",
    control: form.control,
  });

  async function onSubmit(data: any) {
    setIsLoading(true);
    const { success, message } = await addCompetitors(
      brand.brand_id,
      data.competitors
    );
    setIsLoading(false);
    if (!success) return toast.error(message);
    
    toast.success(message);
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Competitors</DialogTitle>
          <DialogDescription>
            Add new competitors for {brand.name}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <section className=" flex items-center justify-between">
              <div>
                <h3 className="text-lg  font-medium">Competitors</h3>
                <p className="text-sm text-muted-foreground">
                  Add your competitors' information.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    name: "",
                    url: "",
                    facebook_url: "",
                    instagram_url: "",
                    linkedin_url: "",
                    x_url: "",
                    youtube_url: "",
                  })
                }
              >
                <Plus /> Competitor
              </Button>
            </section>
            {fields.length > 0 && (
              <ScrollArea className="h-[260px] ">
                <div className="flex flex-col space-y-8 pt-6">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className=" flex flex-row-reverse gap-6  space-y-4  relative"
                    >
                      <div className=" w-full gap-6 flex  flex-col">
                        <span className="absolute flex justify-end flex-row w-full -z-10 text-[220px] font-bold text-primary/5  -top-6 -left-2 select-none">
                          C{index + 1}
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name={`competitors.${index}.name`}
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
                            name={`competitors.${index}.url`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Website URL</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://vercel.com"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`competitors.${index}.facebook_url`}
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
                            name={`competitors.${index}.instagram_url`}
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
                            name={`competitors.${index}.linkedin_url`}
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
                            name={`competitors.${index}.x_url`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>X (Twitter) URL</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="https://x.com/vercel"
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
                            name={`competitors.${index}.youtube_url`}
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
                      </div>
                      <Button
                        type="button"
                        size={"sm"}
                        variant={"destructive"}
                        onClick={() => remove(index)}
                        className=" absolute -top-4"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => (setOpen(false))}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Spinner />}
                Confirm
              </Button>
            </div>
          
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
