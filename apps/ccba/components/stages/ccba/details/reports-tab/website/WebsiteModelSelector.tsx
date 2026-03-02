"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CommandDialog, CommandInput, CommandList, CommandItem } from "@/components/ui/command"
import { MODELS } from "@/lib/constants"



export function WebsiteModelSelector({ selectedModel, setSelectedModel }: any) {
    const [open, setOpen] = useState(false)

    const handleSelect = (modelId: string) => {
        setSelectedModel(modelId)
        setOpen(false)
    }

    return (
        <>
            <Button
                className="w-full"
                variant="outline"
                onClick={() => setOpen(true)}
            >
                {selectedModel ? `${selectedModel}` : "Select Model"}
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search models..." />
                <CommandList>
                    {MODELS.map((model) => (
                        <CommandItem
                            key={model.id}
                            onSelect={() => handleSelect(model.id)}
                            className={`cursor-pointer ${selectedModel === model.id ? "bg-accent text-accent-foreground" : ""
                                }`}
                        >
                            {model.name}
                        </CommandItem>
                    ))}
                </CommandList>
            </CommandDialog>
        </>
    )
}