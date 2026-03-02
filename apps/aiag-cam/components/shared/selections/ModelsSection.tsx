import { FormSection } from "@/components/shared/reusable/FormSection"
import { modelTabs } from "@/config/formData"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Check } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { cn } from "@/lib/utils"
import { PromptInputAction } from "@/components/ui/prompt-input"

// import { AnimatePresence, motion } from "framer-motion"

interface ModelsSectionProps {
    selectedValue: number;
    onValueChange: (value: number) => void;
    title?: string;
    variant?: 'default' | 'minimal';
    tooltip?: string;
}

export function ModelsSection({ selectedValue, onValueChange, title, variant = 'default', tooltip }: ModelsSectionProps) {
    const selectedModel = modelTabs.find((tab) => tab.id === selectedValue)
    const isMinimal = variant === 'minimal'

    const MinimalTrigger = (
        <Button 
            size="sm"
            variant="ghost" 
            className="rounded-full"
            effect="change"
            contentKey={selectedModel?.id || 'select'}
        >
             <span>{selectedModel?.title || "Select Model"}</span>
             <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
    )

    const DefaultTrigger = (
        <Button 
            className="w-fit h-auto py-3"
            variant={'outline'}
        >
            {selectedModel ? (
                <div className="flex flex-col items-start text-left gap-1 mr-2">
                    <span className="font-medium text-sm">{selectedModel.title}</span>
                    {selectedModel.tooltip && (
                        <span className="text-xs font-normal">
                            {selectedModel.tooltip}
                        </span>
                    )}
                </div>
            ) : (
                <span className="mr-2">Select a model</span>
            )}
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
    )

    const dropdownContent = (
        <DropdownMenu>
            {isMinimal && tooltip ? (
                <PromptInputAction tooltip={tooltip}>
                    <DropdownMenuTrigger asChild>
                        {MinimalTrigger}
                    </DropdownMenuTrigger>
                </PromptInputAction>
            ) : (
                <DropdownMenuTrigger asChild>
                    {isMinimal ? MinimalTrigger : DefaultTrigger}
                </DropdownMenuTrigger>
            )}
            
            <DropdownMenuContent align="start">
                {modelTabs.map((tab) => (
                    <Tooltip key={tab.id} delayDuration={300}>
                        <TooltipTrigger asChild>
                            <DropdownMenuItem 
                                onSelect={() => onValueChange(tab.id)}
                                className="flex items-center justify-between gap-2 cursor-pointer"
                            >
                                <span className="font-medium">{tab.title}</span>
                                {tab.id === selectedValue && <Check className="w-4 h-4 text-primary" />}
                            </DropdownMenuItem>
                        </TooltipTrigger>
                        {tab.tooltip && (
                            <TooltipContent side="right">
                                <p>{tab.tooltip}</p>
                            </TooltipContent>
                        )}
                    </Tooltip>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )

    if (isMinimal) {
        return dropdownContent
    }

    return (
        <FormSection title={title || "Select Model"} className={cn(isMinimal && "space-y-0")}>
            {dropdownContent}
        </FormSection>
    )
}