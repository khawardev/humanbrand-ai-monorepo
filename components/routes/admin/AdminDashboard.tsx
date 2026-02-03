"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTable } from "@/components/routes/admin/users/UsersTable";
import { SupportTicketsTable } from "@/components/routes/admin/support/SupportTicketsTable";
import { User } from "@/components/routes/admin/users/Columns";
import { SupportTicketAdmin } from "@/components/routes/admin/support/SupportColumns";

interface AdminDashboardProps {
  users: User[];
  tickets: SupportTicketAdmin[];
}

export function AdminDashboard({ users, tickets }: AdminDashboardProps) {
  const hasNewTickets = tickets.some(t => new Date(t.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users" className="w-full">
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <TabsList>
                <TabsTrigger value="users">Manage Users</TabsTrigger>
                <TabsTrigger value="support" className="flex items-center gap-2">
                    User Support
                     {hasNewTickets && (
                        <span className="relative flex h-2 w-2">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/80 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                     )}
                </TabsTrigger>
            </TabsList>
        </div>
        
        <TabsContent value="users" className="mt-6">
          <UsersTable users={users} />
        </TabsContent>
        <TabsContent value="support" className="mt-6">
          <SupportTicketsTable tickets={tickets} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
