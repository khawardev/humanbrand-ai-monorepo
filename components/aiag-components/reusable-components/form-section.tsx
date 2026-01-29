import React from 'react'

export const FormSection = ({ title, children, req }: { title: string; children: React.ReactNode, req?: boolean }) => (
    <section className="flex flex-col space-y-10">
        <h1 className="md:text-4xl text-3xl font-bold tracking-tight">
            {title.split(' ').map((word, index, array) => (
                <span key={index} className="block">
                    {word}
                    {index === array.length - 1 && req && (
                        <span className="text-red-500 ml-1">*</span>
                    )}
                </span>
            ))}
        </h1>
        {children}
    </section>
)