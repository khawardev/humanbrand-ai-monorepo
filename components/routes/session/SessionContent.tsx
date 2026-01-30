"use client"

import { GeneratedContent } from "@/components/shared/generations/GeneratedContent"
import { LineSpinner } from "@/components/shared/Spinner"

interface SessionContentProps {
  initialData: any
  user: any
  isContentPending: boolean
  isPersonaPending: boolean
  isImagePending: boolean
  contentGenerated: any
  imagePrompt: string
  imageUrls: string[]
  imageReferenceFileInfo: any
  handleImageFileChange: (val: any) => void
  personaContent: any
  chatHistory: any
  chatFileInfos: any
  handleChatFileChange: (val: any) => void
  feedback: any
  setFeedback: (val: any) => void
  personasText: any
  setPersonasText: (val: any) => void
  setUploadedPersonaFileData: (val: any) => void
  handleRevise: (val: any) => void
  handleAdaptPersona: (val: any) => void
  handleImageAction: (val: any) => void
  handleChatSend: (val: any) => void
  isChatLoading: boolean
  modelAlias: string
  creativityValue: number
}

export function SessionContent({
  initialData,
  user,
  isContentPending,
  isPersonaPending,
  isImagePending,
  contentGenerated,
  imagePrompt,
  imageUrls,
  imageReferenceFileInfo,
  handleImageFileChange,
  personaContent,
  chatHistory,
  chatFileInfos,
  handleChatFileChange,
  feedback,
  setFeedback,
  personasText,
  setPersonasText,
  setUploadedPersonaFileData,
  handleRevise,
  handleAdaptPersona,
  handleImageAction,
  handleChatSend,
  isChatLoading,
  modelAlias,
  creativityValue,
}: SessionContentProps) {
  return (
    <div className="space-y-10">
      {isContentPending ? (
        <LineSpinner>Generating Content...</LineSpinner>
      ) : (
        contentGenerated && (
          <div className=" flex flex-col space-y-12">
            <span className="text-4xl font-medium">{initialData.title}</span>
            <GeneratedContent
              user={user}
              isPersonaPending={isPersonaPending}
              isImagePending={isImagePending}
              content={contentGenerated}
              imagePrompt={imagePrompt}
              imageUrls={imageUrls}
              imageReferenceFileInfo={imageReferenceFileInfo}
              onImageFileChange={handleImageFileChange}
              personaContent={personaContent}
              chatHistory={chatHistory}
              chatFileInfos={chatFileInfos}
              onChatFileChange={handleChatFileChange}
              feedback={feedback}
              setFeedback={setFeedback}
              personasText={personasText}
              setPersonasText={setPersonasText}
              setUploadedPersonaFileData={setUploadedPersonaFileData}
              handleRevise={handleRevise}
              handleAdaptPersona={handleAdaptPersona}
              handleImageAction={handleImageAction}
              handleChatSend={handleChatSend}
              isChatLoading={isChatLoading}
              modelAlias={modelAlias}
              temperature={creativityValue}
            />
          </div>
        )
      )}
    </div>
  )
}
