import { getCompanyUsers } from '@/server/actions/usersActions';
import { DashboardInnerLayout } from '@/components/shared/DashboardComponents';
import { Hero } from '@/components/shared/reusable/Hero';
import AdminPageComponent from '@/components/routes/admin/users/AdminPageComponent';

const AdminPage = async () => {
    const users = await getCompanyUsers();

    return (
        <DashboardInnerLayout>
            <Hero />
            <AdminPageComponent users={users} />
        </DashboardInnerLayout>
    );
}

export default AdminPage;
