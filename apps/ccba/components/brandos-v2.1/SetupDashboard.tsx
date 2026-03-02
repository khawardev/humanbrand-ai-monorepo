import { DashboardInnerLayout } from './shared/DashboardComponents';
import { SetupManager } from './setup/SetupManager';

export default function SetupDashboard() {
    return (
        <DashboardInnerLayout>
           <SetupManager />
        </DashboardInnerLayout>
    );
}
