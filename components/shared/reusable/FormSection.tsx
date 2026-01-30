import React from 'react'

export const FormSection = ({ title, children, req }: { title: string; children: React.ReactNode, req?: boolean }) => (
    <section className="flex flex-col space-y-3">
        <span className=" text-xl font-medium tracking-tight">
            {title}
            {req && (
                <span className="text-red-500 ml-1">*</span>
            )}
        </span>
        {children}
    </section>
)