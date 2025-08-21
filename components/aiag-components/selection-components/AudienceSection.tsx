import { FormSection } from "@/components/aiag-components/reusable-components/form-section"
import { CheckboxCard } from "@/components/aiag-components/reusable-components/checkbox-card"
import { audiences } from "@/config/form-data"

interface AudienceSectionProps {
    selectedValues: number[];
    onSelectionChange: (values: number[]) => void;
    title: string
}

export function AudienceSection({ selectedValues, onSelectionChange,title }: AudienceSectionProps) {
    return (
        <FormSection title={title} req={true}>
            <CheckboxCard options={audiences} selectedValues={selectedValues} onSelectionChange={onSelectionChange} />
        </FormSection>
    )
}