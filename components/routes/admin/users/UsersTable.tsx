"use client";

import React, { useMemo, useTransition } from "react";
import { toast } from "sonner";

import { updateUserVerification, deleteUserById } from "@/server/actions/usersActions";
import { DataTable } from "@/components/shared/data-table/DataTable";
import { SearchableColumn, FilterComponent } from "@/components/shared/data-table/DataTableToolbar";

import { getUsersColumns, User } from "./Columns";
import { UserStatusFilter } from "./UserStatusFilter";

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
  const [isPending, startTransition] = useTransition();

  const handleVerificationToggle = (userId: string, currentStatus: boolean) => {
    startTransition(async () => {
      try {
        await updateUserVerification(userId, !currentStatus);
        toast.success("User status updated successfully.");
      } catch (error) {
        toast.error("Failed to update user status.");
        console.error("Failed to update user status.", error);
      }
    });
  };

  const handleDeleteUser = (userName: string, userId: string) => {
    toast(`Delete user "${userName}"?`, {
      description: "This cannot be undone.",
      action: {
        label: "Confirm",
        onClick: () =>
          startTransition(async () => {
            try {
              const res = await deleteUserById(userId) as any;
              if (res && !res.success) {
                  toast.error(res.error || "Failed to delete user.");
              } else {
                  toast.success("User deleted successfully");
              }
            } catch (err) {
                 toast.error("An unexpected error occurred.");
            }
          }),
      },
    });
  };

  const columns = useMemo(
    () =>
      getUsersColumns(handleVerificationToggle, isPending, handleDeleteUser),
    [isPending]
  );

  const searchableColumns: SearchableColumn<User>[] = [
    { id: "name", placeholder: "Filter by name...", label: "Filter by name" },
  ];

  const filterComponents: FilterComponent<User>[] = [
    { id: "statusFilter", component: UserStatusFilter },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      title="Manage Users"
      searchableColumns={searchableColumns}
      filterComponents={filterComponents}
      viewOptions={true}
    />
  );
}
