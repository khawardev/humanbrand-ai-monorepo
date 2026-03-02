"use client"

import React from "react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ButtonSpinner } from "@/components/shared/SpinnerLoader"
import { DatePickerWithRange } from "./DatePickerwithRange"
import { Label } from "@/components/ui/label"
import { SCRAPE, SCRAPING } from "@/lib/constants"


export function ScrapeSocialDialog({ isLoading, onConfirm, children }: any) {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<DateRange | undefined>()

    const handleSubmit = () => {
        if (!date?.from || !date?.to) {
            toast.error("Please select a complete start and end date range.")
            return
        }

        const formattedStartDate = format(date.from, "M-d-yyyy")
        const formattedEndDate = format(date.to, "M-d-yyyy")

        onConfirm({
            startDate: formattedStartDate,
            endDate: formattedEndDate,
        })

        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Social {SCRAPE}</DialogTitle>
                    <DialogDescription>
                        Select the date range for the Social {SCRAPING}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Date Range</Label>
                        <DatePickerWithRange date={date} setDate={setDate} />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? <ButtonSpinner>Starting...</ButtonSpinner> : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}