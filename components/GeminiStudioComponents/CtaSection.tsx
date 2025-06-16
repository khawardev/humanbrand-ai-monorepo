import { FormSection } from "@/components/home/form-section"
import { CheckboxCard } from "@/components/home/checkbox-card"
import { ctas } from "@/config/form-data"

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