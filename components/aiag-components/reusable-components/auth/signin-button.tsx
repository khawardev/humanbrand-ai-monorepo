'use client'

import { Button } from "@/components/ui/button"
import { signIn, signOut } from "@/lib/auth-client"
import { LogOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"

export function SigninButtonDesktop() {
    const signInGoogle = async () => {
        await signIn.social({
            provider: "google"
        })
    }
    return (
        <section className="md:inline-block hidden ">
            <Button onClick={signInGoogle} variant={'outline'} size={'sm'}>
                <FcGoogle /> Sign In
            </Button>
        </section>
    )
}

export function SigninButtonMobile() {
    const signInGoogle = async () => {
        await signIn.social({
            provider: "google"
        })
    }
    return (
        <section className="md:hidden inline-block  ">
            <Button className=" w-full" onClick={signInGoogle} size={'sm'}>
                <FcGoogle /> Sign In
            </Button>
        </section>
    )
}
export function SignoutButtonMobile() {
    const router = useRouter()
    return (
        <section className="md:hidden inline-block  ">
            <Button className=" w-full" onClick={async () => {
                await signOut();
                router.refresh();
            }} size={'sm'} variant={'destructive'}>
                <LogOutIcon /> Sign out
            </Button>
        </section>
    )
}