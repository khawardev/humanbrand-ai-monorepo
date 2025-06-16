import { FormSection } from "@/components/home/form-section"
import { ModelsTabs } from "@/components/home/models-tabs"
import { CheckboxCard } from "@/components/home/checkbox-card"
import { RadioCard } from "@/components/home/radio-card"
import { PdfFileDropzone } from "@/components/home/PdfFileDropzone"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { modelTabs, audiences, subjects, contentTypes, socialPlatforms, ctas, adjustToneAndCreativityData } from "@/config/form-data"

interface FormContainerProps {
    selectedModel: number;
    setSelectedModel: (value: number) => void;
    selectedAudiences: number[];
    setSelectedAudiences: (values: number[]) => void;
    selectedSubjects: number | null;
    setSelectedSubjects: (value: number | null) => void;
    selectedContentTypes: number[];
    setSelectedContentTypes: (values: number[]) => void;
    isSocialPostSelected: boolean;
    selectedSocialPlatform: number | null;
    setSelectedSocialPlatform: (value: number | null) => void;
    selectedCtas: number[];
    setSelectedCtas: (values: number[]) => void;
    uploadedPdfs: File[];
    setUploadedPdfs: (files: File[]) => void;
    setReferenceMaterial: (material: string | undefined) => void;
    additionalInstructions: string;
    setAdditionalInstructions: (value: string) => void;
    contextualAwareness: string;
    setContextualAwareness: (value: string) => void;
    toneValue: number;
    setToneValue: (value: number) => void;
    creativityValue: number;
    setCreativityValue: (value: number) => void;
}

export function FormContainer({
    selectedModel, setSelectedModel,
    selectedAudiences, setSelectedAudiences,
    selectedSubjects, setSelectedSubjects,
    selectedContentTypes, setSelectedContentTypes,
    isSocialPostSelected, selectedSocialPlatform, setSelectedSocialPlatform,
    selectedCtas, setSelectedCtas,
    uploadedPdfs, setUploadedPdfs, setReferenceMaterial,
    additionalInstructions, setAdditionalInstructions,
    contextualAwareness, setContextualAwareness,
    toneValue, setToneValue,
    creativityValue, setCreativityValue
}: FormContainerProps) {
    return (
        <>
            <FormSection title="HBAI Models" >
                <ModelsTabs options={modelTabs} selectedValue={selectedModel} onValueChange={setSelectedModel} />
            </FormSection>

            <FormSection title="Audience(s)" req={true}>
                <CheckboxCard options={audiences} selectedValues={selectedAudiences} onSelectionChange={setSelectedAudiences} />
            </FormSection>

            <FormSection title="Subject focus" req={true}>
                <RadioCard options={subjects} selectedValue={selectedSubjects} onSelectionChange={setSelectedSubjects} />
            </FormSection>

            <FormSection title="Content Type(s)" req={true}>
                <CheckboxCard options={contentTypes} selectedValues={selectedContentTypes} onSelectionChange={setSelectedContentTypes} />
            </FormSection>

            {isSocialPostSelected && (
                <FormSection title="Social Platform" req={true}>
                    <RadioCard options={socialPlatforms} selectedValue={selectedSocialPlatform} onSelectionChange={setSelectedSocialPlatform} />
                </FormSection>
            )}

            <FormSection title="Call to Action(s)" req={true}>
                <CheckboxCard options={ctas} selectedValues={selectedCtas} onSelectionChange={setSelectedCtas} />
            </FormSection>

            <FormSection title="Reference Materials (optional)">
                <PdfFileDropzone files={uploadedPdfs} setFiles={setUploadedPdfs} setReferenceMaterial={setReferenceMaterial} maxFiles={1} />
            </FormSection>

            <FormSection title="Additional Instructions (optional)">
                <Textarea placeholder="Enter any specific requirements or instructions..." rows={14} value={additionalInstructions} onChange={(e) => setAdditionalInstructions(e.target.value)} />
            </FormSection>

            <FormSection title="Contextual Awareness (optional)">
                <Textarea placeholder="Provide relevant background information or context..." rows={49} value={contextualAwareness} onChange={(e) => setContextualAwareness(e.target.value)} />
            </FormSection>

            <FormSection title="Adjust Tone and Creativity">
                <div className="space-y-8 mt-3">
                    {Object.entries(adjustToneAndCreativityData).map(([key, setting]) => (
                        <div key={key}>
                            <Label className="text-base font-medium">{setting.label}</Label>
                            <Slider
                                value={key === "tone" ? [toneValue] : [creativityValue]}
                                onValueChange={(value) => key === "tone" ? setToneValue(value[0]) : setCreativityValue(value[0])}
                                min={setting.minValue}
                                max={setting.maxValue}
                                step={0.1}
                                className="my-4"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground px-1">
                                {setting.options.map((option, index) => <span key={index}>{option}</span>)}
                            </div>
                        </div>
                    ))}
                </div>
            </FormSection>
        </>
    )
}