
import { getAllUsers } from '@/server/actions/usersActions';
import { getAllSupportTickets } from '@/server/actions/supportActions';
import { getLoomVideos } from '@/server/actions/loomActions';
import { DashboardInnerLayout } from '@/components/shared/DashboardComponents';
import { AdminDashboard } from '@/components/routes/admin/AdminDashboard';
import { Hero } from '@/components/shared/reusable/Hero';

const AdminPage = async () => {
    const users = await getAllUsers();
    const tickets = await getAllSupportTickets();
    const videos = await getLoomVideos();

    return (
        <DashboardInnerLayout>
            <Hero />
            <AdminDashboard users={users} tickets={tickets} videos={videos} />
        </DashboardInnerLayout>
    );
}

export default AdminPage;
