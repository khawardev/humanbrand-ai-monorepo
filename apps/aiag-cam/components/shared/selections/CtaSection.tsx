import { FormSection } from "@/components/shared/reusable/FormSection"
import { CheckboxCard } from "@/components/shared/reusable/CheckboxCard"
import { ctas } from "@/config/formData"

interface CtaSectionProps {
    selectedValues: number[];
    title: string
    onSelectionChange: (values: number[]) => void;
}

export function CtaSection({ selectedValues, onSelectionChange, title }: CtaSectionProps) {
    return (
        <FormSection title={title} req={true}>
            <CheckboxCard options={ctas} selectedValues={selectedValues} onSelectionChange={onSelectionChange} />
        </FormSection>
    )
}