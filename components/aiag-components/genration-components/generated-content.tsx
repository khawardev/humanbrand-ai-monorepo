import React, { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Separator } from "@/components/ui/separator";
import { AIAG_VERSION } from "@/lib/aiag/constants";
import { ContentActions } from "./content-actions";
import { ImageGenerator } from "./image/image-generator";
import { ContentChat } from "./content-chat";
import { GeneratedPersonaContent } from "./persona/generated-persona-content";
import { LineSpinner, Spinner } from "@/shared/spinner";
import { CustomTabs } from "@/shared/CustomTabs";
import { RiAiGenerate, RiChatSmileAiLine, RiImageCircleAiFill, RiUserSmileLine } from "react-icons/ri";

export function GeneratedContent(props: any) {

    const {
        isPersonaPending, isImagePending, content, imagePrompt, imageUrls, personaContent, chatHistory,
        handleRevise, feedback, setFeedback,
        handleAdaptPersona, personasText, setPersonasText, setUploadedPersonaFileData,
        handleImageAction, onImageFileChange, imageReferenceFileInfo,
        handleChatSend, isChatLoading, onChatFileChange, chatFileInfos,
        modelAlias, temperature, user
    } = props;

    const headerRef = useRef<HTMLDivElement>(null);

    return (
        <CustomTabs
            defaultValue="content_generate"
            triggerMaxWidthClass="max-w-30"
            tabs={[
                {
                    label: "Content",
                    value: "content_generate",
                    icon: <RiAiGenerate />,
                    content: (
                        <section>
                            <div ref={headerRef}>
                                <div className={"md:flex md:space-y-0 space-y-3 md:items-center items-end justify-between mb-4"}>
                                    <h4>AIAG - Content Generation Details ({AIAG_VERSION})</h4>
                                    <div className=" flex justify-end ">
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
                    icon: <RiImageCircleAiFill />,
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
                    icon: <RiChatSmileAiLine />,
                    content: (
                        <ContentChat
                            chatHistory={chatHistory}
                            handleChatSend={handleChatSend}
                            isChatLoading={isChatLoading}
                            onChatFileChange={onChatFileChange}
                            chatFileInfos={chatFileInfos}
                            modelAlias={modelAlias}
                            temperature={temperature}
                            user={user}
                        />
                    ),
                },
                {
                    label: "Persona",
                    value: "persona",
                    icon: isPersonaPending ? <Spinner /> : <RiUserSmileLine />,
                    content: (
                        <>
                            {!isPersonaPending && !personaContent && (
                                <div className="flex items-center  text-center justify-center h-[50vh] text-muted-foreground">
                                    No persona has been adapted for this content yet.
                                </div>
                            )}
                            {isPersonaPending && <LineSpinner>Adapting Persona...</LineSpinner>}
                            {personaContent && !isPersonaPending && <GeneratedPersonaContent content={personaContent} />}
                        </>
                    ),
                },
            ]}
        />
    );
}