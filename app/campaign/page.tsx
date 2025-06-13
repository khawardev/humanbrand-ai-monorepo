'use client'

import { CheckboxCard } from "@/components/home/checkbox-card"
import { FormSection } from "@/components/home/form-section"
import { Generate } from "@/components/home/generate"
import { ModelsTabs } from "@/components/home/models-tabs"
import { adjustToneAndCreativityData, audiences, campaignElementsData, campaignTypes, contentTypes, ctas, modelTabs, socialPlatforms, subjects } from "@/config/form-data"
import { Hero } from "@/components/home/hero"
import React, { useState, useEffect, useRef } from "react"
import { RadioCard } from "@/components/home/radio-card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { PdfFileDropzone } from "@/components/home/PdfFileDropzone"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function Home() {
    const [selectedModel, setSelectedModel] = useState<number>(modelTabs[0].id)
    const [selectedAudiences, setSelectedAudiences] = useState<number[]>([])
    const [selectedSubjects, setSelectedSubjects] = useState<number | null>(null)
    const [selectedCampaignType, setSelectedCampaignType] = useState<number | null>(null)
    const [selectedContentTypes, setSelectedContentTypes] = useState<number[]>([])
    const [selectedCtas, setSelectedCtas] = useState<number[]>([])
    const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<number | null>(null)
    const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([]);

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

    const formRef = useRef<HTMLDivElement>(null);

    const handleScrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    return (
        <main className="overflow-hidden">
            <Hero onExploreClick={handleScrollToForm} />
            <section className="div-center-md">
                <div id="form-start" ref={formRef}>
                    <FormSection title="HBAI Models">
                        <ModelsTabs
                            options={modelTabs}
                            selectedValue={selectedModel}
                            onValueChange={setSelectedModel}
                        />
                    </FormSection>
                </div>

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
                <FormSection title="Campaign Type(s)">
                    <RadioCard
                        options={campaignTypes}
                        selectedValue={selectedCampaignType}
                        onSelectionChange={setSelectedCampaignType}
                    />
                </FormSection>

                <FormSection title="Campaign Elements">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {campaignElementsData.map((typeId: any) => {
                            return (
                                <Card key={typeId}>
                                    <CardHeader>
                                        <CardTitle>{typeId.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                            {typeId.elements.map((item: any, index: any) => (
                                                <li key={index} className={cn(item.startsWith("  ") && "pl-4")}>
                                                    {item.trim()}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </FormSection>
              

                <FormSection title="Reference Materials (optional)">
                    <PdfFileDropzone
                        files={uploadedPdfs}
                        setFiles={setUploadedPdfs}
                        maxFiles={5}
                    />
                </FormSection>

                <FormSection title="Additional Instructions (optional)">
                    <Textarea placeholder="Enter any specific requirements or instructions..." rows={14} />
                </FormSection>

                <FormSection title="Contextual Awareness (optional)">
                    <Textarea placeholder="Provide relevant background information or context..." rows={49} />
                </FormSection>

                <FormSection title="Adjust Tone and Creativity">
                    <div className="space-y-8 mt-3">
                        {Object.entries(adjustToneAndCreativityData).map(([key, setting]) => (
                            <div key={key}>
                                <Label className="text-base font-medium">{setting.label}</Label>
                                <Slider defaultValue={[setting.defaultValue]} className="my-4" />
                                <div className="flex justify-between text-xs text-muted-foreground px-1">
                                    {setting.options.map((option, index) => (
                                        <span key={index}>{option}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </FormSection>

                <Generate onSaveDraft={handleSaveDraft} onGenerate={handleGenerate} />
            </section>
        </main>
    )
}