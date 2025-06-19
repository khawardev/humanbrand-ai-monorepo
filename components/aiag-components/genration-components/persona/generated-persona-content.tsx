import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Separator } from "@/components/ui/separator";
import { PersonaContentActions } from "./persona-content-actions";

export function GeneratedPersonaContent({ content }: any) {

    return (
        <main className="space-y-10 ">
            <section>
                <div  >
                    <div >
                        <div className={"flex md:items-center items-end justify-between mb-4"}>
                            <h4>Hyper-Relevant Persona Version</h4>
                            <div className=" flex justify-end ">
                                <PersonaContentActions
                                    content={content}
                                />
                            </div>
                        </div>
                        <Separator className="mb-4" />
                    </div>
                </div>

                <div className="prose prose-neutral max-w-none markdown-body space-y-3 dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                </div>
                <Separator className="mt-8" />
            </section>
        </main>
    );
}