import { getCompanyUsers } from '@/server/actions/usersActions';
import { DashboardInnerLayout } from '@/components/shared/DashboardComponents';
import { Hero } from '@/components/shared/reusable/Hero';
import { UsersTable } from '@/components/routes/admin/users/UsersTable';

const AdminPage = async () => {
    const users = await getCompanyUsers();

    return (
        <DashboardInnerLayout>
            <Hero />
            <UsersTable users={users} />
        </DashboardInnerLayout>
    );
}

export default AdminPage;
