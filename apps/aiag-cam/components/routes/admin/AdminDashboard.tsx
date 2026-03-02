"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTable } from "@/components/routes/admin/users/UsersTable";
import { SupportTicketsTable } from "@/components/routes/admin/support/SupportTicketsTable";
import { AddLoomVideoInput } from "@/components/routes/admin/loom/AddLoomVideoInput";
import { LoomVideosList } from "@/components/routes/admin/loom/LoomVideosList";
import { UserAdmin, SupportTicketAdmin, LoomVideo } from "@/types/admin";
// Note: UsersTable might expect a slightly different User type (e.g. from schema inference).
// Let's assume UserAdmin matches or is compatible. 
// If UsersTable expects schema-inferred type, we can cast or update UsersTable.
// Let's import User type from UsersTable columns if needed, or use UserAdmin if compatible.
// But UsersTable is likely using a type defined in its columns file.
import { User } from "@/components/routes/admin/users/Columns"; 


interface AdminDashboardProps {
  users: User[]; // Keep using the type UsersTable expects
  tickets: SupportTicketAdmin[];
  videos: LoomVideo[];
}

export function AdminDashboard({ users, tickets, videos }: AdminDashboardProps) {
  const hasNewTickets = tickets.some(t => new Date(t.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="users" className="w-full">
        <div className="flex items-center justify-end">
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
            <TabsTrigger value="loom">Loom Videos</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="users" >
          <UsersTable users={users} />
        </TabsContent>
        <TabsContent value="support" >
          <SupportTicketsTable tickets={tickets} />
        </TabsContent>
        <TabsContent value="loom" className="flex flex-col space-y-4">
          <div className="flex justify-end items-center mb-6 ">
            <AddLoomVideoInput />
          </div>
          <LoomVideosList videos={videos} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
