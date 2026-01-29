import { getAllUsers } from '@/server/actions/users-actions';
import UsersTable from '@/components/aiag-components/admin-verification/users/users-table';
import React from 'react';

const AdminUsersPage = async () => {
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
