// import React, { useRef } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { Separator } from "@/components/ui/separator";
// import { AIAG_VERSION } from "@/lib/ai/constants";
// import { ContentActions } from "./content-actions";
// import { ImageGenerator } from "./image-generator";
// import { ContentChat } from "./content-chat";

// interface GeneratedContentProps {
//     content: string;
//     imagePrompt: string;
//     setImagePrompt: (prompt: string) => void;
//     setContentGenerated?:any
// }

// export function GeneratedContent({ content, imagePrompt, handleRevise, feedback, setFeedback }: any) {
//     const contentRef = useRef<any>(null);

//     return (
//         <main className="space-y-10">
//             <section>
//                 <div className="md:flex items-center justify-between">
//                     <h3 className="mb-4">AIAG - Content Generation Details ({AIAG_VERSION})</h3>
//                     <ContentActions
//                         handleRevise={handleRevise}
//                         feedback={feedback}
//                         setFeedback={setFeedback}
//                         content={content}
//                         contentRef={contentRef}
//                     />
//                 </div>
//                 <Separator className="mb-4" />
//                 <div ref={contentRef} className="prose prose-neutral max-w-none markdown-body space-y-3 dark:prose-invert">
//                     <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
//                 </div>
//                 <Separator className="mt-8" />
//             </section>
//             <ImageGenerator imagePrompt={imagePrompt}  />
//             <Separator />
//             <ContentChat />
//         </main>
//     );
// }


import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Separator } from "@/components/ui/separator";
import { AIAG_VERSION } from "@/lib/ai/constants";
import { ContentActions } from "./content-actions";
import { ImageGenerator } from "./image-generator";
import { ContentChat } from "./content-chat";
import { GeneratedPersonaContent } from "./persona/generated-persona-content";
import { LineSpinner } from "@/shared/spinner";

export function GeneratedContent({ content, imagePrompt, handleRevise, feedback, setFeedback, generatingPersona, personaGeneratedContent, setpersonasText, personasText, setuploadedPersonaFileData, handleAdaptPersona }: any) {
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

    const headerClasses = isHeaderSticky ? "fixed top-0 w-full max-w-none bg-background sm:w-8/12 z-20 border-b py-4" : "relative";


    return (
        <main className="space-y-10 ">
            <section>
                <div ref={headerRef} className={headerClasses}>
                    <div >
                        <div className={isHeaderSticky ? "md:flex items-center justify-between w-full" : "md:flex items-center justify-between mb-4"}>
                            <h3 className="text-muted-foreground" >AIAG - Content Generation Details ({AIAG_VERSION})</h3>
                            <ContentActions
                                handleRevise={handleRevise}
                                feedback={feedback}
                                setFeedback={setFeedback}
                                content={content}
                                contentRef={contentRef}
                                setpersonasText={setpersonasText}
                                personasText={personasText}
                                setuploadedPersonaFileData={setuploadedPersonaFileData}
                                handleAdaptPersona={handleAdaptPersona}


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
            {generatingPersona && (
                <>
                    <LineSpinner>Generating Persona Content..</LineSpinner>
                </>
            )}
            {!generatingPersona && personaGeneratedContent && (
                <>
                    <GeneratedPersonaContent
                        content={personaGeneratedContent}
                    />
                </>
            )}
            <ImageGenerator imagePrompt={imagePrompt} />
            <Separator />
            <ContentChat />
        </main>
    );
}