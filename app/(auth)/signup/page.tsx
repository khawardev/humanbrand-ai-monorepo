'use client';

import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { signIn, signUp } from '@/lib/better-auth/auth-client';

interface FormValues {
  name: string;
  username: string;
  email: string;
  password: string;
}

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    defaultValues: { name: "", username: "", email: "", password: "" },
  });

  const handleFormSubmit = async (data: FormValues) => {
    setIsLoading(true);
    await signUp.email(data, {
      onSuccess: () => {
        toast.success("Account created successfully");
        router.push('/');
      },
      onError: (err: any) => {
        toast.error(err?.error?.message);
      }
    });
    setIsLoading(false);
  };
  const handleGoogleSignIn = async () => {
    const { error } = await signIn.social({
      provider: "google",
    }, {
      onSuccess: () => {
        toast.success("Google sign-in successfull");
      }
    });
    if (error) {
      console.error("Google sign-in failed, Please try again.", error);
      toast.error("Google sign-in failed, Please try again.");
    }
  };
  return (
    <div>
      <div className="mb-10">
        <h1 className=' md:text-4xl text-3xl font-bold tracking-tight'>Create <br /> your account</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
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
                  <Input type="password" placeholder="••••••••" {...field} autoComplete="on" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-5 mt-6">
            <Button disabled={isLoading} type="submit" className="w-full">
              {isLoading && <Loader2 className="size-3 animate-spin" />}
              Sign Up
            </Button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button variant="outline" className='w-full' onClick={handleGoogleSignIn}>
            <FcGoogle className="h-4 w-4" />
            Google
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm">
        Have an account?{" "}
        <Link href="/signin" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </div>
  );


}