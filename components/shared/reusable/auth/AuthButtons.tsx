import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthButtons() {
    return (
        <>
            <Button asChild className="rounded-full">
                <Link href={'/signin'}>
                    Sign In
                </Link>
            </Button>
        </>

    )
}
