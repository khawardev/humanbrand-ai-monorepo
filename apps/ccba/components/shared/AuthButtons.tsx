'use client';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { toast } from "sonner"

export function AuthButtons() {
    return (
        <li className="md:inline-block hidden">
            <Link href="/signin">
                <Button size={'sm'}>
                    Sign In
                </Button>
            </Link>
        </li>

    )
}

export function SignoutButton() {
    const router = useRouter()
    return (
        <span className="z-50 w-full" onClick={async () => {
            router.refresh();
            toast.success("Logout successfully!");
        }}>Sign out</span>
    )
}
