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
import { signIn } from '@/lib/better-auth/auth-client';
import { FcGoogle } from 'react-icons/fc';

interface FormValues {
  email: string;
  password: string;
}

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<FormValues>({
    defaultValues: { email: "", password: "" },
  });

  const handleFormSubmit = async (data: FormValues) => {
    setIsLoading(true);
    await signIn.email(data, {
      onSuccess: () => {
        toast.success("Signed in successfully!");
        router.push('/ai');
        router.refresh();
      },
      onError: (err: any) => {
        toast.error(err?.error?.message);
      }
    });
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      const res = await signIn.social({
        provider: "google",
      });

      if (res?.error) {
        console.error("Google sign-in failed", res.error);
        toast.error("Google sign-in failed, please try again.");
        return;
      }

      // If redirect doesn’t happen (like Safari popup blocking),
      // you can manually handle here
      toast.success("Google sign-in successful!");
    } catch (err) {
      console.error("Google sign-in failed:", err);
      toast.error("Google sign-in failed, please try again.");
    }
  };
  return (
    <div className='flex flex-col gap-5'>
      <div className="mb-10">
        <h1 className=' md:text-4xl text-3xl font-bold tracking-tight'>Sign in <br /> your account</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
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
            render={({ field }: any) => (
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
            render={({ field }: any) => (
              <FormItem>
                <div className=' flex flex-between items-center w-full'>
                  <FormLabel>Password</FormLabel>
                  <FormLabel><Link href={'/forgot-password'} >Forgot Password</Link></FormLabel>
                </div>
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
              Sign In
            </Button>
          </div>
        </form>
      </Form>
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
      <div className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link href="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </div>
  );


}