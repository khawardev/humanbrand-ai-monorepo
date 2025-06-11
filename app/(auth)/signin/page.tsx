'use client';



import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";
import Spinner from "@/shared/spinner";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const isEmail = formData.identifier.includes('@');
      if (isEmail) {
        const response = await signIn.email({
          email: formData.identifier,
          password: formData.password,
        });
        if (response.error) {
          console.log("SIGN_IN:", response.error.message);
          setLoading(false);
          setError(response.error.message || 'undefined, not able to sign in');
        } else {
          router.push('/');
        }

      } else {
        const response = await signIn.username({
          username: formData.identifier,
          password: formData.password,
        });
        if (response.error) {
          console.log("SIGN_IN:", response.error.message);
          setLoading(false);
          setError(response.error.message || 'undefined, not able to sign in');
        } else {
          router.push('/');
        }

      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="pb-20" >
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Sign in to your account</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="mb-1 block text-sm font-medium text-muted-foreground"
            htmlFor="identifier"
          >
            Email or Username
          </label>
          <Input
            id="identifier"
            type="text"
            placeholder="Email - Username"
            value={formData.identifier}
            onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
            required
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium text-muted-foreground"
            htmlFor="password"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            autoComplete="on"
            placeholder="••••••••"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        {error &&
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        }
        <div className="flex flex-col gap-3 mt-6">
          <Button disabled={loading} type="submit" className="w-full">
            {loading ? <Spinner>Signing in...</Spinner> : 'Sign In'}
          </Button>
          <Button disabled={loading} variant="outline" className="w-full">
            Login with Google
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </div>
  );
}
