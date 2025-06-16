import { FormSection } from "@/components/home/form-section"
import { Textarea } from "@/components/ui/textarea"

interface ExistingContentSectionProps {
    value: string;
    onChange: (value: string) => void;
    title: string
}

export function ExistingContentSection({ value, onChange, title }: ExistingContentSectionProps) {
    return (
        <FormSection title={title} req={true}>
            <Textarea placeholder="Paste or write your existing content here..." rows={20} value={value} onChange={(e) => onChange(e.target.value)} />
        </FormSection>
    )
}