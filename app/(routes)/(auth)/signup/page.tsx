'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { signIn } from '@/lib/auth/auth-client';
import { FcGoogle } from 'react-icons/fc';
import SignUpForm from '@/components/aiag-components/reusable-components/auth/SignUpForm';

export default function Page() {
  const handleGoogleSignIn = async () => {
    try {
      const res = await signIn.social({
        provider: "google",
      });
      if (res?.error) {
        console.error("Google sign-in failed", res.error);
        return;
      }
    } catch (err) {
      console.error("Google sign-in failed:", err);
    }
  };
  return (
    <div>
      <div className="mb-10">
        <h1 className=' md:text-4xl text-3xl font-bold tracking-tight'>Create <br /> your account</h1>
      </div>

      <SignUpForm />

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
        Have an account?{" "}
        <Link href="/signin" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </div>
  );
}