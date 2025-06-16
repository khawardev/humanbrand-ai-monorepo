import { FormSection } from "@/components/home/form-section"
import { RadioCard } from "@/components/home/radio-card"
import { subjects } from "@/config/form-data"

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