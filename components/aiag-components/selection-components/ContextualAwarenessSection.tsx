import { FormSection } from "@/components/aiag-components/reusable-components/form-section"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "../../ui/input";

interface ContextualAwarenessSectionProps {
    value: string;
    onChange: (value: string) => void;
    title:string
}

export function ContextualAwarenessSection({ value, onChange, title }: ContextualAwarenessSectionProps) {
    return (
        <FormSection title={title}>
            <Input placeholder="Provide relevant background context..." value={value} onChange={(e) => onChange(e.target.value)} />
        </FormSection>
    )
}