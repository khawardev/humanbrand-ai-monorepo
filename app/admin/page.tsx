import { getAllUsers } from '@/actions/users-actions';
import UsersTable from '@/components/aiag-components/admin-verification/users/users-table';
import { ADMIN_EMAILS } from '@/config/aiag-config';
import { getSession } from '@/lib/get-session';
import { redirect } from 'next/navigation';
import React from 'react';

const AdminUsersPage = async () => {
    const session = await getSession();
    const isAdmin = session?.user?.email ? ADMIN_EMAILS.includes(session?.user?.email) : false;

    if (!isAdmin) {
        redirect('/')
    }
  
    const users = await getAllUsers();
    
    const filteredUsers = users?.filter(user => {
        const email = user.email || '';
        return email.endsWith('@aiag.org');
    });
    
    return (
        <div className='div-center-md'>
            <UsersTable users={filteredUsers} />
        </div>
    );
}

export default AdminUsersPage;