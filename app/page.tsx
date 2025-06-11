'use client'

import { CheckboxCard } from "@/components/home/checkbox-card"
import { FormSection } from "@/components/home/form-section"
import { Generate } from "@/components/home/generate"
import { ModelsTabs } from "@/components/home/models-tabs"
import { audiences, contentTypes, ctas, modelTabs, socialPlatforms, subjects } from "@/config/form-data"
import { Hero } from "@/components/home/hero"
import { useState, useEffect } from "react"
import { RadioCard } from "@/components/home/radio-card"

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<number>(modelTabs[0].id)
  const [selectedAudiences, setSelectedAudiences] = useState<number[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<number | null>(null)
  const [selectedContentTypes, setSelectedContentTypes] = useState<number[]>([])
  const [selectedCtas, setSelectedCtas] = useState<number[]>([])
  const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<number | null>(null)

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


  const handleGenerate = () => {
    const selectedModelObj = modelTabs.find((tab) => tab.id === selectedModel)

    const selectedAudienceLabels = audiences
      .filter((audience) => selectedAudiences.includes(audience.id))
      .map((audience) => audience.label)

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

    const data = {
      selectedModel: selectedModelObj?.label || "",
      selectedAudiences: selectedAudienceLabels,
      selectedSubject: selectedSubjectObj?.label || "",
      selectedContentTypes: selectedContentTypeLabels,
      selectedCtas: selectedCtaLabels,
      selectedSocialPlatform: selectedSocialPlatformObj?.label || "",
    }

    console.log(data)
  }

  const handleSaveDraft = () => {
    console.log("Draft saved!")
  }

  return (
    <main className="overflow-hidden">
      <Hero />
      <section id="form-start" className="md:px-12 px-4 space-y-10 md:py-22 py-10">
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

        <Generate onSaveDraft={handleSaveDraft} onGenerate={handleGenerate} />
      </section>
    </main>
  )
}