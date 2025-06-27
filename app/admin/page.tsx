import { getAllUsers } from '@/actions/users-actions';
import UsersTable from '@/components/aiag-components/admin-verification/users/users-table';
import React from 'react';

const AdminUsersPage = async () => {
    const users = await getAllUsers();

    return (
        <div className='div-center-md'>
            <UsersTable users={users} />
        </div>
    )
}

export default AdminUsersPage;