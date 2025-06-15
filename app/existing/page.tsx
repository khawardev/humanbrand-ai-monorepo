'use client'

import { FormSection } from "@/components/home/form-section"
import { adjustToneAndCreativityData, modelTabs } from "@/config/form-data"
import React, { useRef, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Hero } from "@/components/home/hero"
import { ModelsTabs } from "@/components/home/models-tabs"
import { Generate } from "@/components/home/generate"
import { PdfFileDropzone } from "@/components/home/PdfFileDropzone"

const page = () => {
    const [selectedModel, setSelectedModel] = useState<number>(modelTabs[0].id)
    const [uploadedPdfs, setUploadedPdfs] = useState<File[]>([]);
    const [referenceMaterial, setReferenceMaterial] = useState<string>()
    const [generatingContent, setgeneratingContent] = useState(false);

    const handleGenerate = () => {
        const selectedModelObj = modelTabs.find((tab) => tab.id === selectedModel)

        const data = {
            selectedModel: selectedModelObj?.label || "",
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
            <Hero />

            <div className="div-center-md">
                <div id="form-start" ref={formRef}>
                    <FormSection title="HBAI Models">
                        <ModelsTabs
                            options={modelTabs}
                            selectedValue={selectedModel}
                            onValueChange={setSelectedModel}
                        />
                    </FormSection>
                </div>

               
                <FormSection title="Existing Content">
                    <PdfFileDropzone
                        files={uploadedPdfs}
                        setFiles={setUploadedPdfs}
                        setReferenceMaterial={setReferenceMaterial}
                        maxFiles={1}
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
                <Generate generatingContent={generatingContent} onSaveDraft={handleSaveDraft} onGenerate={handleGenerate} />
            </div>
        </main>

    )
}

export default page