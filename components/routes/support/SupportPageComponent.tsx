"use client";

import { SupportRequestForm } from "./SupportRequestForm";
import { SupportTicketList } from "./SupportTicketList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SupportPageComponentProps {
  tickets: any[];
}

export function SupportPageComponent({ tickets }: SupportPageComponentProps) {
  const hasNewTickets = tickets.some(t => new Date(t.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-6 py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Support & Feedback</h1>
        <p className="text-muted-foreground">
          Need help? Found a bug? Let us know below.
        </p>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList>
          <TabsTrigger value="create">Create Ticket</TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            Your Tickets
            {hasNewTickets && (
               <span className="relative flex h-2 w-2 ">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/80 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
               </span>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="create" className="mt-4">
            <SupportRequestForm />
        </TabsContent>
        <TabsContent value="tickets" className="mt-4">
          <SupportTicketList tickets={tickets} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
