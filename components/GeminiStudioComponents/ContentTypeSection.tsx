import { FormSection } from "@/components/home/form-section"
import { CheckboxCard } from "@/components/home/checkbox-card"
import { contentTypes } from "@/config/form-data"

interface ContentTypeSectionProps {
    selectedValues: number[];
    title:string
    onSelectionChange: (values: number[]) => void;
}

export function ContentTypeSection({ selectedValues, onSelectionChange,title }: ContentTypeSectionProps) {
    return (
        <FormSection title={title} req={true}>
            <CheckboxCard options={contentTypes} selectedValues={selectedValues} onSelectionChange={onSelectionChange} />
        </FormSection>
    )
}