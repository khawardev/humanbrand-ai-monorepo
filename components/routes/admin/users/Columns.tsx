"use client";

import { useTransition } from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import {
  Delete,
  Trash,
  CheckCircle2,
  XCircle,
  Ban,
  ShieldAlert,
} from "lucide-react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/shared/Spinner";
import { DataTableColumnHeader } from "@/components/shared/data-table/DataTableColumnHeader"; // Updated import

// Define User type based on usages
export type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  adminVerified: boolean;
  isAdmin: boolean;
};

// We can pass handlers as an object or separate arguments.
// Keeping strictly to what was there but typed.
export const getUsersColumns = (
  onVerificationToggle: (userId: string, currentStatus: boolean) => void,
  isPending: boolean,
  handleDeleteUser: (userName: string, userId: string) => void,
  onAdminToggle: (userId: string, currentStatus: boolean) => void
): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
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
    accessorKey: "userType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("userType") as string;
      return (
        <Badge variant={type === "company" ? "default" : "secondary"}>
          {type === "company" ? "Company" : "External"}
        </Badge>
      );
    },
    accessorFn: (row) => (row.email?.endsWith("@aiag.org") ? "company" : "external"),
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      return (value as string[]).includes(row.getValue(id));
    },
    size: 100,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Image
            src={user.image || `https://avatar.vercel.sh/${user.email}.png`}
            alt={user.name || "User avatar"}
            width={40}
            height={40}
            className="rounded-lg border object-cover"
          />
          <div className="flex flex-col">
            <span className="font-medium truncate">{user.name}</span>
            <span className="text-sm w-[300px] text-muted-foreground truncate">
              {user.email}
            </span>
          </div>
        </div>
      );
    },
    enableHiding: false,
    size: 330,
  },
  {
    accessorKey: "adminVerified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Verification" />
    ),
    cell: ({ row }) => {
      const isVerified = row.getValue("adminVerified");
      return (
        <Badge
          variant={isVerified ? "default" : "outline"}
        >
          {isVerified ? "Verified" : "Not Verified"}
        </Badge>
      );
    },
    size: 150,
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      return (value as boolean[]).includes(row.getValue(id) as boolean);
    },
  },
  {
    accessorKey: "isAdmin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      const isAdmin = row.getValue("isAdmin");
      return (
        <Badge
          variant={isAdmin ? "default" : "secondary"}
        >
          {isAdmin ? "Admin" : "User"}
        </Badge>
      );
    },
    size: 100,
    filterFn: (row, id, value) => {
      if (!value || value.length === 0) return true;
      return (value as boolean[]).includes(row.getValue(id) as boolean);
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-right gap-2 flex items-center justify-end">
        {isPending && <Spinner />} Actions
      </div>
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="text-right flex justify-end gap-2">
           <Button
            variant={user.isAdmin ? "default" : "outline"}
            size="icon"
            onClick={() => onAdminToggle(user.id, user.isAdmin)}
            disabled={isPending}
            title={user.isAdmin ? "Remove Admin" : "Make Admin"}
          >
            <ShieldAlert className="h-4 w-4" />
          </Button>
          <Button
            variant={user.adminVerified ? "outline" : "default"}
            onClick={() => onVerificationToggle(user.id, user.adminVerified)}
            disabled={isPending}
            size="sm"
          >
            {user.adminVerified ? (
              "Revoke"
            ) : (
              <>
                <IoIosCheckmarkCircle className="mr-1" />
                Verify
              </>
            )}
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDeleteUser(user.name || "Unknown", user.id)}
            disabled={isPending}
            size="icon"
          >
            <Trash /> 
          </Button>
        </div>
      );
    },
    size: 120,
    enableSorting: false,
    enableHiding: false,
  },
];