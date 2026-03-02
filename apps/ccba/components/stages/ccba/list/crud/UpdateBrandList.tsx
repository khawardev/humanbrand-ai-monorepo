"use client";

import { useEffect, useState } from "react";
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
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/shared/SpinnerLoader";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { updateBrand } from "@/server/actions/brandActions";


export function EditBrandList({
    brand,
    children,
}: {
    brand: any;
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const form = useForm<any>({
        resolver: zodResolver(brandSchema),
        defaultValues: {
            name: "",
            url: "",
            facebook_url: "",
            instagram_url: "",
            linkedin_url: "",
            x_url: "",
            youtube_url: "",
            competitors: [],
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (brand && open) {
            form.reset({
                name: brand.name || "",
                url: brand.url || "",
                facebook_url: brand.facebook_url || "",
                instagram_url: brand.instagram_url || "",
                linkedin_url: brand.linkedin_url || "",
                x_url: brand.x_url || "",
                youtube_url: brand.youtube_url || "",
                competitors: brand.competitors || [],
            });
        }
    }, [brand, open, form]);

    const { fields, append, remove } = useFieldArray({
        name: "competitors",
        control: form.control,
    });

    async function onSubmit(data: any) {
        setIsLoading(true);
        const { success, message } = await updateBrand(brand.brand_id, data);
        setIsLoading(false);
        setOpen(false);

        if (!success) return toast.error(message || "Failed to update brand.");

        toast.success(message);
        router.refresh();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Brand</DialogTitle>
                    <DialogDescription>
                        Update the details for {brand.name}. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div>
                            <h3 className="text-lg font-medium mb-2">Brand Details</h3>
                            <Card className="p-4 space-y-4">
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
                            </Card>
                        </div>

                        <section className=" flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium">Competitors</h3>
                                <p className="text-sm text-muted-foreground">
                                    Update your competitors' information.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    append({
                                        competitor_id: "",
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
                                <Plus className=" h-4 w-4" /> Competitor
                            </Button>
                        </section>

                        {fields.length > 0 && (
                            <div className="flex flex-col space-y-8">
                                {fields.map((field, index) => (
                                    <Card
                                        key={field.id}
                                        className="relative p-4 space-y-4"
                                    >
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
                                        <Button
                                            type="button"
                                            size={"sm"}
                                            variant={"destructive"}
                                            onClick={() => remove(index)}
                                            className=" absolute -top-4 -right-2"
                                        >
                                            Remove
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                        )}

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="ghost">
                                    Close
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Spinner />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}