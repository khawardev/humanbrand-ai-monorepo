'use client'
import { useId } from "react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type Option = {
    id: number;
    label: string;
    Icon: React.ElementType;
}

type CheckboxCardGroupProps = {
    options: Option[];
    selectedValues: number[];
    onSelectionChange: (newSelection: number[]) => void;
}

export const CheckboxCard = ({ options, selectedValues, onSelectionChange }: CheckboxCardGroupProps) => {
    const id = useId()

    const handleCheckedChange = (checked: boolean, itemId: number) => {
        onSelectionChange(
            checked
                ? [...selectedValues, itemId]
                : selectedValues.filter((val) => val !== itemId)
        )
    }

    return (
        <div className="grid md:grid-cols-7 sm:grid-cols-4 grid-cols-2 gap-3">
            {options.map((item: Option) => {
                const isChecked = selectedValues.includes(item.id)
                const dimOthers = selectedValues.length > 0 && !isChecked

                return (
                    <div
                        key={`${id}-${item.id}`}
                        className={cn(
                            "border-input has-data-[state=checked]:bg-primary/15 has-data-[state=checked]:border-primary/50 relative flex cursor-pointer flex-col gap-4 rounded-lg border p-4 shadow-xs outline-none transition-opacity",
                            dimOthers ? "opacity-40" : "opacity-100"
                        )}
                    >
                        <div className="flex justify-between gap-2">
                            <Checkbox
                                id={`${id}-${item.id}`}
                                className="order-1 after:absolute after:inset-0"
                                checked={isChecked}
                                onCheckedChange={(checked: boolean) => {
                                    handleCheckedChange(checked, item.id)
                                }}
                            />
                            <item.Icon className="opacity-60" size={16} aria-hidden="true" />
                        </div>
                        <Label htmlFor={`${id}-${item.id}`}>{item.label}</Label>
                    </div>
                )
            })}
        </div>
    )
}