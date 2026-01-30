import { FormSection } from "@/components/shared/reusable/FormSection"
import { ModelsTabs } from "@/components/shared/reusable/ModelsTabs"
import { modelTabs } from "@/config/formData"

interface ModelsSectionProps {
    selectedValue: number;
    onValueChange: (value: number) => void;
    title: string
}

export function ModelsSection({ selectedValue, onValueChange, title }: ModelsSectionProps) {
    return (
        <FormSection title={title}>
            <ModelsTabs options={modelTabs} selectedValue={selectedValue} onValueChange={onValueChange} />
        </FormSection>
    )
}