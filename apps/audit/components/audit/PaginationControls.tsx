"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    className?: string;
}

export default function PaginationControls({
    currentPage,
    totalPages,
    className,
}: PaginationControlsProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const changePage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(newPage));
        router.push(`${pathname}?${params.toString()}`);
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={`flex items-center justify-center space-x-4 ${className}`}>
            <Button
                variant="outline"
                size="icon"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                variant="outline"
                size="icon"
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage >= totalPages}
            >
                <ChevronRightIcon className="h-4 w-4" />
            </Button>
        </div>
    );
}