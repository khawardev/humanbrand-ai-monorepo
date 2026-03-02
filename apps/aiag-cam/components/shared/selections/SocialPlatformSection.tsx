import { FormSection } from "@/components/shared/reusable/FormSection"
import { RadioCard } from "@/components/shared/reusable/RadioCard"
import { socialPlatforms } from "@/config/formData"

interface SocialPlatformSectionProps {
    selectedValue: number | null;
    title: string
    onSelectionChange: (value: number | null) => void;
}

export function SocialPlatformSection({ selectedValue, onSelectionChange, title }: SocialPlatformSectionProps) {
    return (
        <FormSection title={title} req={true}>
            <RadioCard options={socialPlatforms} selectedValue={selectedValue} onSelectionChange={onSelectionChange} />
        </FormSection>
    )
}