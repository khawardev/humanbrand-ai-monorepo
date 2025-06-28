"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/shared/spinner";
import { DataTableColumnHeader } from "../table/data-table";
import { CheckCircle, XCircle } from "lucide-react";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { TbCancel } from "react-icons/tb";
import { IoIosCheckmarkCircle } from "react-icons/io";

export const getUsersColumns = (
    onVerificationToggle: (userId: string, currentStatus: boolean) => void,
    isPending: boolean
): any => [
        {
            id: "select",
            header: ({ table }: any) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }: any) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
            size: 40,
        },
        {
            accessorKey: "name",
            header: ({ column }: any) => (
                <DataTableColumnHeader column={column} title="User" />
            ),
            cell: ({ row }: any) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <Image
                            src={user.image || `https://avatar.vercel.sh/${user.email}.png`}
                            alt={user.name || 'User avatar'}
                            width={40}
                            height={40}
                            className="rounded-md border object-cover"
                        />
                        <div className="flex flex-col">
                            <span className="font-medium truncate">{user.name}</span>
                            <span className="text-sm  w-[300px]  text-muted-foreground truncate">{user.email}</span>
                        </div>
                    </div>
                );
            },
            enableHiding: false,
            size: 330,
        },
        {
            accessorKey: "adminVerified",
            header: ({ column }: any) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }: any) => {
                const isVerified = row.getValue("adminVerified");
                return (
                    <Badge className='rounded-full' variant={isVerified ? "default" : "outline"}>
                        {isVerified ? "Verified" : "Not Verified"}
                    </Badge>
                );
            },
            size: 150,
            filterFn: (row: any, id: any, value: any) => {
                return value.includes(row.getValue(id))
            },
        },
        {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }: any) => {
                const user = row.original;
                return (
                    <div className="text-right">
                        <Button
                            variant={`${user.adminVerified ? 'destructive' : 'default'}`}
                            size="sm"
                            onClick={() => onVerificationToggle(user.id, user.adminVerified)}
                            disabled={isPending}
                        >
                            {user.adminVerified ? <>
                                {isPending ? <Spinner /> : <TbCancel />}
                                Revoke
                            </> : <>
                                {isPending ? <Spinner /> : <IoIosCheckmarkCircle />}
                                Verify
                            </>}
                        </Button>
                    </div>

                );
            },
            size: 120,
            enableSorting: false,
            enableHiding: false,
        },
    ];