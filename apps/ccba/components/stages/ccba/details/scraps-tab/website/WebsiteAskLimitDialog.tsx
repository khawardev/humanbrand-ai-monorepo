"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { SCRAPE, SCRAPING } from "@/lib/constants"

export function WebsiteAskLimitDialog({
  onConfirm,
  children,
}: {
  onConfirm: (limit: number) => void
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [limit, setLimit] = React.useState("")

  const handleConfirm = () => {
    const parsedLimit = Number(limit)
    if (!parsedLimit || parsedLimit <= 0) {
      toast.error("Please enter a valid number")
      return
    }
    toast.success(`Limit set to ${parsedLimit}`)
    toast.success(`${SCRAPING} Started`)
    onConfirm(parsedLimit)
    setIsOpen(false)
    setLimit("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleConfirm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enter {SCRAPING} Limit</DialogTitle>
          <DialogDescription>
            Please specify the number of pages to {SCRAPE}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 ">
          <Input
            type="number"
            placeholder="e.g. 10"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
