'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "./AuthModal";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthButtons() {
    const router = useRouter();
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const handleAuthSuccess = () => {
        setAuthModalOpen(false);
        router.refresh();
    };
    return (
        <>
            
            <Button asChild size={'xs'} className="rounded-full">
                <Link href={'/signin'}>
                    Sign In
                </Link>
            </Button>

            {/* <Button asChild onClick={() => setAuthModalOpen(true)} size={'xs'} className="rounded-full">
                    Sign In
            </Button> */}

            {/* <AuthModal
                isOpen={isAuthModalOpen}
                onOpenChange={setAuthModalOpen}
                onAuthSuccess={handleAuthSuccess}
            /> */}
        </>

    )
}
