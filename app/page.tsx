'use client'

import { CheckboxCard } from "@/components/home/checkbox-card"
import { FormSection } from "@/components/home/form-section"
import { Generate } from "@/components/home/generate"
import { ModelsTabs } from "@/components/home/models-tabs"
import { adjustToneAndCreativityData, audiences, contentTypes, ctas, modelTabs, socialPlatforms, subjects } from "@/config/form-data"
import { Hero } from "@/components/home/hero"
import React, { useState, useEffect, useRef } from "react"
import { RadioCard } from "@/components/home/radio-card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { PdfFileDropzone } from "@/components/home/PdfFileDropzone"
import { getNewGenerationPrompts } from "@/lib/ai/prompts"
import { knowledgeBaseContent } from "@/lib/ai/knowledge_base"
import { generateNewContent } from "@/actions/generate-new-content"

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<number>(modelTabs[0].id)
  const [selectedAudiences, setSelectedAudiences] = useState<number[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<number | null>(null)
  const [selectedContentTypes, setSelectedContentTypes] = useState<number[]>([])
  const [selectedCtas, setSelectedCtas] = useState<number[]>([])
  const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<number | null>(null)
  const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([]);
  const [referenceMaterial, setReferenceMaterial] = useState<string>()
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [contextualAwareness, setContextualAwareness] = useState("");
  const [toneValue, setToneValue] = useState<number>(adjustToneAndCreativityData.tone.defaultValue);
  const [creativityValue, setCreativityValue] = useState<number>(adjustToneAndCreativityData.creativity.defaultValue);
  const [generatingContent, setgeneratingContent] = useState(false);
  const [contentGenerated, setcontentGenerated] = useState(false);

  const socialPostContentTypeId = contentTypes.find(
    (type) => type.label === "Social Media Post"
  )?.id

  const isSocialPostSelected =
    socialPostContentTypeId !== undefined &&
    selectedContentTypes.includes(socialPostContentTypeId)

  useEffect(() => {
    if (!isSocialPostSelected) {
      setSelectedSocialPlatform(null)
    }
  }, [isSocialPostSelected])

  const handleGenerate = async () => {
    setgeneratingContent(true)
    const selectedModelObj = modelTabs.find((tab) => tab.id === selectedModel)

    const selectedAudienceLabels = audiences
      .filter((audience: any) => selectedAudiences.includes(audience.id))
      .map((audience: any) => audience.label)

    const selectedSubjectObj = subjects.find((subject) => subject.id === selectedSubjects)

    const selectedContentTypeLabels = contentTypes
      .filter((contentType) => selectedContentTypes.includes(contentType.id))
      .map((contentType) => contentType.label)

    const selectedCtaLabels = ctas
      .filter((cta) => selectedCtas.includes(cta.id))
      .map((cta) => cta.label)

    const selectedSocialPlatformObj = socialPlatforms.find(
      (platform) => platform.id === selectedSocialPlatform
    )

    const promptdata = {
      selectedAudiences: selectedAudienceLabels,
      selectedSubject: selectedSubjectObj?.label || "",
      selectedContentTypes: selectedContentTypeLabels,
      selectedCtas: selectedCtaLabels,
      selectedSocialPlatform: selectedSocialPlatformObj?.label || "",
      userUploadedContent: referenceMaterial || '',
      additionalInstructions: additionalInstructions || '',
      contextualAwareness: contextualAwareness || '',
      knowledgeBaseContent: knowledgeBaseContent,
      selectedtone: toneValue,
    }


    const { systemPrompt, userPrompt } = getNewGenerationPrompts(promptdata);


    const generatedata = {
      modelAlias: selectedModelObj?.label,
      temperature: creativityValue,
      systemPrompt,
      userPrompt
    }

    const contentGenerated = await generateNewContent(generatedata)
    setcontentGenerated(contentGenerated.generatedText);
    setgeneratingContent(false)



    console.log(contentGenerated, 'contentGenerated');
  }

  const handleSaveDraft = () => {
    console.log("Draft saved!")
  }



  return (
    <main className="overflow-hidden">
      <Hero />
      <section className="div-center-md">
        <FormSection title="HBAI Models">
          <ModelsTabs
            options={modelTabs}
            selectedValue={selectedModel}
            onValueChange={setSelectedModel}
          />
        </FormSection>

        <FormSection title="Audience(s)">
          <CheckboxCard
            options={audiences}
            selectedValues={selectedAudiences}
            onSelectionChange={setSelectedAudiences}
          />
        </FormSection>

        <FormSection title="Subject focus">
          <RadioCard
            options={subjects}
            selectedValue={selectedSubjects}
            onSelectionChange={setSelectedSubjects}
          />
        </FormSection>

        <FormSection title="Content Type(s)">
          <CheckboxCard
            options={contentTypes}
            selectedValues={selectedContentTypes}
            onSelectionChange={setSelectedContentTypes}
          />
        </FormSection>

        {isSocialPostSelected && (
          <FormSection title="Social Platform">
            <RadioCard
              options={socialPlatforms}
              selectedValue={selectedSocialPlatform}
              onSelectionChange={setSelectedSocialPlatform}
            />
          </FormSection>
        )}

        <FormSection title="Call to Action(s)">
          <CheckboxCard
            options={ctas}
            selectedValues={selectedCtas}
            onSelectionChange={setSelectedCtas}
          />
        </FormSection>


        <FormSection title="Reference Materials (optional)">
          <PdfFileDropzone
            files={uploadedPdfs}
            setFiles={setUploadedPdfs}
            setReferenceMaterial={setReferenceMaterial}
            maxFiles={1}
          />
        </FormSection>

        <FormSection title="Additional Instructions (optional)">
          <Textarea
            placeholder="Enter any specific requirements or instructions..."
            rows={14}
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
          />
        </FormSection>

        <FormSection title="Contextual Awareness (optional)">
          <Textarea
            placeholder="Provide relevant background information or context..."
            rows={49}
            value={contextualAwareness}
            onChange={(e) => setContextualAwareness(e.target.value)}
          />
        </FormSection>

        <FormSection title="Adjust Tone and Creativity">
          <div className="space-y-8 mt-3">
            {Object.entries(adjustToneAndCreativityData).map(([key, setting]) => (
              <div key={key}>
                <Label className="text-base font-medium">{setting.label}</Label>
                <Slider
                  value={key === "tone" ? [toneValue] : [creativityValue]}
                  onValueChange={(value) => {
                    if (key === "tone") {
                      setToneValue(value[0]);
                    } else {
                      setCreativityValue(value[0]);
                    }
                  }}
                  min={setting.minValue}
                  max={setting.maxValue}
                  step={0.1}
                  className="my-4"
                />

                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  {setting.options.map((option, index) => (
                    <span key={index}>{option}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FormSection>

        <Generate generatingContent={generatingContent} onSaveDraft={handleSaveDraft} onGenerate={handleGenerate} />

        {contentGenerated}


      </section>






    </main>
  )
}