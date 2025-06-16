import { FormSection } from "@/components/home/form-section"
import { Textarea } from "@/components/ui/textarea"

interface ContextualAwarenessSectionProps {
    value: string;
    onChange: (value: string) => void;
    title:string
}

export function ContextualAwarenessSection({ value, onChange, title }: ContextualAwarenessSectionProps) {
    return (
        <FormSection title={title}>
            <Textarea placeholder="Provide relevant background information or context..." rows={49} value={value} onChange={(e) => onChange(e.target.value)} />
        </FormSection>
    )
}