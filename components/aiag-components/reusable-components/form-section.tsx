import React from 'react'

export const FormSection = ({ title,  children, req }: { title: string;  children: React.ReactNode, req ?:boolean }) => (
    <section className="flex flex-col space-y-4">
        <span className="text-xl tracking-tight font-bold">{title} {req && <span className="text-red-500">*</span> } </span>
        {children}
    </section>
)