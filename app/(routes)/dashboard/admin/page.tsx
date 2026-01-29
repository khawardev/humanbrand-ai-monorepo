import { getAllUsers } from '@/server/actions/usersActions';
import UsersTable from '@/components/aiag-components/admin-verification/users/users-table';
import { DashboardInnerLayout } from '@/components/shared/DashboardComponents';
import { Hero } from '@/components/aiag-components/reusable-components/hero';

const AdminUsersPage = async () => {
    const users = await getAllUsers();

    const filteredUsers = users?.filter(user => {
        const email = user.email || '';
        return email.endsWith('@aiag.org');
    });

    return (
        <DashboardInnerLayout>
            <Hero/>
            <UsersTable users={filteredUsers} />
        </DashboardInnerLayout>
    );
}

export default AdminUsersPage;
