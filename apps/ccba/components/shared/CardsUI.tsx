'use client'
import { useRouter } from "next/navigation";
import { RiErrorWarningLine } from "react-icons/ri";

export function EmptyStateCard({ message }: { message: string }) {
    return (
        <div className="w-full border-x-0 mt-1 h-[40vh] text-card-foreground border-border ring-border/70 flex items-center justify-center text-center  border-dashed border-2">
            <p className=" text-muted-foreground  flex gap-2 items-center"><RiErrorWarningLine /> {message}</p>
        </div>
    )
}

export function ClickableListCard({
    children,
    isActive,
    href,
    onClick,
    className
}: {
    children: React.ReactNode
    isActive?: boolean
    href?: string
    onClick?: () => void
    className?: string
}) {
    const router = useRouter()

    const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (
            (e.target as HTMLElement).closest("a") ||
            (e.target as HTMLElement).closest("button") ||
            (e.target as HTMLElement).closest('[role="menuitem"]')
        ) return

        if (href) router.push(href)
        else onClick?.()
    }

    return (
        <div className={`w-full shadow-none rounded-none border-x-0 relative transition-all shadow-zinc-950/10 text-card-foreground flex flex-col gap-6 py-6 border border-t border-b-0 ${isActive ? "hover:bg-border/50 cursor-pointer" : ""} ${className || ""}`}
            onClick={isActive ? handleCardClick : undefined}
        >
            {children}
        </div>
    )
}

