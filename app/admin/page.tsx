import { getAllUsers } from '@/actions/users-actions';
import UsersTable from '@/components/aiag-components/admin-verification/users/users-table';
import { DEV_EMAILS, OVERALL_ADMIN_EMAILS } from '@/config/aiag-config';
import { getSession } from '@/lib/get-session';
import { redirect } from 'next/navigation';
import React from 'react';

const AdminUsersPage = async () => {
    const session = await getSession();
    const isAdmin = session?.user?.email ? OVERALL_ADMIN_EMAILS.includes(session?.user?.email) : false;

    if (!isAdmin) {
        redirect('/')
    }
  
    const users = await getAllUsers();
    const filterdAdminUsers = users?.filter(user => !DEV_EMAILS?.includes(user?.email))
    
    return (
        <div className='div-center-md'>
            <UsersTable users={filterdAdminUsers} />
        </div>
    );
}

export default AdminUsersPage;