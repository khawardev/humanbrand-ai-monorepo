import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Separator } from "@/components/ui/separator";
import { PersonaContentActions } from "./persona-content-actions";

export function GeneratedPersonaContent({ content }: any) {
    const [isHeaderSticky, setIsHeaderSticky] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!contentRef.current || !headerRef.current) return;
            const contentRect = contentRef.current.getBoundingClientRect();
            const headerHeight = headerRef.current.offsetHeight;
            const shouldBeSticky = contentRect.top <= 0 && contentRect.bottom >= headerHeight;
            setIsHeaderSticky(shouldBeSticky);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const headerClasses = isHeaderSticky ? "fixed top-0 w-full max-w-none bg-background z-20 border-b sm:w-8/12 py-4" : "relative";

    return (
        <main className="space-y-10 ">
            <section>
                {/* <div ref={headerRef} className={headerClasses}> */}
                <div ref={headerRef} >
                    <div >
                        {/* <div className={isHeaderSticky ? "md:flex items-center justify-between w-full" : "md:flex items-center justify-between mb-4"}> */}
                        <div className={"md:flex items-center justify-between mb-4"}>
                            <h4>Hyper-Relevant Persona Version</h4>
                            <PersonaContentActions
                                content={content}
                            />
                        </div>
                        {!isHeaderSticky && <Separator className="mb-4" />}
                    </div>
                </div>

                {isHeaderSticky && <div style={{ height: headerRef.current?.offsetHeight }} />}
                <div ref={contentRef} className="prose prose-neutral max-w-none markdown-body space-y-3 dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </div>
                <Separator className="mt-8" />
            </section>
        </main>
    );
}