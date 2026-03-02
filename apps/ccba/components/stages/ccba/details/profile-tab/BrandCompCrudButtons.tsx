"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { MoreHorizontalIcon, PencilIcon, Plus, Trash2Icon } from "lucide-react"

import { deleteBrand } from "@/server/actions/brandActions"
import { AddCompetitorsDialog } from "../../list/crud/AddCompetitorsDialog"
import { UpdateBrandDialog } from "../../list/crud/UpdateBrandDialog"
import { UpdateCompetitorsDialog } from "../../list/crud/UpdateCompetitorsDialog"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function BrandCompCrudButtons({ brand, side }: any) {
    const router = useRouter()

    const confirmBrandDelete = () => {
        toast(`Delete ${brand.name}?`, {
            description: "This action cannot be undone.",
            action: {
                label: "Confirm",
                onClick: async () => {
                    const {success, message} = await deleteBrand(brand.brand_id)
                   
                    if (!success) return toast.error(message);
                    router.refresh()
                    toast.success(message);
                },
            },
        })
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    Actions
                    <MoreHorizontalIcon  />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-34">
                {/* Brand Sub Menu */}
                <DropdownMenuSub >
                    <DropdownMenuSubTrigger  >
                        <span>Brand</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent sideOffset={10} >
                        <UpdateBrandDialog brand={brand}>
                            <DropdownMenuItem onSelect={e => e.preventDefault()}>
                                <PencilIcon  />
                                <span>Edit</span>
                            </DropdownMenuItem>
                        </UpdateBrandDialog>
                        <DropdownMenuItem onClick={confirmBrandDelete} variant="destructive">
                            <Trash2Icon  />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                {/* <DropdownMenuSeparator /> */}
                {/* Competitors Sub Menu */}
                {/* <DropdownMenuSub>
                    <DropdownMenuSubTrigger >
                        <span>Competitors</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent sideOffset={10} >
                        <AddCompetitorsDialog brand={brand}>
                            <DropdownMenuItem onSelect={e => e.preventDefault()}>
                                <Plus  />
                                <span>Create</span>
                            </DropdownMenuItem>
                        </AddCompetitorsDialog>
                        <UpdateCompetitorsDialog brand={brand}>
                            <DropdownMenuItem onSelect={e => e.preventDefault()}>
                                <PencilIcon  />
                                <span>Edit</span>
                            </DropdownMenuItem>
                        </UpdateCompetitorsDialog>
                    </DropdownMenuSubContent>
                </DropdownMenuSub> */}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}