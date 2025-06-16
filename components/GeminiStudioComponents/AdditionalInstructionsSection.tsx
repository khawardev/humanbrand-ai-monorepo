import { FormSection } from "@/components/home/form-section"
import { Textarea } from "@/components/ui/textarea"

interface AdditionalInstructionsSectionProps {
    value: string;
    onChange: (value: string) => void;
    title: string;
}

export function AdditionalInstructionsSection({ value, onChange, title }: AdditionalInstructionsSectionProps) {
    return (
        <FormSection title={title}>
            <Textarea placeholder="Enter any specific requirements or instructions..." rows={14} value={value} onChange={(e) => onChange(e.target.value)} />
        </FormSection>
    )
}