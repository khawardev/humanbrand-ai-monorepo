"use client";

import { getUser } from "@/actions/users-actions";
import { FormSection } from "@/components/aiag-components/reusable-components/form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/better-auth/auth-client";
import { redirect } from "next/navigation";
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
        <div className="max-w-sm mx-auto space-y-4 flex flex-col justify-center h-[60vh]">
            <FormSection title={'Forgot Password'} >
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <div className=" flex gap-2">

                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Button type="submit">Reset Link</Button>
                        </div>
                    </div>
                </form>
            </FormSection>
            {msg && <p className="text-sm">{msg}</p>}
        </div>
    );
}