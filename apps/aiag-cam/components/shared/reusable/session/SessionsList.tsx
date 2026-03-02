'use client'

import { formatCompactTime } from '@/components/shared/ServerFunctions'
import Link from 'next/link'
import React from 'react'
import { HiOutlineChatAlt } from 'react-icons/hi'
import { usePathname } from "next/navigation"

const SessionsList = ({ savedSessions, setIsOpen }: any) => {
    const pathname = usePathname()

    if (!savedSessions || savedSessions.length === 0) {
        return (
            <div className="px-2 py-1.5 text-sm text-muted-foreground rounded-md">
                No session found.
            </div>
        )
    }

    return (
        <div className="flex flex-col text-xs space-y-1">
            {savedSessions.map((session: any) => {
                const isActive = pathname === `/session/${session.id}`
                const itemClass = isActive
                    ? 'bg-input/30 border border-muted-foreground/30 text-accent-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'

                return (
                    <Link
                        onClick={() => setIsOpen(false)}
                        key={session.id}
                        href={`/session/${session.id}`}
                        className={`flex items-center gap-10 justify-between w-full px-2 py-1.5 rounded-md text-sm ${itemClass}`}
                    >
                        <div className="flex items-center space-x-2 min-w-0">
                            <HiOutlineChatAlt size={16} className="opacity-60" aria-hidden="true" />
                            <span className="truncate text-sm ">
                                {session?.title}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                            {formatCompactTime(session?.updatedAt)}
                        </span>
                    </Link>
                )
            })}
        </div>
    )
}

export default SessionsList