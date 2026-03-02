'use client'

import { Separator } from "@/components/ui/separator";
import { Blur, BlurDelay } from "@/components/shared/MagicBlur";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export function DashboardInnerLayout({ children }: any) {
    return (
        <Blur className="flex flex-col  md:p-10 p-4 pt-6 w-full">
            {children}
        </Blur>
    )
}

export function DashboardLayoutHeading({ title, subtitle }: any) {
    return (
        <>
            <DashboardInnerLayout>
                <h1 className="text-3xl font-medium mb-2 tracking-tighter capitalize">{title}</h1>
                <p className="text-muted-foreground text-xl">{subtitle}</p>
            </DashboardInnerLayout>
            <Separator />
        </>
    )
}

export const DashboardHeader = ({ title, subtitle }: any) => {
    return (
        <div className="flex flex-col w-full gap-5">
            <div>
                <h1 className="text-2xl ">{title}</h1>
                {subtitle && <p className=" text-muted-foreground mt-1">{subtitle}</p>}
            </div>
            <Separator />
        </div>
    )
}

export function DashboardHeaderBlock({ title, subtitle, buttonLabel, buttonHref }: any) {
    return (
        <DashboardInnerLayout>
            <BlurDelay className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-muted-foreground">{subtitle}</p>
                </div>
                <Button asChild>
                    <Link href={buttonHref}>
                        <Plus />
                        {buttonLabel}
                    </Link>
                </Button>
            </BlurDelay>
        </DashboardInnerLayout>
    )
}