'use client';

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/auth-client";
import Spinner from "@/shared/spinner";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function page() {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const response = await signUp.email({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      username: formData.username,
    });
    if (response.error) {
      console.log("SIGN_IN:", response.error.message);
      setLoading(false);
      setError(response.error.message || 'undefined, not able to sign up');
    } else {
      router.push('/');
    }
  };
  return (
    <div >
      <div className="mb-10">
        <h1>Create your <br /> account</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="mb-1 block text-sm font-medium text-muted-foreground"
            htmlFor="name"
          >
            Name
          </label>
          <Input
            id="name"
            type="text"
            placeholder="your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium text-muted-foreground"
            htmlFor="email"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label
            className="mb-1 block text-sm font-medium text-muted-foreground"
            htmlFor="username"
          >
            Username
          </label>
          <Input
            id="username"
            type="text"
            placeholder="your username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
            autoComplete="on"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={8}
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
            {loading ? <Spinner>Signing up...</Spinner> : 'Sign Up'}
          </Button>
          <Button disabled={loading} variant="outline" className="w-full">
            Signup with Google
          </Button>
        </div>
      </form>
      {/* Bottom link */}
      <div className="mt-4 text-center text-sm">
        Have an account?{" "}
        <Link href="/signin" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </div>
  );
}
