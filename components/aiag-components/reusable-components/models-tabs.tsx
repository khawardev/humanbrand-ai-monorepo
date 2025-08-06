'use client'

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip"

type Option = {
    id: number;
    label: string;
    title: string;
    tooltip: string; 
}

type ModelsTabsProps = {
    options: Option[];
    selectedValue: number;
    onValueChange: (value: number) => void;
}

export const ModelsTabs = ({ options, selectedValue, onValueChange }: ModelsTabsProps) => {
    return (
        <TooltipProvider>
            <NavigationMenu>
                <NavigationMenuList className="bg-accent border text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-full p-[3px]">
                    {options.map((tab) => (
                        <NavigationMenuItem key={tab.id}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() => onValueChange(tab.id)}
                                        className={`rounded-full px-4 py-1 text-sm font-semi transition-colors focus-visible:ring-2 focus-visible:ring-ring focus:outline-none ${selectedValue === tab.id
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {tab.title}{" "}
                                        <span className="sm:hidden hidden">• {tab.label}</span>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <span className="text-xs font-medium">{tab.tooltip}</span>
                                </TooltipContent>
                            </Tooltip>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
        </TooltipProvider>
    )
}
