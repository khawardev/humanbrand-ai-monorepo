"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth/authClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
    const router = useRouter();
    const params = useSearchParams();
    const token = params.get("token");
    const error = params.get("error");

    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!token) {
            setMsg("Reset link invalid or expired.");
            return;
        }
        try {
            await authClient.resetPassword({ newPassword: password, token });
            setMsg("Password updated. Redirecting...");
            setTimeout(() => router.push("/signin"), 1200);
        } catch {
            setMsg("Failed to reset password.");
        }
    }

    if (error === "INVALID_TOKEN") {
        return <p className="text-red-600">Link invalid or expired.</p>;
    }

    return (
        <div className="max-w-sm mx-auto space-y-4">
            <h1 className="text-xl font-bold">Reset Password</h1>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit">Update Password</Button>
            </form>
            {msg && <p className="text-sm">{msg}</p>}
        </div>
    );
}