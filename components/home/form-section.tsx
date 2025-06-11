import React from 'react'

export const FormSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="flex flex-col space-y-4">
        <span className="text-lg font-bold">{title}</span>
        {children}
    </section>
)