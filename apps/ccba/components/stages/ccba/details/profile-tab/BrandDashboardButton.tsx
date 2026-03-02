import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

export function BrandDashboardButton({ brand_id, isScrapped }: { brand_id: any; isScrapped: boolean }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {isScrapped ? (
                        <Button  asChild>
                            <Link href={`/dashboard/ccba/dashboard/brand/${brand_id}`}>Dashboard</Link>
                        </Button>
                    ) : (
                        <span>
                            <Button variant="outline" disabled className="pointer-events-none">
                                Dashboard
                            </Button>
                        </span>
                    )}
                </TooltipTrigger>
                <TooltipContent>
                    {!isScrapped ? (
                        <div className="flex flex-col gap-1 text-xs">
                            <span >1. Gather Social Data</span>
                            <span >2. Generate Website and Social Reports</span>
                        </div>
                    ) : (
                        "Go to Brand Dashboard"
                    )}
                </TooltipContent>
               
            </Tooltip>
        </TooltipProvider>
    )
}