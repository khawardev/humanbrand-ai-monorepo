'use client'
import { useId } from "react"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type Option = {
    id: number;
    label: string;
    Icon: React.ElementType;
}

type RadioCardGroupProps = {
    options: Option[];
    selectedValue: number | null;
    onSelectionChange: (newValue: number | null) => void;
    className?: string;
}

export const RadioCard = ({ options, selectedValue, onSelectionChange, className }: RadioCardGroupProps) => {
    const idPrefix = useId()

    const handleCardClick = (clickedId: number) => {
        if (clickedId === selectedValue) {
            onSelectionChange(null);
        } else {
            onSelectionChange(clickedId);
        }
    };

    return (
        <RadioGroup
            value={selectedValue?.toString() ?? ""}
            onValueChange={(value) => onSelectionChange(value ? parseInt(value, 10) : null)}
            className={cn("grid md:grid-cols-7 sm:grid-cols-4 grid-cols-2 gap-3", className)}
        >
            {options.map((item: Option) => {
                const elementId = `${idPrefix}-${item.id}`;
                const isSelected = item.id === selectedValue;
                const hasSelection = selectedValue !== null;

                return (
                    <div
                        key={item.id}
                        onClick={() => handleCardClick(item.id)}
                        className={cn(
                            "border-input has-data-[state=checked]:bg-primary/15 has-data-[state=checked]:border-primary/50 relative flex cursor-pointer flex-col gap-4 rounded-lg border p-4 shadow-xs outline-none transition-opacity",
                            hasSelection && !isSelected ? "opacity-40" : "opacity-100"
                        )}
                    >
                        <div className="flex justify-between gap-2">
                            <RadioGroupItem
                                id={elementId}
                                value={item.id.toString()}
                                className="order-1 after:absolute after:inset-0"
                            />
                            <item.Icon className="opacity-60" size={16} aria-hidden="true" />
                        </div>
                        <Label htmlFor={elementId}>{item.label}</Label>
                    </div>
                );
            })}
        </RadioGroup>
    )
}