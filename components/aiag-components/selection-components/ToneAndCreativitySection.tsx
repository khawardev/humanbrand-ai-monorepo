import { FormSection } from "@/components/aiag-components/reusable-components/form-section"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { adjustToneAndCreativityData } from "@/config/formData"

interface ToneAndCreativitySectionProps {
    toneValue: number;
    setToneValue: (value: number) => void;
    creativityValue: number;
    setCreativityValue: (value: number) => void;
    title:string
}

export function ToneAndCreativitySection({ toneValue, setToneValue, creativityValue, setCreativityValue, title }: ToneAndCreativitySectionProps) {
    const settings = [
        { key: 'tone', label: 'Tone', value: toneValue, setter: setToneValue, data: adjustToneAndCreativityData.tone },
        { key: 'creativity', label: 'Creativity', value: creativityValue, setter: setCreativityValue, data: adjustToneAndCreativityData.creativity }
    ];

    return (
        <FormSection title={title}>
            <div className="space-y-8 mt-3">
                {settings.map(setting => (
                    <div key={setting.key}>
                        <Label className="text-base font-medium">{setting.data.label}</Label>
                        <Slider
                            value={[setting.value]}
                            onValueChange={(value) => setting.setter(value[0])}
                            min={setting.data.minValue}
                            max={setting.data.maxValue}
                            step={0.1}
                            className="my-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground px-1">
                            {setting.data.options.map((option, index) => <span key={index}>{option}</span>)}
                        </div>
                    </div>
                ))}
            </div>
        </FormSection>
    )
}