import { getCompanyUsers } from '@/server/actions/usersActions';
import { DashboardInnerLayout } from '@/components/shared/DashboardComponents';
import { Hero } from '@/components/shared/reusable/Hero';
import AdminPageComponent from '@/components/AIAGComponents/admin/users/AdminPageComponent';

const AdminUsersPage = async () => {
    const users = await getCompanyUsers();

    return (
        <DashboardInnerLayout>
            <Hero />
            <AdminPageComponent users={users} />
        </DashboardInnerLayout>
    );
}

export default AdminUsersPage;
