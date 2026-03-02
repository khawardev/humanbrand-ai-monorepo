'use client';
import { useState } from "react";
import AuthModal from "../auth/AuthModal";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function AuthButtons() {
    const router = useRouter();
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const handleAuthSuccess = () => {
        setAuthModalOpen(false);
        router.refresh();
    };
    return (
        <>
            <Button onClick={() => setAuthModalOpen(true)} size={'sm'} className="rounded-full">
                Sign In
            </Button>
            <AuthModal
                isOpen={isAuthModalOpen}
                onOpenChange={setAuthModalOpen}
                onAuthSuccess={handleAuthSuccess}
            />
        </>

    )
}
