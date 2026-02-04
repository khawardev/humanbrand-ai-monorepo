import { getAllUsers, getCompanyUsers } from '@/server/actions/usersActions';
import { getAllSupportTickets } from '@/server/actions/supportActions';
import { DashboardInnerLayout } from '@/components/shared/DashboardComponents';
import { AdminDashboard } from '@/components/routes/admin/AdminDashboard';
import { Hero } from '@/components/shared/reusable/Hero';

const AdminPage = async () => {
    const users = await getAllUsers();
    const tickets = await getAllSupportTickets();

    return (
        <DashboardInnerLayout>
            <Hero />
            <AdminDashboard users={users} tickets={tickets as any} />
        </DashboardInnerLayout>
    );
}

export default AdminPage;
