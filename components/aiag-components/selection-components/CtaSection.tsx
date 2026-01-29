import { FormSection } from "@/components/aiag-components/reusable-components/form-section"
import { CheckboxCard } from "@/components/aiag-components/reusable-components/checkbox-card"
import { ctas } from "@/config/formData"

interface CtaSectionProps {
    selectedValues: number[];
    title:string
    onSelectionChange: (values: number[]) => void;
}

export function CtaSection({ selectedValues, onSelectionChange,title }: CtaSectionProps) {
    return (
        <FormSection title={title} req={true}>
            <CheckboxCard options={ctas} selectedValues={selectedValues} onSelectionChange={onSelectionChange} />
        </FormSection>
    )
}