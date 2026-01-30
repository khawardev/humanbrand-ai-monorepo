import { FormSection } from "@/components/shared/reusable/FormSection"
import { Textarea } from "@/components/ui/textarea"

interface AdditionalInstructionsSectionProps {
    value: string;
    onChange: (value: string) => void;
    title: string;
}

export function AdditionalInstructionsSection({ value, onChange, title }: AdditionalInstructionsSectionProps) {
    return (
        <FormSection title={title}>
            <Textarea placeholder="Enter any specific instructions..." value={value} onChange={(e) => onChange(e.target.value)} />
        </FormSection>
    )
}