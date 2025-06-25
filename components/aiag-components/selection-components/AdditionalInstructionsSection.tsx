import { FormSection } from "@/components/aiag-components/reusable-components/form-section"
import { Input } from "../../ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AdditionalInstructionsSectionProps {
    value: string;
    onChange: (value: string) => void;
    title: string;
}

export function AdditionalInstructionsSection({ value, onChange, title }: AdditionalInstructionsSectionProps) {
    return (
        <FormSection title={title}>
            <Textarea rows={30} placeholder="Enter any specific instructions..." value={value} onChange={(e) => onChange(e.target.value)} />
        </FormSection>
    )
}