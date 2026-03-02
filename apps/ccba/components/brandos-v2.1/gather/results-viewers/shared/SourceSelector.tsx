import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { LucideIcon, Layers, ChevronDown } from 'lucide-react';

interface SourceSelectorProps {
    sources: string[];
    selectedSource: string;
    onSelect: (source: string) => void;
    icon?: LucideIcon;
    label?: string;
    className?: string;
}

export function SourceSelector({
    sources,
    selectedSource,
    onSelect,
    icon: Icon = Layers,
    label = "Data Source",
    className
}: SourceSelectorProps) {
    if (!sources || sources.length === 0) return null;

    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center gap-3", className)}>
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
            </div>
            
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-[280px] justify-between font-normal bg-background">
                        <span className="truncate">{selectedSource || "Select a source"}</span>
                        <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-[300px] overflow-y-auto" align="start">
                    {sources.map((source) => (
                        <DropdownMenuItem 
                            key={source} 
                            onSelect={() => onSelect(source)}
                            className={cn(
                                "cursor-pointer font-medium",
                                selectedSource === source && "bg-accent my-1 text-accent-foreground"
                            )}
                        >
                            {source}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="text-xs text-muted-foreground hidden sm:block">
                • {sources.length} sources available
            </div>
        </div>
    );
}
