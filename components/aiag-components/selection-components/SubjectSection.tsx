import { FormSection } from "@/components/aiag-components/reusable-components/form-section"
import { RadioCard } from "@/components/aiag-components/reusable-components/radio-card"
import { subjects } from "@/config/formData"

interface SubjectSectionProps {
    selectedValue: number | null;
    title:string
    onSelectionChange: (value: number | null) => void;
}

export function SubjectSection({ selectedValue, onSelectionChange,title }: SubjectSectionProps) {
    return (
        <FormSection title={title} req={true}>
            <RadioCard options={subjects} selectedValue={selectedValue} onSelectionChange={onSelectionChange} />
        </FormSection>
    )
}