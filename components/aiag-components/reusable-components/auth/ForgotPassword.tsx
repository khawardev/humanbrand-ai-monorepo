"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await authClient.requestPasswordReset({
                email,
                redirectTo: `${window.location.origin}/reset-password`,
            });
            setMsg("If your email exists, a reset link has been sent.");
        } catch {
            setMsg("Something went wrong.");
        }
    }

    return (
        <div className="max-w-sm mx-auto space-y-4">
            <h1 className="text-xl font-bold">Forgot Password</h1>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit">Send Reset Link</Button>
            </form>
            {msg && <p className="text-sm">{msg}</p>}
        </div>
    );
}