// import React, { useState, useEffect, useRef } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { Separator } from "@/components/ui/separator";
// import { AIAG_VERSION } from "@/lib/aiag/constants";
// import { ContentActions } from "./content-actions";
// import { ImageGenerator } from "./image-generator";
// import { ContentChat } from "./content-chat";
// import { GeneratedPersonaContent } from "./persona/generated-persona-content";
// import { LineSpinner } from "@/shared/spinner";
// import { knowledgeBaseContent } from "@/lib/aiag/knowledge_base";

// export function GeneratedContent({ content, imagePrompt, handleRevise, feedback, setFeedback, generatingPersona, personaGeneratedContent, setpersonasText, personasText, setuploadedPersonaFileData, handleAdaptPersona, modelAlias,temperature }: any) {
//     const [isHeaderSticky, setIsHeaderSticky] = useState(false);
//     const contentRef = useRef<HTMLDivElement>(null);
//     const headerRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         const handleScroll = () => {
//             if (!contentRef.current || !headerRef.current) return;
//             const contentRect = contentRef.current.getBoundingClientRect();
//             const headerHeight = headerRef.current.offsetHeight;
//             const shouldBeSticky = contentRect.top <= 0 && contentRect.bottom >= headerHeight;
//             setIsHeaderSticky(shouldBeSticky);
//         };

//         window.addEventListener("scroll", handleScroll);
//         return () => {
//             window.removeEventListener("scroll", handleScroll);
//         };
//     }, []);

//     const headerClasses = isHeaderSticky ? "fixed top-0 w-full max-w-none bg-background sm:w-8/12 z-20 border-b py-4" : "relative";


//     return (
//         <main className="space-y-10 ">
//             <section>
//                 <div ref={headerRef} className={headerClasses}>
//                     <div >
//                         <div className={isHeaderSticky ? "md:flex items-center justify-between w-full" : "md:flex items-center justify-between mb-4"}>
//                             <h3 className="text-muted-foreground" >AIAG - Content Generation Details ({AIAG_VERSION})</h3>
//                             <ContentActions
//                                 handleRevise={handleRevise}
//                                 feedback={feedback}
//                                 setFeedback={setFeedback}
//                                 content={content}
//                                 contentRef={contentRef}
//                                 setpersonasText={setpersonasText}
//                                 personasText={personasText}
//                                 setuploadedPersonaFileData={setuploadedPersonaFileData}
//                                 handleAdaptPersona={handleAdaptPersona}
//                             />
//                         </div>
//                         {!isHeaderSticky && <Separator className="mb-4" />}
//                     </div>
//                 </div>

//                 {isHeaderSticky && <div style={{ height: headerRef.current?.offsetHeight }} />}
//                 <div ref={contentRef} className="prose prose-neutral max-w-none markdown-body space-y-3 dark:prose-invert">
//                     <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
//                 </div>
//                 <Separator className="mt-8" />
//             </section>
//             {generatingPersona && (
//                 <>
//                     <LineSpinner>Generating Persona Content..</LineSpinner>
//                 </>
//             )}
//             {!generatingPersona && personaGeneratedContent && (
//                 <>
//                     <GeneratedPersonaContent
//                         content={personaGeneratedContent}
//                     />
//                 </>
//             )}
//             <ImageGenerator imagePrompt={imagePrompt} />
//             <Separator />

//             <ContentChat
//                 originalContent={content}
//                 modelAlias={modelAlias}
//                 temperature={temperature}
//             />
//         </main>
//     );
// }




// import React, { useState, useEffect, useRef } from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { Separator } from "@/components/ui/separator";
// import { AIAG_VERSION } from "@/lib/aiag/constants";
// import { ContentActions } from "./content-actions";
// import { ImageGenerator } from "./image-generator";
// import { ContentChat } from "./content-chat";
// import { GeneratedPersonaContent } from "./persona/generated-persona-content";
// import { LineSpinner } from "@/shared/spinner";
// import { CustomTabs } from "@/shared/CustomTabs";
// import { TbBrandTwitterFilled, TbBrandYoutubeFilled } from "react-icons/tb";
// import { GlobeIcon, Image, User } from "lucide-react";
// import { HiOutlineChatAlt } from "react-icons/hi";
// import { BsStars } from "react-icons/bs";
// import { RiImageAiFill } from "react-icons/ri";

// export function GeneratedContent(props: any) {
//     const {
//         isPersonaPending, isImagePending, content, imagePrompt, imageUrls, personaContent, chatHistory,
//         handleRevise, feedback, setFeedback,
//         handleAdaptPersona, personasText, setPersonasText, setUploadedPersonaFileData,
//         handleImageAction, handleChatSend,
//         modelAlias, temperature
//     } = props;

//     const [isHeaderSticky, setIsHeaderSticky] = useState(false);
//     const contentRef = useRef<HTMLDivElement>(null);
//     const headerRef = useRef<HTMLDivElement>(null);

//     useEffect(() => {
//         const handleScroll = () => {
//             if (!contentRef.current || !headerRef.current) return;
//             const contentRect = contentRef.current.getBoundingClientRect();
//             const headerHeight = headerRef.current.offsetHeight;
//             const shouldBeSticky = contentRect.top <= 0 && contentRect.bottom >= headerHeight;
//             setIsHeaderSticky(shouldBeSticky);
//         };

//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//     const headerClasses = isHeaderSticky ? "fixed top-0 w-full max-w-none bg-background sm:w-8/12 z-20 border-b py-4" : "relative";

//     return (

