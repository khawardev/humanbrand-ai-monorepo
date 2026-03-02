
import ExportDashboard from '@/components/brandos-v2.1/ExportDashboard';
import { DashboardLayoutHeading } from '@/components/brandos-v2.1/shared/DashboardComponents';
import { Suspense } from 'react';

export default function ExportPage() {
  return (
      <>
        <DashboardLayoutHeading
          title="Export & Handoff"
          subtitle="Package synthesis for Brand Action Model (BAM)."
        />
        <Suspense fallback={<div>Loading Export...</div>}>
          <ExportDashboard engagementId={"345"} />
        </Suspense>
      </>
  );
}
