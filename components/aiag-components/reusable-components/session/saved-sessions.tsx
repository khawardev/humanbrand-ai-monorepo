import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bookmark } from "lucide-react"
import { Button } from '@/components/ui/button'
import SessionsList from './sessions-list';

const SavedSessions = ({ savedSessions }: any) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Bookmark />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel className="flex gap-2 items-center min-w-0">
                    <div className="flex flex-col">
                        <span className="text-foreground tracking-tight truncate text-sm font-medium">
                            Saved Sessions
                        </span>
                        <span className="text-muted-foreground truncate text-xs font-normal">
                            Your previously saved sessions.
                        </span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <section className="h-40 overflow-y-auto">
                    <SessionsList savedSessions={savedSessions} />
                </section>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default SavedSessions;