//         <CustomTabs
//             defaultValue="content_generate"
//             tabs={[
//                 {
//                     label: "Content",
//                     value: "content_generate",
//                     icon: <BsStars />,
//                     content: <>
//                         <section>
//                             <div ref={headerRef} >
//                                 <div>
//                                     <div className={"md:flex items-center justify-between mb-4"}>
//                                         <h4>AIAG - Content Generation Details ({AIAG_VERSION})</h4>
//                                         <ContentActions
//                                             content={content}
//                                             handleRevise={handleRevise}
//                                             feedback={feedback}
//                                             setFeedback={setFeedback}
//                                             handleAdaptPersona={handleAdaptPersona}
//                                             personasText={personasText}
//                                             setPersonasText={setPersonasText}
//                                             setUploadedPersonaFileData={setUploadedPersonaFileData}
//                                         />
//                                     </div>
//                                     {!isHeaderSticky && <Separator className="mb-4" />}
//                                 </div>
//                             </div>

//                             <div ref={contentRef} className="prose prose-neutral max-w-none markdown-body space-y-3 dark:prose-invert">
//                                 <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
//                             </div>
//                             <Separator className="mt-8" />
//                         </section>

                        
//                     </>,
//                 },
//                 {
//                     label: "Image",
//                     value: "image_generate",
//                     icon: <Image />,
//                     content: (
//                         <ImageGenerator
//                             imagePrompt={imagePrompt}
//                             imageUrls={imageUrls}
//                             handleImageAction={handleImageAction}
//                             isPending={isImagePending}
//                         />
//                     ),
//                 },
//                 {
//                     label: "Chat",
//                     value: "chat",
//                     icon: <HiOutlineChatAlt />,
//                     content: (
//                         <ContentChat
//                             originalContent={content}
//                             chatHistory={chatHistory}
//                             handleChatSend={handleChatSend}
//                             modelAlias={modelAlias}
//                             temperature={temperature}
//                         />
//                     ),
//                 },
//                 {
//                     label: "Persona",
//                     value: "persona",
//                     icon: <User />,
//                     content: (
//                         <>
//                             {isPersonaPending && <LineSpinner>Adapting Persona...</LineSpinner>}
//                             {!isPersonaPending && !personaContent && <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
//                                 No persona has been adapted
//                             </div>}
//                             {personaContent && !isPersonaPending && <GeneratedPersonaContent content={personaContent} />}
//                         </>
//                     ),
//                 },
//             ]}
//         />
//     );
// }















import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Separator } from "@/components/ui/separator";
import { AIAG_VERSION } from "@/lib/aiag/constants";
import { ContentActions } from "./content-actions";
import { ImageGenerator } from "./image-generator";
import { ContentChat } from "./content-chat";
import { GeneratedPersonaContent } from "./persona/generated-persona-content";
import { LineSpinner } from "@/shared/spinner";
import { CustomTabs } from "@/shared/CustomTabs";
import { Image, User } from "lucide-react";
import { HiOutlineChatAlt } from "react-icons/hi";
import { BsStars } from "react-icons/bs";

export function GeneratedContent(props: any) {
    const {
        isPersonaPending, isImagePending, content, imagePrompt, imageUrls, personaContent, chatHistory,
        handleRevise, feedback, setFeedback,
        handleAdaptPersona, personasText, setPersonasText, setUploadedPersonaFileData,
        handleImageAction, onImageFileChange, imageReferenceFileInfo,
        handleChatSend, onChatFileChange, chatPdfInfo,
        modelAlias, temperature
    } = props;

    const headerRef = useRef<HTMLDivElement>(null);

    return (
        <CustomTabs
            defaultValue="content_generate"
            tabs={[
                {
                    label: "Content",
                    value: "content_generate",
                    icon: <BsStars />,
                    content: (
                        <section>
                            <div ref={headerRef}>
                                <div className={"md:flex items-center justify-between mb-4"}>
                                    <h4>AIAG - Content Generation Details ({AIAG_VERSION})</h4>
                                    <ContentActions
                                        content={content}
                                        handleRevise={handleRevise}
                                        feedback={feedback}
                                        setFeedback={setFeedback}
                                        handleAdaptPersona={handleAdaptPersona}
                                        personasText={personasText}
                                        setPersonasText={setPersonasText}
                                        setUploadedPersonaFileData={setUploadedPersonaFileData}
                                    />
                                </div>
                                <Separator className="mb-4" />
                            </div>
                            <div className="prose prose-neutral max-w-none markdown-body space-y-3 dark:prose-invert">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                            </div>
                        </section>
                    ),
                },
                {
                    label: "Image",
                    value: "image_generate",
                    icon: <Image />,
                    content: (
                        <ImageGenerator
                            imagePrompt={imagePrompt}
                            imageUrls={imageUrls}
                            handleImageAction={handleImageAction}
                            isPending={isImagePending}
                            onImageFileChange={onImageFileChange}
                            imageReferenceFileInfo={imageReferenceFileInfo}
                        />
                    ),
                },
                {
                    label: "Chat",
                    value: "chat",
                    icon: <HiOutlineChatAlt />,
                    content: (
                        <ContentChat
                            chatHistory={chatHistory}
                            handleChatSend={handleChatSend}
                            onChatFileChange={onChatFileChange}
                            chatPdfInfo={chatPdfInfo}
                            modelAlias={modelAlias}
                            temperature={temperature}
                        />
                    ),
                },
                {
                    label: "Persona",
                    value: "persona",
                    icon: <User />,
                    content: (
                        <>
                            {isPersonaPending && <LineSpinner>Adapting Persona...</LineSpinner>}
                            {!isPersonaPending && !personaContent && (
                                <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
                                    No persona has been adapted for this content yet.
                                </div>
                            )}
                            {personaContent && !isPersonaPending && <GeneratedPersonaContent content={personaContent} />}
                        </>
                    ),
                },
            ]}
        />
    );
}