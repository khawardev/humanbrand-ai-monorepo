"use client";

import React, { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/shared/data-table/DataTable";
import { SearchableColumn, FilterComponent } from "@/components/shared/data-table/DataTableToolbar";
import { getSupportTicketsColumns, SupportTicketAdmin } from "./SupportColumns";
import { updateSupportTicketStatus } from "@/server/actions/supportActions";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface SupportTicketsTableProps {
  tickets: SupportTicketAdmin[];
}

export function SupportTicketsTable({ tickets }: SupportTicketsTableProps) {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketAdmin | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleEdit = (ticket: SupportTicketAdmin) => {
    setSelectedTicket(ticket);
    setRemarks(ticket.adminRemarks || "");
    setStatus(ticket.status);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!selectedTicket) return;

    startTransition(async () => {
        try {
            await updateSupportTicketStatus(selectedTicket.id, status as any, remarks);
            toast.success("Ticket updated successfully");
            setIsDialogOpen(false);
        } catch (error) {
            toast.error("Failed to update ticket");
        }
    });
  };

  const columns = useMemo(() => getSupportTicketsColumns(handleEdit), []);

  const searchableColumns: SearchableColumn<SupportTicketAdmin>[] = [
    { id: "subject", placeholder: "Filter by subject...", label: "Subject" },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={tickets}
        title="Support Tickets"
        searchableColumns={searchableColumns}
        viewOptions={true}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Ticket</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                      <span className="font-semibold" >Subject:</span> {selectedTicket.subject}
                  </div>
                   <div>
                      <span className="font-semibold">Type:</span> {selectedTicket.type}
                  </div>
                    <div>
                      <span className="font-semibold">User:</span> {selectedTicket.user.email}
                  </div>
                   <div>
                       <span className="font-semibold">Submitted:</span> {new Date(selectedTicket.createdAt).toLocaleDateString()}
                  </div>
              </div>
              
              <div className="bg-muted p-3 rounded-md text-sm">
                   <p className="font-semibold mb-1">Description:</p>
                   {selectedTicket.description}
              </div>

               {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Attachments</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {selectedTicket.attachments.map((url, i) => (
                        <li key={i}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Attachment {i+1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Admin Remarks</Label>
                <Textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add remarks for the user..."
                />
              </div>

              <DialogFooter>
                <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={isPending}>
                    {isPending ? "Saving" : "Save"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
