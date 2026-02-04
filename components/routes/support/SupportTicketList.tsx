"use client";

import { DataTable } from "@/components/shared/data-table/DataTable";
import { columns, SupportTicket } from "./SupportTicketColumns";

interface SupportTicketListProps {
  tickets: SupportTicket[];
}

export function SupportTicketList({ tickets }: SupportTicketListProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Your Tickets</h3>
        <p className="text-sm text-muted-foreground">
          View the status of your support requests.
        </p>
      </div>
        <DataTable
          columns={columns}
          data={tickets}
          searchableColumns={[
            {
              id: "subject",
              placeholder: "Filter tickets...",
              label: "Subjects",
            },
          ]}
          noResultsMessage="No support tickets found."
        />
    </div>
  );
}
