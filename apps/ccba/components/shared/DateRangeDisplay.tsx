"use client"

import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { FaCaretRight } from "react-icons/fa6"

export function DateRangeDisplay({ start_date, end_date, className }: { start_date: string; end_date: string; className?: string }) {
    const formatDate = (dateString: string) => {
        const [month, day, year] = dateString.split("-").map(Number)
        return format(new Date(year!, month! - 1, day!), "MMM d, yyyy")
    }

    const formattedStart = formatDate(start_date)
    const formattedEnd = formatDate(end_date)

    return (
        <div className={cn("flex items-center gap-2 text-sm", className)}>
            <Badge >
                {formattedStart}
            </Badge>
            <span><FaCaretRight /></span>
            <Badge>
                {formattedEnd}
            </Badge>
        </div>
    )
}