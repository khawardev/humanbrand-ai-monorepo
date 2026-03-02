"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/shared/data-table/DataTableColumnHeader";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export type SupportTicketAdmin = {
  id: string;
  userId: string;
  subject: string;
  description: string;
  type: "bug_report" | "feature_request";
  status: "pending" | "in_progress" | "completed" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  adminRemarks?: string | null;
  attachments?: string[] | null;
  user: {
    name: string | null;
    email: string;
  };
};

export const getSupportTicketsColumns = (
  onEdit: (ticket: SupportTicketAdmin) => void
): ColumnDef<SupportTicketAdmin>[] => [
  {
    accessorKey: "subject",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject" />
    ),
  },
  {
    accessorKey: "user.email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.user.name}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.user.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue<string>("type").replace("_", " ")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      let variant = "secondary";
      if (status === "completed") variant = "default";
      if (status === "rejected") variant = "destructive";
      if (status === "in_progress") variant = "outline";

      return <Badge variant={variant as any}>{status.replace("_", " ")}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => format(new Date(row.getValue("createdAt")), "MMM d, yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" onClick={() => onEdit(row.original)}>
        View/Edit
      </Button>
    ),
  },
];
