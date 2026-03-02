'use client';

import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signUp } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface FormValues {
    name: string;
    email: string;
    password: string;
}

export default function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<FormValues>({
        defaultValues: { name: "", email: "", password: "" },
    });

    const handleFormSubmit = async (data: FormValues) => {
        setIsLoading(true);
        await signUp.email(data, {
            onSuccess: () => {
                toast.success("Account created successfully");
                setTimeout(() => {
                    toast.success("Check your email to verify.");
                }, 2000);
                onSuccess();
            },
            onError: (err: any) => {
                toast.error(err?.error?.message);
            }
        });
        setIsLoading(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pt-4">
                <FormField
                    control={form.control}
                    name="name"
                    rules={{
                        required: "Name is required.",
                        minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters.",
                        },
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                        minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters.",
                        },
                    }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className=" size-3 animate-spin" />}
                    Sign Up
                </Button>
            </form>
        </Form>
    );
}