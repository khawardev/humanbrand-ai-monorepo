'use client'

import { CheckboxCard } from "@/components/aiag-components/reusable-components/checkbox-card"
import { FormSection } from "@/components/aiag-components/reusable-components/form-section"
import { ModelsTabs } from "@/components/aiag-components/reusable-components/models-tabs"
import { campaignContent, campaignElementsData, campaignTypes, audiences, subjects, contentTypes, ctas, modelTabs, socialPlatforms, campaignSocialPlatforms } from "@/config/form-data"
import { Hero } from "@/components/aiag-components/reusable-components/hero"
import React, { useState, useEffect, useRef } from "react"
import { RadioCard } from "@/components/aiag-components/reusable-components/radio-card"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SocialPlatformSection } from "@/components/aiag-components/selection-components/SocialPlatformSection"
import AdminMailAlert from "@/components/aiag-components/admin-mail-alert"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { MdOutlineMailLock } from "react-icons/md"
import { VscDebugConsole } from "react-icons/vsc";

export default function Home() {
    const [selectedModel, setSelectedModel] = useState<number>(modelTabs[0].id)
    const [selectedAudiences, setSelectedAudiences] = useState<number[]>([])
    const [selectedSubjects, setSelectedSubjects] = useState<number | null>(null)
    const [selectedCampaignType, setSelectedCampaignType] = useState<number | null>(null)
    const [selectedCampaignContent, setSelectedCampaignContent] = useState<number | null>(null)
    const [selectedCampaignSocial, setSelectedCampaignSocial] = useState<number | null>(null)
    const [selectedContentTypes, setSelectedContentTypes] = useState<number[]>([])
    const [selectedCtas, setSelectedCtas] = useState<number[]>([])
    const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<number | null>(null)
    const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([]);
    const [generatingContent, setgeneratingContent] = useState(false);
    const [referenceMaterial, setReferenceMaterial] = useState<string>()

    const socialPostContentTypeId = campaignContent.find(
        (type) => type.label === "Social Media Posts"
    )?.id

    const isSocialPostSelected = selectedCampaignContent === socialPostContentTypeId;

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
            <div className="div-center-md" >
                <Alert variant={'destructive'}>
                    <VscDebugConsole />
                    <AlertTitle>Campaign Page is Under Development</AlertTitle>
                </Alert>
            </div>
            <Hero />
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
                <FormSection title="Campaign Type(s)">
                    <RadioCard
                        options={campaignTypes}
                        selectedValue={selectedCampaignType}
                        onSelectionChange={setSelectedCampaignType}
                    />
                </FormSection>
                <FormSection title="Campaign Content">
                    <RadioCard
                        options={campaignContent}
                        selectedValue={selectedCampaignContent}
                        onSelectionChange={setSelectedCampaignContent}
                    />
                </FormSection>
                {isSocialPostSelected && (
                    <FormSection title="Social Platforms">
                        <RadioCard
                            options={campaignSocialPlatforms}
                            selectedValue={selectedCampaignSocial}
                            onSelectionChange={setSelectedCampaignSocial}
                        />
                    </FormSection>
                )}
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


                <FormSection title="Campaign Elements">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {campaignElementsData.map((typeId: any) => {
                            return (
                                <Card key={typeId.title}>
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



                <FormSection title="Additional Instructions (optional)">
                    <Textarea placeholder="Enter any specific requirements or instructions..." rows={14} />
                </FormSection>

                <FormSection title="Contextual Awareness (optional)">
                    <Textarea placeholder="Provide relevant background information or context..." rows={49} />
                </FormSection>

            </section>
        </main>
    )
}