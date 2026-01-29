"use client";

import React, { useMemo, useTransition } from 'react';
import { getUsersColumns } from './columns';
import { toast } from 'sonner';
import { UserStatusFilter } from './user-status-filter';
import { deleteUserById, updateUserVerification } from '@/server/actions/users-actions';
import { DataTable } from '../table/data-table';

export default function UsersTable({ users }: any) {
    const [isPending, startTransition] = useTransition();

    const handleVerificationToggle = (userId: string, currentStatus: boolean) => {
        startTransition(async () => {
            try {
                await updateUserVerification(userId, !currentStatus);
                toast.success(`User status updated successfully.`);
            } catch (error) {
                toast.error("Failed to update user status.");
                console.error("Failed to update user status.", error);
            }
        });
    };
    const handleDeleteUser = async (userName: string, userId: string) => {
        toast(`Delete user "${userName}"?`, {
            description: "This cannot be undone.",
            action: {
                label: "Confirm",
                onClick: () =>
                    startTransition(async () => {
                        deleteUserById(userId).then((res: any) => {
                            if (!res.success) toast.error(res.error);
                        });
                    }),
            },
        })
    }
    const columns = useMemo(() => getUsersColumns(handleVerificationToggle, isPending, handleDeleteUser), [isPending]);

    const searchableColumns: any = [
        { id: 'name', placeholder: 'Filter by name...', label: 'Filter by name' },
    ];

    const filterComponents: any = [
        { id: 'statusFilter', component: UserStatusFilter },
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