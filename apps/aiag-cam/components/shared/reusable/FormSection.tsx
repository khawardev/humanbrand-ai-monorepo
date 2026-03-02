import React from 'react'

import { cn } from "@/lib/utils"

export const FormSection = ({ title, children, req, className }: { title: string; children: React.ReactNode, req?: boolean, className?: string }) => (
    <section className={cn("flex flex-col space-y-3", className)}>
        {title && (
            <span className=" text-xl font-medium tracking-tight">
                {title}
                {req && (
                    <span className="text-red-500 ml-1">*</span>
                )}
            </span>
        )}
        {children}
    </section>
)