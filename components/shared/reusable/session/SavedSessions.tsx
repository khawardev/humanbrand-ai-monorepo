'use client'
import React, { useState } from "react"
import { Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from "@/components/ui/sheet"
import SessionsList from "./SessionsList"

const SavedSessions = ({ savedSessions }: any) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <Bookmark />
                </Button>
            </SheetTrigger>
            <SheetContent side='left' className="w-80 ">
                <SheetHeader>
                    <SheetTitle></SheetTitle>
                    <span className=" font-semibold tracking-tight">Saved Sessions</span>
                    <SheetDescription>
                        Your previously saved sessions.
                    </SheetDescription>
                </SheetHeader>
                <section className="mt-4 overflow-y-auto">
                    <SessionsList setIsOpen={setIsOpen} savedSessions={savedSessions} />
                </section>
            </SheetContent>
        </Sheet>
    )
}

export default SavedSessions