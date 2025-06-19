import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bookmark } from "lucide-react"
import { Button } from '@/components/ui/button'
import { HiOutlineChatAlt } from 'react-icons/hi';
import Link from 'next/link';
import { formatCompactTime } from '@/shared/server-functions';
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
                            Your previously saved content sessions.
                        </span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <section className=" max-h-30 overflow-y-auto no-scrollbar">
                    <SessionsList savedSessions={savedSessions} />
                </section>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default SavedSessions