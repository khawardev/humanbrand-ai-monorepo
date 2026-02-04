'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { signIn } from '@/lib/auth/authClient';
import { FcGoogle } from 'react-icons/fc';
import SignInForm from '@/components/shared/reusable/auth/SignInForm';

export default function Page() {
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
        <h1 className=' md:text-5xl text-3xl font-bold tracking-tight'>Sign in <br /> your account</h1>
      </div>

      <SignInForm />

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