"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface SupportTicket {
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

interface SupportTicketListProps {
  tickets: SupportTicket[];
}

export function SupportTicketList({ tickets }: SupportTicketListProps) {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No support tickets found.
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "in_progress":
        return "default"; // blue usually
      case "completed":
        return "success"; // green usually (if defined), else default
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Your Tickets</h3>
        <p className="text-sm text-muted-foreground">
          View the status of your support requests.
        </p>
      </div>
      <div className="rounded-xl shadow-sm border p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.subject}</TableCell>
                <TableCell className="capitalize">
                  {ticket.type.replace("_", " ")}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(ticket.status) as any}>
                    {ticket.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" >
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{ticket.subject}</DialogTitle>
                        <DialogDescription>
                          Ticket ID: {ticket.id}
                        </DialogDescription>
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
                            <h4 className="text-sm font-semibold mb-1">
                              Created At
                            </h4>
                            <p className="text-sm">
                              {format(
                                new Date(ticket.createdAt),
                                "MMM d, yyyy HH:mm"
                              )}
                            </p>
                          </div>
                           <div>
                            <h4 className="text-sm font-semibold mb-1">
                              Last Updated
                            </h4>
                            <p className="text-sm">
                              {format(
                                new Date(ticket.updatedAt),
                                "MMM d, yyyy HH:mm"
                              )}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold mb-1">
                            Description
                          </h4>
                          <div className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                            {ticket.description}
                          </div>
                        </div>

                        {ticket.attachments && ticket.attachments.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-1">
                              Attachments
                            </h4>
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
                            <h4 className="text-sm font-semibold mb-2">
                              Admin Remarks
                            </h4>
                            <div className="text-sm bg-blue-50/50 dark:bg-blue-950/20 p-3 rounded-md border border-blue-100 dark:border-blue-900">
                              {ticket.adminRemarks}
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
