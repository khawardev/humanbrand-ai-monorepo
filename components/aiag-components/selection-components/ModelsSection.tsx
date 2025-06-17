import { FormSection } from "@/components/aiag-components/reusable-components/form-section"
import { ModelsTabs } from "@/components/aiag-components/reusable-components/models-tabs"
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