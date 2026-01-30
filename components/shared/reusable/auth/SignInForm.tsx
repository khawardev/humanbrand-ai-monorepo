'use client';

import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { signIn } from '@/lib/auth/authClient';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FormValues {
    email: string;
    password: string;
}

export default function SignInForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<FormValues>({
        defaultValues: { email: "", password: "" },
    });

    const handleFormSubmit = async (data: FormValues) => {
        setIsLoading(true);
        await signIn.email(data, {
            onSuccess: () => {
                toast.success("Signed in successfully!");
                router.push("/dashboard/ai-chat");
                router.refresh();
            },
            onError: (err: any) => {
                if (err.status === 403) {
                    toast.error("Please verify your email before signing in.");
                } else {
                    toast.error(err?.error?.message);
                }
            }
        });
        setIsLoading(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
                <FormField
                    control={form.control}
                    name="email"
                    rules={{
                        required: "Email is required.",
                        pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: "Please enter a valid email address.",
                        },
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="name@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    rules={{
                        required: "Password is required.",
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between">
                                <FormLabel>Password</FormLabel>
                                <FormLabel><Link href="/forgot-password">Forgot Password?</Link></FormLabel>
                            </div>

                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pr-10"
                                        {...field}
                                    />
                                    {field.value && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className=" h-4 w-4 animate-spin" />}
                    Sign In
                </Button>
            </form>
        </Form>
    );
}
