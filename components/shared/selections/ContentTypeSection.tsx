import { FormSection } from "@/components/shared/reusable/FormSection"
import { CheckboxCard } from "@/components/shared/reusable/CheckboxCard"
import { contentTypes } from "@/config/formData"

interface ContentTypeSectionProps {
    selectedValues: number[];
    title: string
    onSelectionChange: (values: number[]) => void;
}

export function ContentTypeSection({ selectedValues, onSelectionChange, title }: ContentTypeSectionProps) {
    return (
        <FormSection title={title} req={true}>
            <CheckboxCard options={contentTypes} selectedValues={selectedValues} onSelectionChange={onSelectionChange} />
        </FormSection>
    )
}