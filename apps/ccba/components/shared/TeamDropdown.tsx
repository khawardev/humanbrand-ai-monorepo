'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuLabel } from '@/components/ui/dropdown-menu'
import { Plus, Settings } from 'lucide-react'
import { RiUserSmileLine } from 'react-icons/ri'

export default function TeamDropdown() {
    const [open, setOpen] = useState(false)

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost'>
                    <span className="size-4 rounded bg-primary text-background flex items-center justify-center text-[10px] font-bold">P</span>
                    Personal Team
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64" align="start" side="bottom" sideOffset={4}>
                <DropdownMenuLabel label="Teams" rootOpenSetter={setOpen} />

                <DropdownMenuSeparator />

                <DropdownMenuItem className="dark:bg-border bg-accent">
                    <div className="flex items-center justify-center size-6 rounded-md bg-primary text-background text-xs font-bold">P</div>
                    <span className="font-medium">Personal</span>
                    <div className="ml-auto size-2 rounded-full bg-primary" />
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                    <Plus />
                    <span>New Team</span>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <Settings />
                    <span>Team Settings</span>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <RiUserSmileLine />
                    <span>Invite Members</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}