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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addBrand } from "@/server/actions/brandActions";
import { ContainerMd } from "@/components/shared/Containers";
import { Spinner } from "@/components/shared/SpinnerLoader";
import { Plus } from "lucide-react";
import StaticBanner from "@/components/shared/StaticBanner";
import { BlurDelay, BlurDelay2 } from "@/components/shared/MagicBlur";
import { DashboardInnerLayout, DashboardLayoutHeading } from "@/components/stages/ccba/dashboard/shared/DashboardComponents";

type BrandFormValues = z.infer<typeof brandSchema>;

const defaultValues: Partial<BrandFormValues> = {
  name: "",
  url: "",
  facebook_url: "",
  instagram_url: "",
  linkedin_url: "",
  x_url: "",
  youtube_url: "",
  competitors: [],
};

export default function AddBrandPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "competitors",
    control: form.control,
  });

  async function onSubmit(data: BrandFormValues) {
    try {
      setIsLoading(true);
      const { success, message } = await addBrand(data);
      if (!success) return toast.error(message)

      router.push("/dashboard/ccba");
      toast.success(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <DashboardLayoutHeading
        title="Onboarding"
        subtitle="Add your brand and competitors to get started."
      />
      <DashboardInnerLayout>
        <BlurDelay2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Details</CardTitle>
                  <CardDescription>
                    Please provide your brand's information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Inc." {...field} />
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
                            <Input placeholder="https://acme.com" {...field} />
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
                              placeholder="https://facebook.com/acme"
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
                              placeholder="https://instagram.com/acme"
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
                              placeholder="https://linkedin.com/company/acme"
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
                            <Input placeholder="https://x.com/acme" {...field} />
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
                              placeholder="https://youtube.com/c/acme"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <section className=" flex items-center justify-between">
                <div>
                  <h3 className="text-lg  font-medium">Competitors</h3>
                  <p className="text-sm text-muted-foreground">
                    Add your competitors' information.
                  </p>
                </div>
                <Button
                  type="button"
                  variant='outline'
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
              {fields.length > 0 &&
                <div >
                  <div className="flex flex-col space-y-8" >
                    {fields.map((field, index) => (
                      <div key={field.id} className=" flex flex-row-reverse gap-6  space-y-4 relative ">
                        <div className=" w-full gap-6 flex  flex-col">
                          <span className="absolute flex justify-end flex-row w-full -z-10 text-[220px] font-bold dark:text-accent text-primary/10  -top-6 -left-2 select-none">
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
                          size={'sm'}
                          variant={'destructive'}
                          onClick={() => remove(index)}
                          className=" absolute -top-4"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}

                  </div>
                </div>
              }
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Spinner />}
                Save Brand
              </Button>
            </form>
          </Form>
        </BlurDelay2>
      </DashboardInnerLayout >
    </>
  );
}
