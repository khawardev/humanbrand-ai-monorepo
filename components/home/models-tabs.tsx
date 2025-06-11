'use client'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"

type Option = {
    id: number;
    label: string;
    title: string;
}

type ModelsTabsProps = {
    options: Option[];
    selectedValue: number;
    onValueChange: (value: number) => void;
}

export const ModelsTabs = ({ options, selectedValue, onValueChange }: ModelsTabsProps) => {
    return (
        <NavigationMenu>
            <NavigationMenuList className="bg-card border text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-full p-[3px]">
                {options.map((tab) => (
                    <NavigationMenuItem key={tab.id}>
                        <button
                            onClick={() => onValueChange(tab.id)}
                            className={`rounded-full px-4 py-1 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus:outline-none ${selectedValue === tab.id
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {tab.title} <span className="sm:hidden hidden">• {tab.label}</span>
                        </button>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    )
}