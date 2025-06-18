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
import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { HiOutlineChatAlt } from 'react-icons/hi';
import { Badge } from '@/components/ui/badge';

const SavedSessions = ({ savedSessions }: any) => {
    function formatCompactTime(date: string | Date) {
        const parsedDate = typeof date === "string" ? parseISO(date) : date;
        const formatted = formatDistanceToNowStrict(parsedDate, {
            addSuffix: false,
        });

        return formatted
            .replace(" minutes", " min")
            .replace(" minute", " min")
            .replace(" hours", " hr")
            .replace(" hour", " hr")
            .replace(" seconds", " sec")
            .replace(" second", " sec")
            .replace(" days", " day")
            .replace(" day", " day")
            ;
    }
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
                    {savedSessions?.length === 0 ? (
                        <DropdownMenuItem disabled>
                            <span className="text-sm text-muted-foreground">No savedSessions found.</span>
                        </DropdownMenuItem>
                    ) : (
                        savedSessions?.map((session: any) => (
                            <DropdownMenuItem key={session.id}>
                                <div className="flex items-center justify-between w-full space-x-2">
                                    <div className="flex items-center space-x-2 min-w-0">
                                        <HiOutlineChatAlt size={16} className="opacity-60" aria-hidden="true" />
                                        <span className="  truncate text-sm max-w-[170px]">{session?.sessionTitle}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground shrink-0">
                                        {formatCompactTime(session?.createdAt)}
                                    </span>
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </section>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default SavedSessions