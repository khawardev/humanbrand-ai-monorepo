"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/shared/data-table/DataTableColumnHeader";

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  type: "bug_report" | "feature_request";
  status: "pending" | "in_progress" | "completed" | "rejected";
  createdAt: Date;
  updatedAt: Date;
  adminRemarks?: string | null;
  attachments?: string[] | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "secondary";
    case "in_progress":
      return "outline";
    case "completed":
      return "default";
    case "rejected":
      return "destructive";
    default:
      return "secondary";
  }
};

export const columns: ColumnDef<SupportTicket>[] = [
  {
    accessorKey: "subject",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("subject")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return <div className="capitalize">{type.replace("_", " ")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={getStatusColor(status) as any}>
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return (
        <div>{format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const ticket = row.original;

      return (
        <div className="text-right">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">
                View
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl text-left">
              <DialogHeader>
                <DialogTitle>{ticket.subject}</DialogTitle>
                <DialogDescription>Ticket ID: {ticket.id}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Type</h4>
                    <p className="text-sm capitalize">
                      {ticket.type.replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Status</h4>
                    <Badge variant={getStatusColor(ticket.status) as any}>
                      {ticket.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Created At</h4>
                    <p className="text-sm">
                      {format(
                        new Date(ticket.createdAt),
                        "MMM d, yyyy HH:mm"
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Last Updated</h4>
                    <p className="text-sm">
                      {format(
                        new Date(ticket.updatedAt),
                        "MMM d, yyyy HH:mm"
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-1">Description</h4>
                  <div className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                    {ticket.description}
                  </div>
                </div>

                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Attachments</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {ticket.attachments.map((url, i) => (
                        <li key={i}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline underline-offset-4"
                          >
                            View Attachment {i + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {ticket.adminRemarks && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-semibold mb-2">Admin Remarks</h4>
                    <div className="text-sm bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-md border border-blue-100 dark:border-blue-900">
                      {ticket.adminRemarks}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
