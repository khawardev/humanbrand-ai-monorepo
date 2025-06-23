'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { formatCompactTime } from '@/shared/server-functions'
import Link from 'next/link'
import React from 'react'
import { HiOutlineChatAlt } from 'react-icons/hi'
import { usePathname } from "next/navigation";

const SessionsList = ({ savedSessions }: any) => {
    const pathname = usePathname()
    return (
        savedSessions?.length === 0 ? (
            <DropdownMenuItem disabled>
                <span className="text-sm text-muted-foreground">No session found.</span>
            </DropdownMenuItem>
        ) : (
            <div className="flex flex-col space-y-1">
                {savedSessions?.map((session: any, index:number) => {
                    const isActive = pathname === `/session/${session.id}`;
                    const itemClass = isActive
                        ? 'bg-input/30 border border-muted-foreground/30  text-accent-foreground'
                        : '';
                    return (
                        <Link key={index} href={`/session/${session.id}`} className="w-full  ">
                            <DropdownMenuItem className={itemClass}>
                                <div className="flex items-center justify-between w-full space-x-2">
                                    <div className="flex items-center space-x-2 min-w-0">
                                        <HiOutlineChatAlt size={16} className="opacity-60" aria-hidden="true" />
                                        <span className="truncate text-sm max-w-[170px]">{session?.title}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground shrink-0">
                                        {formatCompactTime(session?.updatedAt)}
                                    </span>
                                </div>
                            </DropdownMenuItem>
                        </Link>
                    );
                })}
            </div>
        )
    )
}

export default SessionsList
