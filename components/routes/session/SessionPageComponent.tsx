"use client"

import React, { useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { PiBrain } from "react-icons/pi"
import { RiAiGenerate } from "react-icons/ri"

import { CustomTabs } from "@/components/shared/CustomTabs"
import { Spinner } from "@/components/shared/Spinner"
import { useSessionContentGenerator } from "@/hooks/aiagHooks/useSessionContentGenerator"

import { SessionContent } from "./SessionContent"
import { SessionSelections } from "./SessionSelections"

interface SessionPageComponentProps {
  initialData: any
  user: any
}

export function SessionPageComponent({ initialData, user }: SessionPageComponentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const contentRef = useRef<HTMLDivElement>(null)

  const {
    isPending,
    isContentPending,
    isPersonaPending,
    isImagePending,
    selectedModel,
    setSelectedModel,
    selectedAudiences,
    setSelectedAudiences,
    selectedSubjects,
    setSelectedSubjects,
    selectedContentTypes,
    setSelectedContentTypes,
    isSocialPostSelected,
    selectedSocialPlatform,
    setSelectedSocialPlatform,
    selectedCampaignTypeId,
    selectedCtas,
    setSelectedCtas,
    referenceFileInfos,
    handleReferenceFileChange,
    additionalInstructions,
    setAdditionalInstructions,
    creativityValue,
    isGenerateDisabled,
    handleGenerate,
    handleRevise,
    handleAdaptPersona,
    handleImageAction,
    handleImageFileChange,
    imageReferenceFileInfo,
    handleChatSend,
    isChatLoading,
    handleChatFileChange,
    chatFileInfos,
    contentGenerated,
    imagePrompt,
    personaContent,
    imageUrls,
    chatHistory,
    feedback,
    setFeedback,
    personasText,
    setPersonasText,
    setUploadedPersonaFileData,
    modelAlias,
  } = useSessionContentGenerator(initialData)

  const sessionType = initialData.sessionType

  useEffect(() => {
    const isNew = searchParams.get("new") === "true"
    if (isNew && contentRef.current) {
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
      router.replace(`/dashboard/session/${initialData.id}`, { scroll: false })
    }
  }, [initialData.id, searchParams, router])

  return (
    <CustomTabs
      triggerMaxWidthClass="max-w-40"
      defaultValue="content_generate"
      tabs={[
        {
          label: "Selections",
          value: "selections",
          icon: <PiBrain />,
          content: (
            <div ref={contentRef}>
              <SessionSelections
                sessionType={sessionType}
                isPending={isPending}
                isContentPending={isContentPending}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                selectedAudiences={selectedAudiences}
                setSelectedAudiences={setSelectedAudiences}
                selectedSubjects={selectedSubjects}
                setSelectedSubjects={setSelectedSubjects}
                selectedContentTypes={selectedContentTypes}
                setSelectedContentTypes={setSelectedContentTypes}
                isSocialPostSelected={isSocialPostSelected}
                selectedSocialPlatform={selectedSocialPlatform}
                setSelectedSocialPlatform={setSelectedSocialPlatform}
                selectedCampaignTypeId={selectedCampaignTypeId}
                selectedCtas={selectedCtas}
                setSelectedCtas={setSelectedCtas}
                referenceFileInfos={referenceFileInfos}
                handleReferenceFileChange={handleReferenceFileChange}
                additionalInstructions={additionalInstructions}
                setAdditionalInstructions={setAdditionalInstructions}
                isGenerateDisabled={isGenerateDisabled}
                handleGenerate={handleGenerate}
              />
            </div>
          ),
        },
        {
          label: "AIAG Content",
          value: "content_generate",
          icon: isContentPending ? <Spinner /> : <RiAiGenerate />,
          content: (
            <SessionContent
              initialData={initialData}
              user={user}
              isContentPending={isContentPending}
              isPersonaPending={isPersonaPending}
              isImagePending={isImagePending}
              contentGenerated={contentGenerated}
              imagePrompt={imagePrompt}
              imageUrls={imageUrls}
              imageReferenceFileInfo={imageReferenceFileInfo}
              handleImageFileChange={handleImageFileChange}
              personaContent={personaContent}
              chatHistory={chatHistory}
              chatFileInfos={chatFileInfos}
              handleChatFileChange={handleChatFileChange}
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
              modelAlias={modelAlias || ""}
              creativityValue={creativityValue}
            />
          ),
        },
      ]}
    />
  )
}
