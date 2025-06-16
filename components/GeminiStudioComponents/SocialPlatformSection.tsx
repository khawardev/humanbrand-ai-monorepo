import { FormSection } from "@/components/home/form-section"
import { RadioCard } from "@/components/home/radio-card"
import { socialPlatforms } from "@/config/form-data"

interface SocialPlatformSectionProps {
    selectedValue: number | null;
    title:string
    onSelectionChange: (value: number | null) => void;
}

export function SocialPlatformSection({ selectedValue, onSelectionChange,title }: SocialPlatformSectionProps) {
    return (
        <FormSection title={title} req={true}>
            <RadioCard options={socialPlatforms} selectedValue={selectedValue} onSelectionChange={onSelectionChange} />
        </FormSection>
    )
}