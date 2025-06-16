import { FormSection } from "@/components/home/form-section"
import { ModelsTabs } from "@/components/home/models-tabs"
import { modelTabs } from "@/config/form-data"

interface ModelsSectionProps {
    selectedValue: number;
    onValueChange: (value: number) => void;
    title:string
}

export function ModelsSection({ selectedValue, onValueChange, title }: ModelsSectionProps) {
    return (
        <FormSection title={title}>
            <ModelsTabs options={modelTabs} selectedValue={selectedValue} onValueChange={onValueChange} />
        </FormSection>
    )
}