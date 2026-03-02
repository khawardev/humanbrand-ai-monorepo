import { FormSection } from "@/components/shared/reusable/FormSection"
import { CheckboxCard } from "@/components/shared/reusable/CheckboxCard"
import { audiences } from "@/config/formData"

interface AudienceSectionProps {
    selectedValues: number[];
    onSelectionChange: (values: number[]) => void;
    title: string
}

export function AudienceSection({ selectedValues, onSelectionChange, title }: AudienceSectionProps) {
    return (
        <FormSection title={title} req={true}>
            <CheckboxCard options={audiences} selectedValues={selectedValues} onSelectionChange={onSelectionChange} />
        </FormSection>
    )
}